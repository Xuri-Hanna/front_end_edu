<script setup lang="ts">
import { ref, reactive, onMounted, h, watch } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';



// Danh sách giáo viên
const giaoVienList = ref([]);

// Lưu lỗi validation
const errors = reactive<Record<string, string>>({});

// Lưu thông báo thành công
const successMessage = ref('');
// Lưu thông báo thất bại
const errorMessage = ref('');


// Quản lý form popup
const showForm = ref(false);
const openAddForm = () => {
  resetForm();
  showForm.value = true;
};
const editGiaoVien = (gv: GiaoVienPayload) => {
  form.value = { ...gv };
  showForm.value = true;
};
const closeForm = () => {
  showForm.value = false;
  resetForm();
};

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã GV' },
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
    accessorKey: 'don_vi_cong_tac_id',
    header: 'Đơn vị công tác',
    cell: ({ row }) => {
      const donVi = donViList.value.find(dv => dv.id === row.original.don_vi_cong_tac_id);
      return donVi ? donVi.ten_don_vi : 'Không xác định';
    }
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'outline', onClick: () => xemTaiKhoan(row.original.tai_khoan_id) }, 'Xem TK'),
        h(Button, { variant: 'outline', onClick: () => editGiaoVien(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deleteGiaoVien(row.original.id) }, 'Xóa')
      ])
  }
];

// Kiểu dữ liệu giáo viên
interface GiaoVienPayload {
  id?: string;
  ho_ten: string;
  cccd: string;
  dia_chi: string;
  so_dien_thoai: string;
  email: string;
  chuc_vu_id: string;
  tai_khoan_id: string;
  don_vi_cong_tac_id: string;
}

// Form nhập liệu
const form = ref<GiaoVienPayload>({
  ho_ten: '',
  cccd: '',
  dia_chi: '',
  so_dien_thoai: '',
  email: '',
  chuc_vu_id: '',
  tai_khoan_id: '',
  don_vi_cong_tac_id: ''
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

// Danh sách đơn vị công tác
const donViList = ref<{ id: string; ten_don_vi: string }[]>([]);

// Lấy danh sách đơn vị công tác từ API
const fetchDonViList = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/ten_don_vis');
    donViList.value = res.data;
    console.log ('data:',res.data);
  } catch (err) {
    console.error('Lỗi tải đơn vị công tác:', err);
  }
};

const keyword = ref('')

// Lấy danh sách giáo viên
const fetchGiaoVien = async () => {
//  const response = await axios.get('http://127.0.0.1:8000/api/giao_viens');
  let url = 'http://127.0.0.1:8000/api/giao_viens';
  if (keyword.value) {
    url = `http://127.0.0.1:8000/api/giao_viens/search?keyword=${keyword.value}`;
  }
  const response = await axios.get(url);
  giaoVienList.value = response.data;
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

// Validate form
const validateForm = () => {
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

// Thêm / cập nhật giáo viên
const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/giao_viens/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật giáo viên thành công!';
    } else {
      await axios.post('http://127.0.0.1:8000/api/giao_viens', form.value);
      successMessage.value = 'Thêm giáo viên thành công!';
    }
    //resetForm();
    fetchGiaoVien();
    closeForm();
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

// Chỉnh sửa giáo viên
// const editGiaoVien = (gv: GiaoVienPayload) => {
//   form.value = { ...gv };
// };

// Xóa giáo viên
const deleteGiaoVien = async (id: string) => {
  // await axios.delete(`http://127.0.0.1:8000/api/giao_viens/${id}`);
  // fetchGiaoVien();
  successMessage.value = '';
  errorMessage.value = '';
  if (!confirm('Bạn có chắc muốn xóa giáo viên này?')) return;
  try {
    const res = await axios.delete(`http://127.0.0.1:8000/api/giao_viens/${id}`);
    successMessage.value = res.data.message;
    fetchGiaoVien();
  } catch (err: any) {
    if (err.response && err.response.data.message) {
      errorMessage.value = err.response.data.message;
    } else {
      errorMessage.value = 'Không thể xóa giáo viên này!';
    }
  }
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
    tai_khoan_id: '',
    don_vi_cong_tac_id: ''
  };
  Object.keys(errors).forEach(key => (errors[key] = ''));
};



onMounted(() => {
  fetchGiaoVien();
  fetchTaiKhoanList();
  fetchChucVuList();
  fetchDonViList();
});

// watch(
//   () => route.fullPath,
//   () => {
//     fetchGiaoVien();
//   },
//   { immediate: true }
// );


</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Giáo viên</h1>
    <!-- <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
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
      <div class="grid gap-y-2">
        <label>Đơn vị công tác</label>
        <select v-model="form.don_vi_cong_tac_id" class="border rounded p-2">
          <option value="">-- Chọn đơn vị công tác --</option>
          <option v-for="dv in donViList" :key="dv.id" :value="dv.id">
            {{ dv.ten_don_vi }}
          </option>
        </select>
        <small v-if="errors.don_vi_cong_tac_id" class="text-red-500">
          {{ errors.don_vi_cong_tac_id }}
        </small>
      </div>
      <div class="col-span-2 flex gap-2">
        <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Giáo viên</Button>
        <Button type="button" variant="outline" @click="resetForm">Reset</Button>
      </div>
    </form>-->

    <!-- Nút mở form -->
    <div class="mb-4">
      <Button @click="openAddForm">+ Thêm giáo viên</Button>
    </div>

    <!-- Form popup -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[600px]">
        <h2 class="font-bold text-lg mb-4">
          {{ form.id ? 'Sửa Giáo viên' : 'Thêm Giáo viên' }}
        </h2>

        <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4">
          <div>
            <label>Họ tên</label>
            <Input v-model="form.ho_ten" />
            <small v-if="errors.ho_ten" class="text-red-500">{{ errors.ho_ten }}</small>
          </div>
          <div>
            <label>CCCD</label>
            <Input v-model="form.cccd" />
          </div>
          <div>
            <label>Địa chỉ</label>
            <Input v-model="form.dia_chi" />
          </div>
          <div>
            <label>SĐT</label>
            <Input v-model="form.so_dien_thoai" />
          </div>
          <div>
            <label>Email</label>
            <Input v-model="form.email" />
          </div>
          <div>
            <label>Chức vụ</label>
            <select v-model="form.chuc_vu_id" class="border rounded p-2 w-full">
              <option value="">-- Chọn chức vụ --</option>
              <option v-for="cv in chucVuList" :key="cv.id" :value="cv.id">{{ cv.ten_chuc_vu }}</option>
            </select>
          </div>
          <div>
            <label>Tài khoản</label>
            <select v-model="form.tai_khoan_id" class="border rounded p-2 w-full">
              <option v-for="tk in taiKhoanList" :key="tk.ID" :value="tk.ID">{{ tk.ID }}</option>
            </select>
          </div>
          <div>
            <label>Đơn vị công tác</label>
            <select v-model="form.don_vi_cong_tac_id" class="border rounded p-2 w-full">
              <option v-for="dv in donViList" :key="dv.id" :value="dv.id">{{ dv.ten_don_vi }}</option>
            </select>
          </div>
          <div class="col-span-2 flex justify-end gap-2">
            <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }}</Button>
            <Button type="button" variant="outline" @click="closeForm">Đóng</Button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="successMessage" class="mb-4 text-green-600 font-semibold">
      {{ successMessage }}
    </div>


    <div v-if="errorMessage" class="mb-4 text-red-600 font-semibold">
      {{ errorMessage }}
    </div> 

    <div class="mb-4 flex gap-4">
      <Input
        type="text"
        v-model="keyword"
        placeholder="Tìm kiếm theo mã GV hoặc họ tên..."
        @input="fetchGiaoVien"
        class="flex-1"
      />
      <Button type="button" variant="outline" @click="fetchGiaoVien">Tìm kiếm</Button>
    </div>

    <DataTable :columns="columns" :data="giaoVienList"></DataTable>
  </div>
    <!-- Popup -->
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" @click.self="showPopup = false">
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
