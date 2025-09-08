<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';

// Danh sách môn học
const monHocList = ref([]);

// Lưu lỗi validation
const errors = reactive<Record<string, string>>({});

// Lưu thông báo thành công
const successMessage = ref('');
const messageType = ref<'success' | 'error'>('success');

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã MH' },
  { accessorKey: 'mon_hoc', header: 'Tên môn học' },
  { accessorKey: 'khoi_lop', header: 'Khối lớp' },
  { accessorKey: 'nam_hoc', header: 'Năm học' },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'outline', onClick: () => editMonHoc(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deleteMonHoc(row.original.id) }, 'Xóa')
      ])
  }
];

// Kiểu dữ liệu môn học
interface MonHocPayload {
  id?: string;
  mon_hoc: string;
  khoi_lop: string;
  nam_hoc: string;
}

// Form nhập liệu
const form = ref<MonHocPayload>({
  mon_hoc: '',
  khoi_lop: '',
  nam_hoc: ''
});
const keyword = ref('');

// Lấy danh sách môn học
const fetchMonHoc = async () => {
  //const response = await axios.get('http://127.0.0.1:8000/api/mon_hocs');
  let url = 'http://127.0.0.1:8000/api/mon_hocs';
  if (keyword.value) {
    url = `http://127.0.0.1:8000/api/mon_hocs/search?keyword=${keyword.value}`;
  }
  const response = await axios.get(url);
  monHocList.value = response.data;
};

// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => (errors[key] = ''));
  let isValid = true;

  if (!form.value.mon_hoc) {
    errors.mon_hoc = 'Tên môn học là bắt buộc';
    isValid = false;
  }
  if (!form.value.khoi_lop) {
    errors.khoi_lop = 'Khối lớp là bắt buộc';
    isValid = false;
  }
  if (!form.value.nam_hoc) {
    errors.nam_hoc = 'Năm học là bắt buộc';
    isValid = false;
  }

  return isValid;
};

// Thêm / cập nhật môn học
const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/mon_hocs/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật môn học thành công!';
      messageType.value = 'success';
    } else {
      await axios.post('http://127.0.0.1:8000/api/mon_hocs', form.value);
      successMessage.value = 'Thêm môn học thành công!';
      messageType.value = 'success';
    }
    resetForm();
    fetchMonHoc();
  } catch (err: any) {
    if (err.response && err.response.status === 422) {
      // lỗi đã tồn tại
      successMessage.value = 'Môn học đã tồn tại trong cùng khối và năm học!';
      messageType.value = 'error';
    } else {
      successMessage.value = 'Có lỗi xảy ra, vui lòng thử lại.';
      messageType.value = 'error';
    }
  }
};

// Chỉnh sửa môn học
const editMonHoc = (mh: MonHocPayload) => {
  form.value = { ...mh };
};

// Xóa môn học
const deleteMonHoc = async (id: string) => {
  await axios.delete(`http://127.0.0.1:8000/api/mon_hocs/${id}`);
  fetchMonHoc();
};

// Reset form
const resetForm = () => {
  form.value = {
    mon_hoc: '',
    khoi_lop: '',
    nam_hoc: ''
  };
  Object.keys(errors).forEach(key => (errors[key] = ''));
};

onMounted(fetchMonHoc);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Môn học</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label>Tên môn học</label>
        <Input type="text" v-model="form.mon_hoc" />
        <small v-if="errors.mon_hoc" class="text-red-500">{{ errors.mon_hoc }}</small>
      </div>
      <div>
        <label>Khối lớp</label>
        <select v-model="form.khoi_lop" class="border rounded p-2">
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
        <small v-if="errors.khoi_lop" class="text-red-500">{{ errors.khoi_lop }}</small>
      </div>
      <div>
        <label>Năm học</label>
        <Input type="text" v-model="form.nam_hoc" placeholder="VD: 2025-2026" />
        <small v-if="errors.nam_hoc" class="text-red-500">{{ errors.nam_hoc }}</small>
      </div>
      <div class="col-span-2 flex gap-2 mt-2">
        <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Môn học</Button>
        <Button type="button" variant="outline" @click="resetForm">Reset</Button>
      </div>
    </form>

    <p v-if="successMessage" 
      :class="messageType === 'success' ? 'text-green-500' : 'text-red-500'">
      {{ successMessage }}
    </p>
    <div class="mb-4 flex gap-4">
      <Input
        type="text"
        v-model="keyword"
        placeholder="Tìm kiếm theo mã MH hoặc họ tên..."
        @input="fetchMonHoc"
        class="flex-1"
      />
      <Button type="button" variant="outline" @click="fetchMonHoc">Tìm kiếm</Button>
    </div>


    <DataTable :columns="columns" :data="monHocList"></DataTable>
  </div>
</template>
