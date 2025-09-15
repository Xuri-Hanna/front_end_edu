<script setup lang="ts">
import { ref, reactive, onMounted, h, computed } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import html2pdf from "html2pdf.js";

const hopDongList = ref<any[]>([]);

// Modal tạo hóa đơn
const showHoaDonModal = ref(false);
const selectedHopDong = ref<any>(null);
const nhanVienList = ref<any[]>([]);

const fetchNhanVien = async () => {
  const res = await axios.get("http://127.0.0.1:8000/api/nhan_viens");
  nhanVienList.value = res.data.data ?? res.data;
};

const hoaDonForm = reactive({
  hop_dong_id: '',
  ngay_lap: '',
  tong_tien: '',
  nhan_vien_id: ''
});

const hoaDonErrors = reactive<Record<string, string>>({});
const hoaDonSuccess = ref('');

// Sidebar danh sách hóa đơn
const hoaDonList = ref<any[]>([]);
const showHoaDonList = ref(false);

// Bộ lọc trạng thái
const filterTrangThai = ref(''); // '' = tất cả



// Định nghĩa cột bảng hợp đồng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã hợp đồng' },
  { accessorKey: 'trang_thai',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const value = row.original.trang_thai;
      let classes =
        'px-2 py-1 rounded text-white text-sm font-medium ';
      switch (value) {
        case 'Đã thanh toán':
          classes += 'bg-green-500';
          break;
        case 'Đã hủy':
          classes += 'bg-gray-500';
          break;
        case 'Chưa thanh toán':
          classes += 'bg-red-500';
          break;
        default:
          classes += 'bg-slate-400';
      }
      return h('span', { class: classes }, value);
    }
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { onClick: () => openHoaDonModal(row.original) }, { default: () => 'Tạo hóa đơn' }),
        h(Button, { variant: 'outline', onClick: () => viewHoaDon(row.original.id) }, { default: () => 'Xem hóa đơn' })
      ])
  }
];


// Lọc danh sách theo trạng thái
const filteredHopDongList = computed(() => {
  if (!filterTrangThai.value) return hopDongList.value;
  return hopDongList.value.filter(hd => hd.trang_thai === filterTrangThai.value);
});
// ================== API ==================
const fetchHopDong = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/hop_dong_thue_phongs');
  hopDongList.value = res.data.data ?? res.data;
};

// mở modal tạo hóa đơn
const openHoaDonModal = (hopDong: any) => {
  selectedHopDong.value = hopDong;
  hoaDonForm.hop_dong_id = hopDong.id;
  hoaDonForm.nhan_vien_id ='';
  hoaDonForm.ngay_lap = '';
  hoaDonForm.tong_tien = '';
  showHoaDonModal.value = true;
};

const closeHoaDonModal = () => {
  showHoaDonModal.value = false;
  Object.keys(hoaDonForm).forEach(k => hoaDonForm[k as keyof typeof hoaDonForm] = '');
  Object.keys(hoaDonErrors).forEach(k => (hoaDonErrors[k] = ''));
  hoaDonSuccess.value = '';
};

// Submit tạo hóa đơn
const submitHoaDon = async () => {
  try {
     console.log("Dữ liệu gửi đi:", { ...hoaDonForm }); // kiểm tra nhan_vien_id có chưa
    const res = await axios.post('http://127.0.0.1:8000/api/hoa_don_thue_phongs', hoaDonForm);
    hoaDonSuccess.value = 'Tạo hóa đơn thành công!';
    console.log(res.data);
  } catch (err: any) {
    if (err.response?.status === 422) {
      const validationErrors = err.response.data.errors;
      for (const key in validationErrors) {
        hoaDonErrors[key] = validationErrors[key][0];
      }
    }
  }
};

// Xem danh sách hóa đơn
const viewHoaDon = async (hopDongId: string) => {
  // const res = await axios.get(`http://127.0.0.1:8000/api/hoa_don_thue_phong/hop_dong/${hopDongId}`);
  // hoaDonList.value = (res.data.data ?? []).sort((a, b) => (a.trang_thai === 'Chưa thanh toán' ? -1 : 1));
  // showHoaDonList.value = true;

  //cái này t sửa từ lâu r nhé 
  const res = await axios.get(
    `http://127.0.0.1:8000/api/hoa_don_thue_phong/hop_dong/${hopDongId}`
  );

  // tìm trạng thái hợp đồng trong hopDongList
  const hopDong = hopDongList.value.find(hd => hd.id === hopDongId);

  hoaDonList.value = (res.data.data ?? []).map((hd: any) => ({
    ...hd,
    hop_dong_trang_thai: hopDong?.trang_thai ?? '---'
  }));

  showHoaDonList.value = true;
};

// Xuất PDF
const exportHoaDonPDF = async (hd: any) => {
  const element = document.getElementById(`hoa-don-${hd.id}`);
  if (!element) return;

  const clone = element.cloneNode(true) as HTMLElement;
  const actions = clone.querySelector('.no-print');
  if (actions) actions.remove();

  const opt = {
    margin: 10,
    filename: `hoa-don-${hd.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(clone).save();

  try {
    await axios.patch(`http://127.0.0.1:8000/api/hoa_don_thue_phongs/${hd.id}/trang_thai`);
    const index = hoaDonList.value.findIndex(item => item.id === hd.id);
    if (index !== -1) hoaDonList.value[index].trang_thai = "Đã thanh toán";
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái:", err);
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

onMounted(() => {
  fetchHopDong();
  fetchNhanVien();
});

</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Hóa đơn thuê phòng</h1>
    <!-- Bộ lọc trạng thái -->
    <div class="flex items-center gap-2 mb-4">
      <label class="font-medium">Lọc theo trạng thái:</label>
      <select v-model="filterTrangThai" class="border p-2 rounded">
        <option value="">Tất cả</option>
        <option value="Chưa thanh toán">Chưa thanh toán</option>
        <option value="Đã thanh toán">Đã thanh toán</option>
      </select>
    </div>

    <!-- <DataTable :columns="columns" :data="hopDongList" /> -->
    <DataTable :columns="columns" :data="filteredHopDongList" />

    <!-- Modal tạo hóa đơn -->
    <div v-if="showHoaDonModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-[500px]">
        <h2 class="text-lg font-bold mb-4">Tạo hóa đơn cho HĐ: {{ selectedHopDong?.id }}</h2>

        <form @submit.prevent="submitHoaDon" class="space-y-3">
          <div>
            <label>Ngày lập</label>
            <Input type="date" v-model="hoaDonForm.ngay_lap" />
            <small v-if="hoaDonErrors.ngay_lap" class="text-red-500">{{ hoaDonErrors.ngay_lap }}</small>
          </div>
          <div>
            <label>Người lập hóa đơn</label>
            <select v-model="hoaDonForm.nhan_vien_id" class="border rounded w-full p-2">
              <option value="">-- Chọn nhân viên --</option>
              <option v-for="nv in nhanVienList" :key="nv.id" :value="nv.id">
                {{ nv.ho_ten }}
              </option>
            </select>
            <small v-if="hoaDonErrors.nhan_vien_id" class="text-red-500">{{ hoaDonErrors.nhan_vien_id }}</small>
          </div>
          <div>
            <label>Tổng tiền</label>
            <Input type="number" v-model="hoaDonForm.tong_tien" />
            <small v-if="hoaDonErrors.tong_tien" class="text-red-500">{{ hoaDonErrors.tong_tien }}</small>
          </div>
          <div class="flex gap-2 mt-4">
            <Button type="submit">Tạo hóa đơn</Button>
            <Button type="button" variant="outline" @click="closeHoaDonModal">Đóng</Button>
          </div>
        </form>

        <div v-if="hoaDonSuccess" class="mt-2 text-green-600">{{ hoaDonSuccess }}</div>
      </div>
    </div>

    <!-- Sidebar danh sách hóa đơn -->
    <transition name="slide">
      <div v-if="showHoaDonList" class="fixed inset-0 flex justify-end z-50">
        <div class="absolute inset-0 bg-black bg-opacity-50" @click="showHoaDonList = false"></div>
        <div class="relative bg-white w-[600px] h-full shadow-lg p-6 overflow-y-auto">
          <h2 class="text-lg font-bold mb-4 text-center">Danh sách hóa đơn</h2>

          <div v-for="hd in hoaDonList" :key="hd.id" class="border rounded p-4 mb-4 shadow-sm" :id="`hoa-don-${hd.id}`">
          <!-- <div v-for="hd in filteredHopDongList" :key="hd.id" class="border rounded p-4 mb-4 shadow-sm" :id="`hoa-don-${hd.id}`"> -->

            <h3 class="font-semibold text-center text-xl mb-2">Hóa đơn thuê phòng</h3>
            <p class="text-center text-sm mb-4">Ngày lập: {{ hd.ngay_lap }}</p>

            <div class="grid grid-cols-2 gap-4 mb-2 text-sm">
              <div>
                <p><b>Mã hợp đồng:</b> {{ hd.hop_dong_id }}</p>
                <p><b>Mã hóa đơn:</b> {{ hd.id }}</p>
              </div>
              <div>
                <p><b>Tổng tiền:</b> {{ formatCurrency(hd.tong_tien) }}</p>
              </div>
            </div>
            <div class="mt-6 text-sm">
              <p><b>Người lập hóa đơn:</b> {{ hd.nhan_vien?.ho_ten ?? '---' }}</p>
            </div>

            <div class="flex justify-between text-center mt-12">
              <div>
                <p><b>Người lập hóa đơn</b></p>
                <p class="italic text-gray-500">(Ký và ghi rõ họ tên)</p>
                <div class="h-16"></div>
                <p>{{ hd.nhan_vien?.ho_ten ?? '' }}</p>
              </div>
              <div>
                <p><b>Người nộp tiền</b></p>
                <p class="italic text-gray-500">(Ký và ghi rõ họ tên)</p>
                <div class="h-16"></div>
              </div>
            </div>
            <div class="no-print flex justify-end gap-2 mt-2">
              <Button size="sm" @click="exportHoaDonPDF(hd)">Xuất PDF</Button>
            </div>
          </div>
          <div class="flex justify-end">
            <Button variant="outline" @click="showHoaDonList = false">Đóng</Button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
.slide-enter-to, .slide-leave-from { transform: translateX(0%); }
@media print { .no-print { display: none !important; } }
</style>
