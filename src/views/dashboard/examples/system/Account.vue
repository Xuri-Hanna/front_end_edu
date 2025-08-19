<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';

// Danh sách tài khoản
const taiKhoanList = ref([]);

// Lưu lỗi validation
const errors = reactive<Record<string, string>>({});

// Lưu thông báo thành công
const successMessage = ref('');

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'ID', header: 'Mã tài khoản' },
  { accessorKey: 'username', header: 'Username' },
  { accessorKey: 'password', header: 'Password' },
  {
    accessorKey: 'trang_thai',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.original.trang_thai;
      const colorClass =
        status === 'Đã sử dụng' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold';
      return h('span', { class: colorClass }, status);
    }
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'outline', onClick: () => editTaiKhoan(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deleteTaiKhoan(row.original.ID) }, 'Xóa')
      ])
  }
];

// Kiểu dữ liệu tài khoản
interface TaiKhoanPayload {
  ID?: string;
  username: string;
  password: string;
}

// Form nhập liệu
const form = ref<TaiKhoanPayload>({
  username: '',
  password: ''
});

// Tạo ID random 10 chữ số
const generateRandomId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Lấy danh sách tài khoản
const fetchTaiKhoan = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/tai_khoans');
  taiKhoanList.value = response.data;
};

// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => (errors[key] = ''));
  let isValid = true;

  if (!form.value.username) {
    errors.username = 'Username là bắt buộc';
    isValid = false;
  }

  if (!form.value.password) {
    errors.password = 'Password là bắt buộc';
    isValid = false;
  }

  return isValid;
};

// Thêm / cập nhật tài khoản
const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.ID) {
      // Cập nhật
      await axios.put(`http://127.0.0.1:8000/api/tai_khoans/${form.value.ID}`, form.value);
      successMessage.value = 'Cập nhật tài khoản thành công!';
    } else {
      // Thêm mới: gán ID random 10 số
      form.value.ID = generateRandomId();
      await axios.post('http://127.0.0.1:8000/api/tai_khoans', form.value);
      successMessage.value = 'Thêm tài khoản thành công!';
    }
    resetForm();
    fetchTaiKhoan();
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

// Chỉnh sửa tài khoản
const editTaiKhoan = (tk: TaiKhoanPayload) => {
  form.value = { ...tk };
};

// Xóa tài khoản
const deleteTaiKhoan = async (id: string) => {
  await axios.delete(`http://127.0.0.1:8000/api/tai_khoans/${id}`);
  fetchTaiKhoan();
};

// Reset form
const resetForm = () => {
  form.value = {
    username: '',
    password: ''
  };
  Object.keys(errors).forEach(key => (errors[key] = ''));
};

onMounted(fetchTaiKhoan);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Tài khoản</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <label>Username</label>
        <Input type="text" v-model="form.username" />
        <small v-if="errors.username" class="text-red-500">{{ errors.username }}</small>
      </div>
      <div class="grid gap-y-2">
        <label>Password</label>
        <Input type="password" v-model="form.password" />
        <small v-if="errors.password" class="text-red-500">{{ errors.password }}</small>
      </div>
      <div class="col-span-2 flex gap-2">
        <Button type="submit">{{ form.ID ? 'Cập nhật' : 'Thêm' }} Tài khoản</Button>
        <Button type="button" variant="outline" @click="resetForm">Reset</Button>
      </div>
    </form>

    <div v-if="successMessage" class="mb-4 text-green-600 font-semibold">
      {{ successMessage }}
    </div>

    <DataTable :columns="columns" :data="taiKhoanList"></DataTable>
  </div>
</template>
