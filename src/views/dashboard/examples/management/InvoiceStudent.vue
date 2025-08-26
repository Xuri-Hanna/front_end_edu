<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import html2pdf from "html2pdf.js";

// Danh sách học sinh
const hocSinhList = ref([]);
// Danh sách nhân viên
const nhanVienList = ref<any[]>([]);
// Danh sách lớp mà học sinh theo học
const lopHocList = ref<any[]>([]);

// Modal hóa đơn
const showHoaDonModal = ref(false);
const selectedHocSinh = ref<any>(null);

// Form hóa đơn
const hoaDonForm = reactive({
  hoc_sinh_id: '',
  lop_hoc_id: '',
  nhan_vien_id: '',
  ngay_het_han: ''
});

const hoaDonErrors = reactive<Record<string, string>>({});
const hoaDonSuccess = ref('');

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã HS' },
  { accessorKey: 'ho_ten', header: 'Họ tên' },
  { accessorKey: 'so_dien_thoai', header: 'SĐT' },
  { accessorKey: 'gioi_tinh', header: 'Giới tính' },
  { accessorKey: 'ngay_sinh', header: 'Ngày sinh' },
  { accessorKey: 'dia_chi', header: 'Địa chỉ' },
  { accessorKey: 'so_phu_huynh', header: 'SĐT Phụ huynh' },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(
          Button,
          {
            onClick: () => openHoaDonModal(row.original),
          },
          { default: () => 'Tạo hóa đơn' }
        ),
        h(
          Button,
          {
            variant: 'outline',
            onClick: () => viewHoaDon(row.original.id),
          },
          { default: () => 'Xem hóa đơn' }
        )
      ])
  }
];

const fetchNhanVien = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/nhan_viens');
  nhanVienList.value = res.data; 
};
// Mở modal hóa đơn
const openHoaDonModal = async (hocSinh: any) => {
  selectedHocSinh.value = hocSinh;
  hoaDonForm.hoc_sinh_id = hocSinh.id; // gán luôn ID học sinh
  try{
    const res = await axios.get(`http://127.0.0.1:8000/api/hoc_sinh/${hocSinh.id}/lop-hoc`);
    lopHocList.value = res.data;
    await fetchNhanVien();
  }catch(e){
    console.log('Looix khi load',e);
  }

  showHoaDonModal.value = true;
};

// Đóng modal
const closeHoaDonModal = () => {
  showHoaDonModal.value = false;
Object.keys(hoaDonForm).forEach(k => {
  hoaDonForm[k as keyof typeof hoaDonForm] = '';
});
  Object.keys(hoaDonErrors).forEach(k => (hoaDonErrors[k] = ''));
  hoaDonSuccess.value = '';
};

// Submit tạo hóa đơn
const submitHoaDon = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/hoa_don_hoc_phis', hoaDonForm);
    hoaDonSuccess.value = 'Tạo hóa đơn thành công!';
    console.log(response.data);
  } catch (err: any) {
    if (err.response?.status === 422) {
      const validationErrors = err.response.data.errors;
      for (const key in validationErrors) {
        hoaDonErrors[key] = validationErrors[key][0];
      }
    }
  }
};

// xem hóa đơn
const hoaDonList = ref<any[]>([]);
const showHoaDonList = ref(false);

const viewHoaDon = async (hocSinhId: string) => {
  const res = await axios.get(`http://127.0.0.1:8000/api/hoa_don/hoc_sinh/${hocSinhId}`);
  hoaDonList.value = res.data.sort((a, b) => (a.trang_thai === 'Chưa thanh toán' ? -1 : 1));
  hoaDonList.value = res.data;
  showHoaDonList.value = true;
  console.log('DU LIUE',res.data);
};
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};
// Xóa hóa đơn
const deleteHoaDon = async (id: number) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/hoa_don_hoc_phis/${id}`);
    hoaDonList.value = hoaDonList.value.filter(hd => hd.id !== id);
  } catch (err) {
    console.error("Lỗi khi xóa:", err);
  }
};
// Hàm xuất PDF
const exportHoaDonPDF = async (hd: any) => {

  const element = document.getElementById(`hoa-don-${hd.id}`);
  if (!element) return;

  // clone node để không ảnh hưởng đến giao diện
  const clone = element.cloneNode(true) as HTMLElement;

  // tìm và xóa các nút trong clone
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

  // Gọi API cập nhật trạng thái
  try {
    const res = await axios.patch(`http://127.0.0.1:8000/api/hoa_don_hoc_phis/${hd.id}/trang_thai`);
    // Cập nhật trạng thái trong danh sách local
    const index = hoaDonList.value.findIndex(item => item.id === hd.id);
    if (index !== -1) {
      hoaDonList.value[index].trang_thai = "Đã thanh toán";
    }
    // Sắp xếp lại danh sách (Chưa thanh toán lên trên)
    hoaDonList.value.sort((a, b) => a.trang_thai === "Chưa thanh toán" ? -1 : 1);
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái:", err);
  }
};


// Lấy danh sách học sinh
const fetchHocSinh = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/hoc_sinhs');
  hocSinhList.value = response.data;
};

onMounted(fetchHocSinh);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Học sinh</h1>

    <!-- Bảng học sinh -->
    <DataTable :columns="columns" :data="hocSinhList"></DataTable>

    <!-- Modal hóa đơn -->
    <div
      v-if="showHoaDonModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg w-[500px]">
        <h2 class="text-lg font-bold mb-4">
          Tạo hóa đơn cho {{ selectedHocSinh?.ho_ten }}
        </h2>

        <form @submit.prevent="submitHoaDon" class="space-y-3">
          <div>
            <label>Lớp học</label>
            <select v-model="hoaDonForm.lop_hoc_id" class="border rounded w-full p-2">
              <option value="">-- Chọn lớp học --</option>
              <option v-for="lop in lopHocList" :key="lop.id" :value="lop.id">
                {{ lop.ten_lop }}
              </option>
            </select>
            <small v-if="hoaDonErrors.lop_hoc_id" class="text-red-500">{{ hoaDonErrors.lop_hoc_id }}</small>
          </div>
          <div>
            <label>Nhân viên lập</label>
            <select v-model="hoaDonForm.nhan_vien_id" class="border rounded w-full p-2">
              <option value="">-- Chọn nhân viên --</option>
              <option v-for="nv in nhanVienList" :key="nv.id" :value="nv.id">
                {{ nv.ho_ten }}
              </option>
            </select>
            <small v-if="hoaDonErrors.nhan_vien_id" class="text-red-500">{{ hoaDonErrors.nhan_vien_id }}</small>
          </div>
          <div>
            <label>Ngày hết hạn</label>
            <Input type="date" v-model="hoaDonForm.ngay_het_han" />
            <small v-if="hoaDonErrors.ngay_het_han" class="text-red-500">{{
              hoaDonErrors.ngay_het_han
            }}</small>
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
      <!-- lớp nền mờ -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showHoaDonList = false"></div>
      
      <!-- panel hóa đơn -->
      <div class="relative bg-white w-[600px] h-full shadow-lg p-6 overflow-y-auto">
        <h2 class="text-lg font-bold mb-4 text-center">Danh sách hóa đơn</h2>

        <div v-for="hd in hoaDonList" :key="hd.id" class="border rounded p-4 mb-4 shadow-sm" :id="`hoa-don-${hd.id}`">
          <h3 class="font-semibold text-center text-xl mb-2">Hóa đơn học phí</h3>
          <p class="text-center text-sm mb-4">
            Thời hạn: {{ hd.ngay_lap }} → {{ hd.ngay_het_han }}
          </p>

          <div class="grid grid-cols-2 gap-4 mb-2 text-sm">
            <div class="space-y-1">
              <p><b>Tên học sinh:</b> {{ hd.hoc_sinh.ho_ten }}</p>
              <p><b>Ngày sinh:</b> {{ hd.hoc_sinh.ngay_sinh }}</p>
              <p><b>Giới tính:</b> {{ hd.hoc_sinh.gioi_tinh }}</p>
              <p><b>SĐT bố/mẹ:</b> {{ hd.hoc_sinh.so_phu_huynh }}</p>
            </div>
            <div class="space-y-1">
              <p><b>Tên lớp:</b> {{ hd.lop_hoc.ten_lop }}</p>
              <p><b>Số buổi học:</b> {{ hd.lop_hoc.so_buoi }}</p>
              <p><b>Đơn giá:</b> {{ hd.lop_hoc.don_gia.toLocaleString() }}</p>
            </div>
          </div>

          <p class="text-red-600 font-bold text-right mt-3 text-lg">
            Tổng tiền cần thanh toán: {{ formatCurrency( hd.tong_tien) }} VNĐ
          </p>
          <div class="absolute text-xs text-gray-500">
            <p>Mã HĐ: {{ hd.id }}</p>
            <p>Nhân viên lập: {{ hd.nhan_vien?.ho_ten || 'Chưa có' }}</p>
          </div>
              <!-- Nút hành động -->
           <div class="flex gap-2 justify-end mt-3">
            <div class="no-print">
              <Button size="sm" variant="destructive" @click="deleteHoaDon(hd.id)">Xóa</Button>
              <Button size="sm" @click="exportHoaDonPDF(hd)">Xuất PDF</Button>
               <p class="mt-2 font-semibold"
                :class="hd.trang_thai === 'Chưa thanh toán' ? 'text-red-600' : 'text-green-600'">
                Trạng thái: {{ hd.trang_thai }}
              </p>
            </div>
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
<!-- Thêm CSS hiệu ứng -->
<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
.slide-enter-to, .slide-leave-from {
  transform: translateX(0%);
}
@media print {
  .no-print {
    display: none !important;
  }
}

</style>