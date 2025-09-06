<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';

// Danh sách người thuê phòng
const nguoiThueList = ref([]);

// Lưu lỗi validation
const errors = reactive<Record<string, string>>({});

// Lưu thông báo thành công
const successMessage = ref('');
// Lưu thông báo thất bại
const errorMessage = ref('');

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã NTP' },
  { accessorKey: 'ho_ten', header: 'Họ tên' },
  { accessorKey: 'gioi_tinh', header: 'Giới tính' },
  { accessorKey: 'so_dien_thoai', header: 'SĐT' },
  { accessorKey: 'cccd', header: 'CCCD' },
  { accessorKey: 'dia_chi', header: 'Địa chỉ' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'outline', onClick: () => editNguoiThue(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deleteNguoiThue(row.original.id) }, 'Xóa')
      ])
  }
];

// Kiểu dữ liệu người thuê phòng
interface NguoiThuePayload {
  id?: string;
  ho_ten: string;
  gioi_tinh: string;
  so_dien_thoai: string;
  cccd: string;
  dia_chi: string;
  email: string;
}

// Form nhập liệu
const form = ref<NguoiThuePayload>({
  ho_ten: '',
  gioi_tinh: '',
  so_dien_thoai: '',
  cccd: '',
  dia_chi: '',
  email: ''
});
const keyword = ref('');

// Lấy danh sách người thuê phòng
const fetchNguoiThue = async () => {
  //const response = await axios.get('http://127.0.0.1:8000/api/nguoi_thue_phongs');
  let url = 'http://127.0.0.1:8000/api/nguoi_thue_phongs';
  if (keyword.value) {
    url = `http://127.0.0.1:8000/api/nguoi_thue_phongs/search?keyword=${keyword.value}`;
  }
  const response = await axios.get(url);
  nguoiThueList.value = response.data;
};

// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => (errors[key] = ''));
  let isValid = true;

  if (!form.value.ho_ten) {
    errors.ho_ten = 'Họ tên là bắt buộc';
    isValid = false;
  }

  if (!form.value.gioi_tinh) {
    errors.gioi_tinh = 'Giới tính là bắt buộc';
    isValid = false;
  } else {
    const gioiTinhHopLe = ['nam', 'nữ', 'khác'];
    if (!gioiTinhHopLe.includes(form.value.gioi_tinh.toLowerCase())) {
      errors.gioi_tinh = 'Giới tính chỉ được là "Nam", "Nữ" hoặc "Khác"';
      isValid = false;
    }
  }

  if (!form.value.so_dien_thoai) {
    errors.so_dien_thoai = 'Số điện thoại là bắt buộc';
    isValid = false;
  } else if (!/^\d{10}$/.test(form.value.so_dien_thoai)) {
    errors.so_dien_thoai = 'Số điện thoại phải đúng 10 chữ số';
    isValid = false;
  }

  if (!form.value.cccd) {
    errors.cccd = 'CCCD là bắt buộc';
    isValid = false;
  } else if (!/^\d{9,12}$/.test(form.value.cccd)) {
    errors.cccd = 'CCCD phải có 9 đến 12 chữ số';
    isValid = false;
  }

  if (!form.value.dia_chi) {
    errors.dia_chi = 'Địa chỉ là bắt buộc';
    isValid = false;
  }
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.email = 'Email không hợp lệ';
    isValid = false;
  }

  return isValid;
};

// Thêm / cập nhật người thuê
const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/nguoi_thue_phongs/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật người thuê phòng thành công!';
    } else {
      await axios.post('http://127.0.0.1:8000/api/nguoi_thue_phongs', form.value);
      successMessage.value = 'Thêm người thuê phòng thành công!';
    }
    resetForm();
    fetchNguoiThue();
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

// Chỉnh sửa người thuê
const editNguoiThue = (ntp: NguoiThuePayload) => {
  form.value = { ...ntp };
};

// Xóa người thuê
const deleteNguoiThue = async (id: string) => {
  // await axios.delete(`http://127.0.0.1:8000/api/nguoi_thue_phongs/${id}`);
  // fetchNguoiThue();
  successMessage.value = '';
  errorMessage.value = '';
  if (!confirm('Bạn có chắc muốn xóa người thuê phòng này?')) return;
  try {
    const res = await axios.delete(`http://127.0.0.1:8000/api/nguoi_thue_phongs/${id}`);
    successMessage.value = res.data.message;
    fetchNguoiThue();
  } catch (err: any) {
    if (err.response && err.response.data.message) {
      errorMessage.value = err.response.data.message;
    } else {
      errorMessage.value = 'Không thể xóa người thuê phòng này!';
    }
  }
};

// Reset form
const resetForm = () => {
  form.value = {
    ho_ten: '',
    gioi_tinh: '',
    so_dien_thoai: '',
    cccd: '',
    dia_chi: '',
    email: ''
  };
  Object.keys(errors).forEach(key => (errors[key] = ''));
};

onMounted(fetchNguoiThue);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Người thuê phòng</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div>
        <label>Họ tên</label>
        <Input type="text" v-model="form.ho_ten" />
        <small v-if="errors.ho_ten" class="text-red-500">{{ errors.ho_ten }}</small>
      </div>
      <div>
        <label>Giới tính</label>
        <Input type="text" v-model="form.gioi_tinh" placeholder="Nam/Nữ/Khác" />
        <small v-if="errors.gioi_tinh" class="text-red-500">{{ errors.gioi_tinh }}</small>
      </div>
      <div>
        <label>Số điện thoại</label>
        <Input type="text" v-model="form.so_dien_thoai" />
        <small v-if="errors.so_dien_thoai" class="text-red-500">{{ errors.so_dien_thoai }}</small>
      </div>
      <div>
        <label>CCCD</label>
        <Input type="text" v-model="form.cccd" />
        <small v-if="errors.cccd" class="text-red-500">{{ errors.cccd }}</small>
      </div>
      <div>
        <label>Địa chỉ</label>
        <Input type="text" v-model="form.dia_chi" />
        <small v-if="errors.dia_chi" class="text-red-500">{{ errors.dia_chi }}</small>
      </div>
      <div>
        <label>Email</label>
        <Input type="text" v-model="form.email" />
        <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
      </div>
      <div class="col-span-2 flex gap-2 mt-2">
        <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Người thuê</Button>
        <Button type="button" variant="outline" @click="resetForm">Reset</Button>
      </div>
    </form>

    <div v-if="successMessage" class="mb-4 text-green-600 font-semibold">
      {{ successMessage }}
    </div>

    <div class="mb-4 flex gap-4">
      <Input
        type="text"
        v-model="keyword"
        placeholder="Tìm kiếm theo mã NT hoặc họ tên..."
        @input="fetchNguoiThue"
        class="flex-1"
      />
      <Button type="button" variant="outline" @click="fetchNguoiThue">Tìm kiếm</Button>
    </div>

    <DataTable :columns="columns" :data="nguoiThueList"></DataTable>
  </div>
</template>
