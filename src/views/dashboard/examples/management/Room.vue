<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';

// Danh sách phòng học
const phongHocList = ref([]);

// Lưu lỗi validation
const errors = reactive<Record<string, string>>({});

// Lưu thông báo
const successMessage = ref('');
const messageType = ref<'success' | 'error'>('success');

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã phòng' },
  { accessorKey: 'so_phong', header: 'Số phòng' },
  { accessorKey: 'vi_tri_phong', header: 'Vị trí' },
  { accessorKey: 'so_cho_ngoi', header: 'Số chỗ ngồi' },
  {
    accessorKey: 'gia_phong',
    header: 'Giá phòng',
    cell: ({ row }) => {
      const gia = row.original.gia_phong ?? 0;
      return new Intl.NumberFormat('vi-VN').format(gia) + ' VNĐ';
    }
  },
  {
    accessorKey: 'trang_thai',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const tt = row.original.trang_thai;
      const color = tt === 'Chưa sử dụng' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';
      return h('span', { class: color }, tt);
    }
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'outline', onClick: () => editPhongHoc(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deletePhongHoc(row.original.id) }, 'Xóa')
      ])
  }
];

// Kiểu dữ liệu
interface PhongHocPayload {
  id?: string;
  so_phong: string;
  vi_tri_phong: string;
  so_cho_ngoi: number | null;
  gia_phong?: number | null;
  trang_thai?: string;
}

// Form nhập liệu
const form = ref<PhongHocPayload>({
  so_phong: '',
  vi_tri_phong: '',
  so_cho_ngoi: null,
  gia_phong: null,
});

// Lấy danh sách phòng học
const fetchPhongHoc = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/phong_hocs');
  phongHocList.value = response.data;
};

// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => (errors[key] = ''));
  let isValid = true;

  if (!form.value.so_phong) {
    errors.so_phong = 'Số phòng là bắt buộc';
    isValid = false;
  }
  if (!form.value.vi_tri_phong) {
    errors.vi_tri_phong = 'Vị trí phòng là bắt buộc';
    isValid = false;
  }
  if (!form.value.so_cho_ngoi || form.value.so_cho_ngoi <= 0) {
    errors.so_cho_ngoi = 'Số chỗ ngồi phải > 0';
    isValid = false;
  }
  if (!form.value.gia_phong ) {
    errors.gia_phong = 'Giá phòng là bắt buộc';
    isValid = false;
  }
  return isValid;
};

// Thêm / cập nhật phòng học
const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/phong_hocs/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật phòng học thành công!';
      messageType.value = 'success';
    } else {
      await axios.post('http://127.0.0.1:8000/api/phong_hocs', form.value);
      successMessage.value = 'Thêm phòng học thành công!';
      messageType.value = 'success';
    }
    resetForm();
    fetchPhongHoc();
  } catch (err: any) {
    successMessage.value = 'Có lỗi xảy ra, vui lòng thử lại.';
    messageType.value = 'error';
  }
};

// Chỉnh sửa phòng học
const editPhongHoc = (ph: PhongHocPayload) => {
  form.value = { ...ph };
};

// Xóa phòng học
const deletePhongHoc = async (id: string) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/phong_hocs/${id}`);
    successMessage.value = 'Xóa phòng học thành công!';
    messageType.value = 'success';
    fetchPhongHoc();
  } catch (err: any) {
    successMessage.value = err.response?.data?.error || 'Không thể xóa phòng học!';
    messageType.value = 'error';
  }
};

// Reset form
const resetForm = () => {
  form.value = {
    so_phong: '',
    vi_tri_phong: '',
    so_cho_ngoi: null,
    gia_phong: null
  };
  Object.keys(errors).forEach(key => (errors[key] = ''));
};

onMounted(fetchPhongHoc);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Phòng học</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label>Số phòng</label>
        <Input type="text" v-model="form.so_phong" />
        <small v-if="errors.so_phong" class="text-red-500">{{ errors.so_phong }}</small>
      </div>
      <div>
        <label>Vị trí phòng</label>
        <Input type="text" v-model="form.vi_tri_phong" />
        <small v-if="errors.vi_tri_phong" class="text-red-500">{{ errors.vi_tri_phong }}</small>
      </div>
      <div>
        <label>Số chỗ ngồi</label>
        <Input type="number" v-model="form.so_cho_ngoi" />
        <small v-if="errors.so_cho_ngoi" class="text-red-500">{{ errors.so_cho_ngoi }}</small>
      </div>
      <div>
        <label>Giá phòng</label>
        <Input type="number" v-model="form.gia_phong" />
        <small v-if="errors.gia_phong" class="text-red-500">{{ errors.gia_phong }}</small>
      </div>
      <div class="col-span-2 flex gap-2 mt-2">
        <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Phòng học</Button>
        <Button type="button" variant="outline" @click="resetForm">Reset</Button>
      </div>
    </form>

    <p v-if="successMessage" 
       :class="messageType === 'success' ? 'text-green-500' : 'text-red-500'">
      {{ successMessage }}
    </p>

    <DataTable :columns="columns" :data="phongHocList"></DataTable>
  </div>
</template>
