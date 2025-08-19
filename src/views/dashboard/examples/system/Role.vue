<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';

// Danh sách chức vụ
const chucVuList = ref([]);

// Lưu lỗi validation
const errors = reactive<Record<string, string>>({});

// Lưu thông báo thành công
const successMessage = ref('');

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'ten_chuc_vu', header: 'Tên chức vụ' },
  { accessorKey: 'mo_ta', header: 'Mô tả' },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'outline', onClick: () => editChucVu(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deleteChucVu(row.original.id) }, 'Xóa')
      ])
  }
];

// Kiểu dữ liệu chức vụ
interface ChucVuPayload {
  id?: string;
  ten_chuc_vu: string;
  mo_ta: string;
}

// Form nhập liệu
const form = ref<ChucVuPayload>({
  ten_chuc_vu: '',
  mo_ta: ''
});

// Tạo ID random 10 chữ số
const generateRandomId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Lấy danh sách chức vụ
const fetchChucVu = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/chuc_vus');
  chucVuList.value = response.data;
};

// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => (errors[key] = ''));
  let isValid = true;

  if (!form.value.ten_chuc_vu) {
    errors.ten_chuc_vu = 'Tên chức vụ là bắt buộc';
    isValid = false;
  }

  if (!form.value.mo_ta) {
    errors.mo_ta = 'Mô tả là bắt buộc';
    isValid = false;
  }

  return isValid;
};

// Thêm / cập nhật chức vụ
const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      // Cập nhật
      await axios.put(`http://127.0.0.1:8000/api/chuc_vus/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật chức vụ thành công!';
    } else {
      // Thêm mới: gán ID random 10 số
      form.value.id = generateRandomId();
      await axios.post('http://127.0.0.1:8000/api/chuc_vus', form.value);
      successMessage.value = 'Thêm chức vụ thành công!';
    }
    resetForm();
    fetchChucVu();
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

// Chỉnh sửa chức vụ
const editChucVu = (cv: ChucVuPayload) => {
  form.value = { ...cv };
};

// Xóa chức vụ
const deleteChucVu = async (id: string) => {
  await axios.delete(`http://127.0.0.1:8000/api/chuc_vus/${id}`);
  fetchChucVu();
};

// Reset form
const resetForm = () => {
  form.value = {
    ten_chuc_vu: '',
    mo_ta: ''
  };
  Object.keys(errors).forEach(key => (errors[key] = ''));
};

onMounted(fetchChucVu);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Chức vụ</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <label>Tên chức vụ</label>
        <Input type="text" v-model="form.ten_chuc_vu" />
        <small v-if="errors.ten_chuc_vu" class="text-red-500">{{ errors.ten_chuc_vu }}</small>
      </div>
      <div class="grid gap-y-2">
        <label>Mô tả</label>
        <Input type="text" v-model="form.mo_ta" />
        <small v-if="errors.mo_ta" class="text-red-500">{{ errors.mo_ta }}</small>
      </div>
      <div class="col-span-2 flex gap-2">
        <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Chức vụ</Button>
        <Button type="button" variant="outline" @click="resetForm">Reset</Button>
      </div>
    </form>

    <div v-if="successMessage" class="mb-4 text-green-600 font-semibold">
      {{ successMessage }}
    </div>

    <DataTable :columns="columns" :data="chucVuList"></DataTable>
  </div>
</template>
