<script setup lang="ts">
import { ref, reactive, onMounted, h , watch} from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';

// import { useRoute } from 'vue-router';
// const route = useRoute();



// Danh sách nhân viên
const nhanVienList = ref([]);

// Lưu lỗi validation
const errors = reactive<Record<string, string>>({});

// Lưu thông báo thành công
const successMessage = ref('');

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã NV' },
  { accessorKey: 'ho_ten', header: 'Họ tên' },
  { accessorKey: 'cccd', header: 'CCCD' },
  { accessorKey: 'dia_chi', header: 'Địa chỉ' },
  { accessorKey: 'so_dien_thoai', header: 'SĐT' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'chuc_vu_id',
    header: 'Chức vụ',
    cell: ({ row }) => {
      const chucVu = chucVuList.value.find(cv => cv.id === row.original.chuc_vu_id);
      return chucVu ? chucVu.ten_chuc_vu : 'Không xác định';
    }
  },
  { accessorKey: 'tai_khoan_id', header: 'ID Tài khoản' }, 
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'outline', onClick: () => xemTaiKhoan(row.original.tai_khoan_id) }, 'Xem TK'),
        h(Button, { variant: 'outline', onClick: () => editNhanVien(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deleteNhanVien(row.original.id) }, 'Xóa')
      ])
  }
];

// Kiểu dữ liệu nhân viên
interface NhanVienPayload {
  id?: string;
  ho_ten: string;
  cccd: string;
  dia_chi: string;
  so_dien_thoai: string;
  email: string;
  chuc_vu_id: string;
  phong_ban_id: string;
  tai_khoan_id: string;
}

// Form nhập liệu
const form = ref<NhanVienPayload>({
  ho_ten: '',
  cccd: '',
  dia_chi: '',
  so_dien_thoai: '',
  email: '',
  chuc_vu_id: '',
  phong_ban_id: '',
  tai_khoan_id: ''
});

// Danh sách tài khoản
const taiKhoanList = ref<{ ID: string }[]>([]);

// Lấy danh sách tài khoản từ API
const fetchTaiKhoanList = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/get_tai_khoans');
  taiKhoanList.value = res.data;
};

// Danh sách chức vụ
const chucVuList = ref<{ id: string; ten_chuc_vu: string }[]>([]);

// Lấy danh sách chức vụ từ API
const fetchChucVuList = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/get_chuc_vus');
    chucVuList.value = res.data;
  } catch (err) {
    console.error('Lỗi tải chức vụ:', err);
  }
};

// Lấy danh sách nhân viên
const fetchNhanVien = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/nhan_viens');
  nhanVienList.value = response.data;
};

// Popup xem tài khoản
const showPopup = ref(false);
const selectedTaiKhoan = ref<{ username: string; password: string } | null>(null);

// API lấy chi tiết tài khoản
const xemTaiKhoan = async (taiKhoanId: string) => {
  if (!taiKhoanId) return;
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/tai_khoans/${taiKhoanId}`);
    selectedTaiKhoan.value = res.data;
    showPopup.value = true;
  } catch (err) {
    console.error('Không lấy được tài khoản:', err);
  }
};
// Validate form trước khi gửi
const validateForm = () => {
  // Xóa lỗi cũ
  Object.keys(errors).forEach(key => (errors[key] = ''));

  let isValid = true;

  if (!form.value.ho_ten) {
    errors.ho_ten = 'Họ tên là bắt buộc';
    isValid = false;
  }

  if (!form.value.cccd) {
    errors.cccd = 'CCCD là bắt buộc';
    isValid = false;
  }

  if (!form.value.dia_chi) {
    errors.dia_chi = 'Địa chỉ là bắt buộc';
    isValid = false;
  }

  if (!form.value.so_dien_thoai) {
    errors.so_dien_thoai = 'Số điện thoại là bắt buộc';
    isValid = false;
  } else if (!/^\d{10}$/.test(form.value.so_dien_thoai)) {
    errors.so_dien_thoai = 'Số điện thoại phải đúng 10 chữ số';
    isValid = false;
  }

  if (!form.value.email) {
    errors.email = 'Email là bắt buộc';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.email = 'Email không hợp lệ';
    isValid = false;
  }

  return isValid;
};

// Thêm / cập nhật nhân viên
const submitForm = async () => {
  successMessage.value = '';

  // Nếu form không hợp lệ thì dừng
  if (!validateForm()) {
    return;
  }

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/nhan_viens/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật nhân viên thành công!';
    } else {
      await axios.post('http://127.0.0.1:8000/api/nhan_viens', form.value);
      successMessage.value = 'Thêm nhân viên thành công!';
    }
    resetForm();
    fetchNhanVien();
  } catch (err: any) {
    if (err.response && err.response.status === 422) {
      const validationErrors = err.response.data.errors;
      for (const key in validationErrors) {
        errors[key] = validationErrors[key][0];
      }
    } else {
      console.error('Lỗi không xác định:', err);
    }
  }
};

// Chỉnh sửa nhân viên
const editNhanVien = (nv: NhanVienPayload) => {
  form.value = { ...nv };
};

// Xóa nhân viên
const deleteNhanVien = async (id: string) => {
  await axios.delete(`http://127.0.0.1:8000/api/nhan_viens/${id}`);
  fetchNhanVien();
};

// Reset form
const resetForm = () => {
  form.value = {
    ho_ten: '',
    cccd: '',
    dia_chi: '',
    so_dien_thoai: '',
    email: '',
    chuc_vu_id: '',
    phong_ban_id: '',
    tai_khoan_id: ''
  };
  Object.keys(errors).forEach(key => (errors[key] = ''));
};


// Theo dõi thay đổi đường dẫn



onMounted(() => {
  fetchNhanVien();
  fetchTaiKhoanList();
  fetchChucVuList();
});

// watch(
//   () => route.fullPath,
//   () => {
//     fetchNhanVien();
//   },
//   { immediate: true }
// );

</script>


<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Nhân viên</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <label>Họ tên</label>
        <Input type="text" v-model="form.ho_ten" />
        <small v-if="errors.ho_ten" class="text-red-500">{{ errors.ho_ten }}</small>
      </div>
      <div class="grid gap-y-2">
        <label>CCCD</label>
        <Input type="text" v-model="form.cccd" />
        <small v-if="errors.cccd" class="text-red-500">{{ errors.cccd }}</small>
      </div>
      <div class="grid gap-y-2">
        <label>Địa chỉ</label>
        <Input type="text" v-model="form.dia_chi" />
        <small v-if="errors.dia_chi" class="text-red-500">{{ errors.dia_chi }}</small>
      </div>
      <div class="grid gap-y-2">
        <label>Số điện thoại</label>
        <Input type="text" v-model="form.so_dien_thoai" />
        <small v-if="errors.so_dien_thoai" class="text-red-500">{{ errors.so_dien_thoai }}</small>
      </div>
      <div class="grid gap-y-2">
        <label>Email</label>
        <Input type="email" v-model="form.email" />
        <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
      </div>
      <div class="grid gap-y-2">
        <label>Chức vụ</label>
        <select v-model="form.chuc_vu_id" class="border rounded p-2">
          <option value="">-- Chọn chức vụ --</option>
          <option v-for="cv in chucVuList" :key="cv.id" :value="cv.id">
            {{ cv.ten_chuc_vu }}
          </option>
        </select>
        <small v-if="errors.chuc_vu_id" class="text-red-500">{{ errors.chuc_vu_id }}</small>
      </div>
      <div class="grid gap-y-2">
        <label>ID Tài khoản</label>
        <select v-model="form.tai_khoan_id" class="border rounded p-2">
          <option value="">-- Chọn ID tài khoản --</option>
          <option v-for="tk in taiKhoanList" :key="tk.ID" :value="tk.ID">
            {{ tk.ID }}
          </option>
        </select>
        <small v-if="errors.tai_khoan_id" class="text-red-500">{{ errors.tai_khoan_id }}</small>
      </div>
      <div class="col-span-2 flex gap-2">
        <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Nhân viên</Button>
        <Button type="button" variant="outline" @click="resetForm">Reset</Button>
      </div>
    </form>

    <div v-if="successMessage" class="mb-4 text-green-600 font-semibold">
      {{ successMessage }}
    </div>
    <DataTable :columns="columns" :data="nhanVienList"></DataTable>
  </div>
  <!-- Popup -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center" @click.self="showPopup = false">
      <div class="bg-white rounded-lg p-4 min-w-[300px]">
        <h3 class="font-bold text-lg mb-2">Thông tin tài khoản</h3>
        <p><strong>Username:</strong> {{ selectedTaiKhoan?.username }}</p>
        <p><strong>Password:</strong> {{ selectedTaiKhoan?.password }}</p>
        <div class="mt-4 text-right">
          <Button variant="outline" @click="showPopup = false">Đóng</Button>
        </div>
      </div>
    </div>
</template>
