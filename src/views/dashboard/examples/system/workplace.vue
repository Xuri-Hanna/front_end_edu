<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';

// Danh sách đơn vị công tác
const donViList = ref([]);

// Lưu lỗi validation
const errors = reactive<Record<string, string>>({});

// Lưu thông báo thành công
const successMessage = ref('');

// Popup form
const showForm = ref(false);

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'ten_don_vi', header: 'Tên đơn vị' },
  { accessorKey: 'dia_chi', header: 'Địa chỉ' },
  { accessorKey: 'so_dien_thoai', header: 'Số điện thoại' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'outline', onClick: () => editDonVi(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deleteDonVi(row.original.id) }, 'Xóa')
      ])
  }
];

// Kiểu dữ liệu đơn vị công tác
interface DonViPayload {
  id?: string;
  ten_don_vi: string;
  dia_chi: string;
  so_dien_thoai: string;
  email: string;
}

// Form nhập liệu
const form = ref<DonViPayload>({
  ten_don_vi: '',
  dia_chi: '',
  so_dien_thoai: '',
  email: ''
});

// Mở form thêm
const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

// Mở form sửa
const editDonVi = (dv: DonViPayload) => {
  form.value = { ...dv };
  showForm.value = true;
};

// Đóng form
const closeForm = () => {
  showForm.value = false;
  resetForm();
};

const keyword = ref('');


// Tạo ID random 10 chữ số
const generateRandomId = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Lấy danh sách đơn vị
const fetchDonVi = async () => {
  //const response = await axios.get('http://127.0.0.1:8000/api/don_vi_cong_tacs');
  let url = 'http://127.0.0.1:8000/api/don_vi_cong_tacs';
  if (keyword.value) {
    url = `http://127.0.0.1:8000/api/don_vi_cong_tacs/search?keyword=${keyword.value}`;
  }
  const response = await axios.get(url);
  donViList.value = response.data;
};

// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => (errors[key] = ''));
  let isValid = true;

  if (!form.value.ten_don_vi) {
    errors.ten_don_vi = 'Tên đơn vị là bắt buộc';
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
 
  return isValid;
};

// Thêm / cập nhật đơn vị
const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      // Cập nhật
      await axios.put(`http://127.0.0.1:8000/api/don_vi_cong_tacs/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật đơn vị thành công!';
    } else {
      // Thêm mới: gán ID random 10 số
      form.value.id = generateRandomId();
      await axios.post('http://127.0.0.1:8000/api/don_vi_cong_tacs', form.value);
      successMessage.value = 'Thêm đơn vị thành công!';
    }
    resetForm();
    fetchDonVi();
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

// Chỉnh sửa đơn vị
// const editDonVi = (dv: DonViPayload) => {
//   form.value = { ...dv };
// };

// Xóa đơn vị
const deleteDonVi = async (id: string) => {
  await axios.delete(`http://127.0.0.1:8000/api/don_vi_cong_tacs/${id}`);
  fetchDonVi();
};

// Reset form
const resetForm = () => {
  form.value = {
    ten_don_vi: '',
    dia_chi: '',
    so_dien_thoai: '',
    email: ''
  };
  Object.keys(errors).forEach(key => (errors[key] = ''));
};

onMounted(fetchDonVi);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Đơn vị công tác</h1>
    <!-- <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <label>Tên đơn vị</label>
        <Input type="text" v-model="form.ten_don_vi" />
        <small v-if="errors.ten_don_vi" class="text-red-500">{{ errors.ten_don_vi }}</small>
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
      <div class="col-span-2 flex gap-2">
        <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Đơn vị</Button>
        <Button type="button" variant="outline" @click="resetForm">Reset</Button>
      </div>
    </form> -->

    <!-- Nút mở form -->
    <div class="mb-4">
      <Button @click="openAddForm">+ Thêm đơn vị</Button>
    </div>

    <!-- Form popup -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[600px]">
        <h2 class="font-bold text-lg mb-4">
          {{ form.id ? 'Sửa Đơn vị' : 'Thêm Đơn vị' }}
        </h2>

        <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4">
          <div>
            <label>Tên đơn vị</label>
            <Input type="text" v-model="form.ten_don_vi" />
            <small v-if="errors.ten_don_vi" class="text-red-500">{{ errors.ten_don_vi }}</small>
          </div>

          <div>
            <label>Địa chỉ</label>
            <Input type="text" v-model="form.dia_chi" />
            <small v-if="errors.dia_chi" class="text-red-500">{{ errors.dia_chi }}</small>
          </div>

          <div>
            <label>Số điện thoại</label>
            <Input type="text" v-model="form.so_dien_thoai" />
            <small v-if="errors.so_dien_thoai" class="text-red-500">{{ errors.so_dien_thoai }}</small>
          </div>

          <div>
            <label>Email</label>
            <Input type="email" v-model="form.email" />
            <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
          </div>

          <div class="col-span-2 flex gap-2 justify-end mt-4">
            <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm đơn vị' }}</Button>
            <Button type="button" variant="outline" @click="closeForm">Đóng</Button>
          </div>
        </form>
      </div>
    </div>


    <div v-if="successMessage" class="mb-4 text-green-600 font-semibold">
      {{ successMessage }}
    </div>

    <div class="mb-4 flex gap-4">
      <Input
        type="text"
        v-model="keyword"
        placeholder="Tìm kiếm theo mã đơn vị công tác hoặc tên..."
        @input="fetchDonVi"
        class="flex-1"
      />
      <Button type="button" variant="outline" @click="fetchDonVi">Tìm kiếm</Button>
    </div>

    <DataTable :columns="columns" :data="donViList"></DataTable>
  </div>
</template>
