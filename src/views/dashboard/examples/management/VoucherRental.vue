<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import html2pdf from "html2pdf.js";


// ================== State ==================
const phieuList = ref<any[]>([]);
const nhanVienList = ref<any[]>([]);
const nguoiThueList = ref<any[]>([]);
const phongHocList = ref<any[]>([]);

const errors = reactive<Record<string, string>>({});
const successMessage = ref('');

// Popup xem phiếu
const showViewPopup = ref(false);
const selectedPhieu = ref<any>(null);

// ================== Form ==================
interface PhieuPayload {
  id?: string;
  nhan_vien_id: string;
  nguoi_thue_phong_id: string;
  phong_hoc_id: string;
  tu_ngay: string;
  den_ngay: string;
  lich_thue: string;
  trang_thai: string;
  ngay_lap: string;
}

const form = ref<PhieuPayload>({
  nhan_vien_id: '',
  nguoi_thue_phong_id: '',
  phong_hoc_id: '',
  tu_ngay: '',
  den_ngay: '',
  lich_thue: '',
  trang_thai: '',
  ngay_lap: ''
});

// ================== Columns ==================
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã phiếu' },
  {
    accessorKey: 'nhan_vien_id',
    header: 'Nhân viên',
    cell: ({ row }) => {
      const nv = nhanVienList.value.find(n => n.id === row.original.nhan_vien_id);
      return nv ? nv.ho_ten : 'Không xác định';
    }
  },
  {
    accessorKey: 'nguoi_thue_phong_id',
    header: 'Người thuê',
    cell: ({ row }) => {
      const nt = nguoiThueList.value.find(n => n.id === row.original.nguoi_thue_phong_id);
      return nt ? nt.ho_ten : 'Không xác định';
    }
  },
  {
    accessorKey: 'phong_hoc_id',
    header: 'Phòng học',
    cell: ({ row }) => {
      const ph = phongHocList.value.find(p => p.id === row.original.phong_hoc_id);
      return ph ? ph.so_phong : 'Không xác định';
    }
  },
  
  { accessorKey: 'tu_ngay', header: 'Từ ngày' },
  { accessorKey: 'den_ngay', header: 'Đến ngày' },
  { accessorKey: 'lich_thue', header: 'Lịch thuê' },
  {
    accessorKey: 'trang_thai',
    header: 'Trạng thái',
       cell: ({ row }) => {
      const value = row.original.trang_thai;
      let classes =
        'px-2 py-1 rounded text-white text-sm font-medium ';
      switch (value) {
        case 'Đã có hợp đồng':
          classes += 'bg-green-500';
          break;
        case 'Chưa có hợp đồng':
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
        h(Button, { variant: 'secondary', onClick: () => viewPhieu(row.original) }, 'Xem'),
        h(Button, { variant: 'outline', onClick: () => editPhieu(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deletePhieu(row.original.id) }, 'Xóa')
      ])
  }
  
];

// ================== API Calls ==================
const fetchPhieu = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/phieu_thue_phongs');
  phieuList.value = res.data.data ?? res.data;
};

const fetchNhanVien = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/nhan_viens');
  nhanVienList.value = res.data.data ?? res.data;
};

const fetchNguoiThue = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/nguoi_thue_phongs');
  nguoiThueList.value = res.data.data ?? res.data;
};

const fetchPhongHoc = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/phong_hocs');
  phongHocList.value = res.data.data ?? res.data;
};

// ================== CRUD ==================
const validateForm = () => {
  Object.keys(errors).forEach(k => (errors[k] = ''));
  let valid = true;

  if (!form.value.nhan_vien_id) {
    errors.nhan_vien_id = 'Vui lòng chọn nhân viên';
    valid = false;
  }
  if (!form.value.nguoi_thue_phong_id) {
    errors.nguoi_thue_phong_id = 'Vui lòng chọn người thuê';
    valid = false;
  }
  if (!form.value.phong_hoc_id) {
    errors.phong_hoc_id = 'Vui lòng chọn phòng học';
    valid = false;
  }
  if (!form.value.tu_ngay) {
    errors.tu_ngay = 'Từ ngày là bắt buộc';
    valid = false;
  }
  if (!form.value.den_ngay) {
    errors.den_ngay = 'Đến ngày là bắt buộc';
    valid = false;
  }

  return valid;
};

const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/phieu_thue_phongs/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật phiếu thuê thành công!';
    } else {
      await axios.post('http://127.0.0.1:8000/api/phieu_thue_phongs', form.value);
      successMessage.value = 'Thêm phiếu thuê thành công!';
    }
    resetForm();
    fetchPhieu();
  } catch (err) {
    console.error(err);
  }
};

const editPhieu = (ph: PhieuPayload) => {
  form.value = { ...ph };
};

const deletePhieu = async (id: string) => {
  await axios.delete(`http://127.0.0.1:8000/api/phieu_thue_phongs/${id}`);
  fetchPhieu();
};

const resetForm = () => {
  form.value = {
    nhan_vien_id: '',
    nguoi_thue_phong_id: '',
    phong_hoc_id: '',
    tu_ngay: '',
    den_ngay: '',
    lich_thue: ''
  };
  Object.keys(errors).forEach(k => (errors[k] = ''));
};

// ================== Xem phiếu thuê ==================
const viewPhieu = (ph: any) => {
  selectedPhieu.value = {
    ...ph,
    nhan_vien: nhanVienList.value.find(n => n.id === ph.nhan_vien_id),
    nguoi_thue: nguoiThueList.value.find(n => n.id === ph.nguoi_thue_phong_id),
    phong: phongHocList.value.find(p => p.id === ph.phong_hoc_id)
  };
  showViewPopup.value = true;
};
// Xuất PDF phiếu thuê
const exportPhieuThuePDF = async (pt: any) => {
  if (!pt) return;
  const element = document.getElementById(`phieu-thue-${pt.id}`);
  if (!element) return;

  const clone = element.cloneNode(true) as HTMLElement;
  const actions = clone.querySelector('.no-print');
  if (actions) actions.remove();

  const opt = {
    margin: 10,
    filename: `phieu-thue-${pt.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  await html2pdf().set(opt).from(clone).save();
};

// ================== Mounted ==================
onMounted(() => {
  fetchPhieu();
  fetchNhanVien();
  fetchNguoiThue();
  fetchPhongHoc();
});
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Phiếu thuê phòng</h1>
    <!-- Form -->
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <!-- Nhân viên -->
      <div class="grid gap-y-2">
        <label>Nhân viên</label>
        <select v-model="form.nhan_vien_id" class="border rounded p-2">
          <option value="">-- Chọn nhân viên --</option>
          <option v-for="nv in nhanVienList" :key="nv.id" :value="nv.id">
            {{ nv.ho_ten }}
          </option>
        </select>
        <small v-if="errors.nhan_vien_id" class="text-red-500">{{ errors.nhan_vien_id }}</small>
      </div>
      <!-- Người thuê -->
      <div class="grid gap-y-2">
        <label>Người thuê</label>
        <select v-model="form.nguoi_thue_phong_id" class="border rounded p-2">
          <option value="">-- Chọn người thuê --</option>
          <option v-for="nt in nguoiThueList" :key="nt.id" :value="nt.id">
            {{ nt.ho_ten }}
          </option>
        </select>
        <small v-if="errors.nguoi_thue_phong_id" class="text-red-500">{{ errors.nguoi_thue_phong_id }}</small>
      </div>
      <!-- Phòng học -->
      <div class="grid gap-y-2">
        <label>Phòng học</label>
        <select v-model="form.phong_hoc_id" class="border rounded p-2">
          <option value="">-- Chọn phòng học --</option>
          <option v-for="ph in phongHocList" :key="ph.id" :value="ph.id">
            {{ ph.so_phong }}
          </option>
        </select>
        <small v-if="errors.phong_hoc_id" class="text-red-500">{{ errors.phong_hoc_id }}</small>
      </div>
      <!-- Ngày -->
      <div class="grid gap-y-2">
        <label>Từ ngày</label>
        <Input type="date" v-model="form.tu_ngay" />
        <small v-if="errors.tu_ngay" class="text-red-500">{{ errors.tu_ngay }}</small>
      </div>
      <div class="grid gap-y-2">
        <label>Đến ngày</label>
        <Input type="date" v-model="form.den_ngay" />
        <small v-if="errors.den_ngay" class="text-red-500">{{ errors.den_ngay }}</small>
      </div>
      <div class="grid gap-y-2">
        <label>Ngày lập</label>
        <Input type="date" v-model="form.ngay_lap" />
        <small v-if="errors.ngay_lap" class="text-red-500">{{ errors.ngay_lap }}</small>
      </div>
      <!-- Lịch thuê -->
      <div class="grid gap-y-2 col-span-2">
        <label>Lịch thuê</label>
        <Input type="text" v-model="form.lich_thue" placeholder="Nhập lịch thuê" />
      </div>
      <!-- Trạng thái -->
      <div class="grid gap-y-2 col-span-2">
        <label>Trạng thái</label>
        <select v-model="form.trang_thai" class="border rounded p-2">
          <option value="">-- Chọn trạng thái --</option>
          <option value="Đã có hợp đồng">Đã có hợp đồng</option>
          <option value="Chưa có hợp đồng">Chưa có hợp đồng</option>
        </select>
      </div>
      <!-- Nút -->
      <div class="col-span-2 flex gap-2">
        <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Phiếu</Button>
        <Button type="button" variant="outline" @click="resetForm">Reset</Button>
      </div>
    </form>

    <!-- Thông báo -->
    <div v-if="successMessage" class="mb-4 text-green-600 font-semibold">
      {{ successMessage }}
    </div>

    <!-- Bảng -->
    <DataTable :columns="columns" :data="phieuList" />
    <!-- Popup xem phiếu -->
    <div
      v-if="showViewPopup"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      @click.self="showViewPopup = false"
    >
      <div class="bg-white rounded-lg p-6 min-w-[400px] shadow-lg">
        <div class="phieu-thue" :id="`phieu-thue-${selectedPhieu?.id}`">
            <h3 class="font-semibold text-center text-xl mb-2">Phiếu thuê phòng</h3>
            <h6 class="font-semibold text-center text-sm mb-2">{{ selectedPhieu?.id }}</h6>
            <p class="text-center text-sm mb-4">
              Ngày thuê: {{ selectedPhieu?.tu_ngay }} → Hạn: {{ selectedPhieu?.tu_ngay  }}
            </p>

            <div class="grid grid-cols-2 gap-4 mb-2 text-sm">
              <div class="space-y-1">
                <p><b>Tên khách:</b> {{ selectedPhieu?.nguoi_thue?.ho_ten}}</p>
                <p><b>SĐT:</b> {{ selectedPhieu?.nguoi_thue?.so_dien_thoai }}</p>
                <p><b>CMND/CCCD:</b> {{ selectedPhieu?.nguoi_thue?.cccd }}</p>
                <p><b>email:</b> {{ selectedPhieu?.nguoi_thue?.email }}</p>
              </div>
              <div class="space-y-1">
                <p><b>Phòng:</b> {{ selectedPhieu?.phong?.so_phong  }}</p>
                <p><b>Gía phòng</b> {{ selectedPhieu?.phong?.gia_phong .toLocaleString() }} VNĐ</p>
              </div>
            </div>
            <div class="absolute text-xs text-gray-500">
              <p>Nhân viên lập: {{selectedPhieu?.nhan_vien?.ho_ten || 'Chưa có' }}</p>
            </div>
        </div>
        <div class="mt-4 text-right">
          <Button variant="outline" @click="showViewPopup = false">Đóng</Button>
          <Button variant="secondary" @click="exportPhieuThuePDF(selectedPhieu)">Xuất PDF</Button>
        </div>
      </div>
    </div>
  </div>
</template>
