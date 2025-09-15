<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import { Pencil, Trash2 } from 'lucide-vue-next';

// Danh sách thời gian dạy
const thoiGianList = ref<any[]>([]);

// Form
interface ThoiGianPayload {
  id?: number;
  buoi: string;
  gio_bat_dau: string;
  gio_ket_thuc: string;
}
const form = ref<ThoiGianPayload>({
  buoi: '',
  gio_bat_dau: '',
  gio_ket_thuc: ''
});

// Lỗi
const errors = reactive<Record<string, string>>({});
const successMessage = ref('');
const errorMessage = ref('');
const showForm = ref(false);

// Reset form
const resetForm = () => {
  form.value = { buoi: '', gio_bat_dau: '', gio_ket_thuc: '' };
  Object.keys(errors).forEach(k => (errors[k] = ''));
};

// Mở form thêm
const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

// Mở form sửa
const editThoiGian = (item: ThoiGianPayload) => {
  form.value = { ...item };
  showForm.value = true;
};

// Đóng form
const closeForm = () => {
  showForm.value = false;
  resetForm();
};

// Validate
const validateForm = () => {
  Object.keys(errors).forEach(k => (errors[k] = ''));
  let valid = true;
  if (!form.value.buoi) {
    errors.buoi = 'Buổi là bắt buộc';
    valid = false;
  }
  if (!form.value.gio_bat_dau) {
    errors.gio_bat_dau = 'Giờ bắt đầu là bắt buộc';
    valid = false;
  }
  if (!form.value.gio_ket_thuc) {
    errors.gio_ket_thuc = 'Giờ kết thúc là bắt buộc';
    valid = false;
  }
  return valid;
};

// Lưu (thêm/sửa)
const submitForm = async () => {
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/thoi_gian_hocs/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật thành công';
    } else {
      await axios.post(`http://127.0.0.1:8000/api/thoi_gian_hocs`, form.value);
      successMessage.value = 'Thêm mới thành công';
    }
    fetchThoiGian();
    closeForm();
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Có lỗi xảy ra';
  }
};

// Xóa
const deleteThoiGian = async (id: number) => {
  if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
  try {
    const res = await axios.delete(`http://127.0.0.1:8000/api/thoi_gian_hocs/${id}`);
    successMessage.value = res.data.message || 'Xóa thành công';
    fetchThoiGian();
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Không thể xóa';
  }
};

// Lấy danh sách
const fetchThoiGian = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/thoi_gian_hocs');
  thoiGianList.value = res.data;
};

// Cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'buoi', header: 'Buổi' },
  { accessorKey: 'gio_bat_dau', header: 'Giờ bắt đầu' },
  { accessorKey: 'gio_ket_thuc', header: 'Giờ kết thúc' },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-3' }, [
        h(
          'button',
          {
            class: 'text-blue-600 hover:text-blue-800',
            onClick: () => editThoiGian(row.original)
          },
          [h(Pencil, { size: 18 })]
        ),
        h(
          'button',
          {
            class: 'text-red-600 hover:text-red-800',
            onClick: () => deleteThoiGian(row.original.id)
          },
          [h(Trash2, { size: 18 })]
        )
      ])
  }
];

onMounted(() => {
  fetchThoiGian();
});
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Thời gian dạy</h1>

    <div class="mb-4">
      <Button @click="openAddForm">+ Thêm thời gian</Button>
    </div>

    <div v-if="successMessage" class="mb-2 text-green-600">{{ successMessage }}</div>
    <div v-if="errorMessage" class="mb-2 text-red-600">{{ errorMessage }}</div>

    <!-- Form popup -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[400px]">
        <h2 class="font-bold text-lg mb-4">
          {{ form.id ? 'Sửa Thời gian dạy' : 'Thêm Thời gian dạy' }}
        </h2>

        <form @submit.prevent="submitForm" class="grid gap-4">
          <div>
            <label>Buổi</label>
            <Input type="text" v-model="form.buoi" />
            <small v-if="errors.buoi" class="text-red-500">{{ errors.buoi }}</small>
          </div>
          <div>
            <label>Giờ bắt đầu</label>
            <Input type="time" v-model="form.gio_bat_dau" />
            <small v-if="errors.gio_bat_dau" class="text-red-500">{{ errors.gio_bat_dau }}</small>
          </div>
          <div>
            <label>Giờ kết thúc</label>
            <Input type="time" v-model="form.gio_ket_thuc" />
            <small v-if="errors.gio_ket_thuc" class="text-red-500">{{ errors.gio_ket_thuc }}</small>
          </div>

          <div class="flex gap-2 justify-end mt-2">
            <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm mới' }}</Button>
            <Button type="button" variant="outline" @click="closeForm">Đóng</Button>
          </div>
        </form>
      </div>
    </div>

    <DataTable :columns="columns" :data="thoiGianList"></DataTable>
  </div>
</template>
