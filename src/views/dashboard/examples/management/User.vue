<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import Button from '@/components/ui/button/Button.vue';
import axios from 'axios';

// ✅ API URL Laravel
const API_URL = 'http://127.0.0.1:8000/api/customers';

// ✅ Danh sách khách hàng
const customers = ref([]);

// ✅ Dữ liệu form
interface PAYLOAD {
  id?: string | number;
  name: string;
  email: string;
  dia_chi: string;
  sdt: string;
}
const form = ref<PAYLOAD>({
  id: '',
  name: '',
  email: '',
  dia_chi: '',
  sdt: '',
});

// ✅ Fetch danh sách khách hàng từ API
const fetchCustomers = async () => {
  try {
    const response = await axios.get(API_URL);
    customers.value = response.data;
  } catch (error) {
    console.error('Lỗi tải danh sách khách hàng:', error);
  }
};

// ✅ Thêm hoặc cập nhật khách hàng
const onSubmit = async () => {
  try {
    if (form.value.id) {
      // 🔹 Cập nhật khách hàng
      await axios.put(`${API_URL}/${form.value.id}`, form.value);
    } else {
      // 🔹 Thêm khách hàng mới
      await axios.post(API_URL, form.value);
    }
    fetchCustomers(); // Cập nhật danh sách
    resetForm();
  } catch (error) {
    console.error('Lỗi khi lưu khách hàng:', error);
  }
};

// ✅ Xóa khách hàng
const deleteCustomer = async (id: number) => {
  if (confirm('Bạn có chắc muốn xóa khách hàng này không?')) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCustomers(); // Cập nhật danh sách sau khi xóa
    } catch (error) {
      console.error('Lỗi khi xóa khách hàng:', error);
    }
  }
};

// ✅ Load dữ liệu vào form để sửa
const editCustomer = (customer: any) => {
  form.value = { ...customer };
};

// ✅ Reset form
const resetForm = () => {
  form.value = {
    id: '',
    name: '',
    email: '',
    dia_chi: '',
    sdt: '',
  };
};

// ✅ Cấu hình bảng hiển thị
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'ID', enableSorting: false },
  { accessorKey: 'name', header: 'Tên khách hàng', enableSorting: false },
  { accessorKey: 'sdt', header: 'Số điện thoại', enableSorting: false },
  { accessorKey: 'email', header: 'Email', enableSorting: false },
  { accessorKey: 'dia_chi', header: 'Địa chỉ', enableSorting: false },
  {
    accessorKey: 'action',
    header: 'Hành động',
    enableSorting: false,
    cell: ({ row }) =>
      h('div', { class: 'flex items-center' }, [
        h(
          Button,
          { variant: 'outline', class: 'mr-2', onClick: () => editCustomer(row.original) },
          () => 'Sửa'
        ),
        h(
          Button,
          { variant: 'destructive', onClick: () => deleteCustomer(row.original.id) },
          () => 'Xóa'
        ),
      ]),
  },
];

// ✅ Tải danh sách khách hàng khi component được mount
onMounted(fetchCustomers);
</script>

<template>
  <div>
    <page-header title="Quản lý khách hàng"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="name">Tên khách hàng</Label>
        <Input type="text" id="name" placeholder="Tên khách hàng" v-model="form.name" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="sdt">Số điện thoại</Label>
        <Input type="text" id="sdt" placeholder="Số điện thoại" v-model="form.sdt" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" v-model="form.email" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="dia_chi">Địa chỉ</Label>
        <Input type="text" id="dia_chi" placeholder="Địa chỉ" v-model="form.dia_chi" required />
      </div>
      <Button type="submit">{{ form.id ? 'Cập nhật khách hàng' : 'Thêm khách hàng' }}</Button>
    </form>
    <DataTable :columns="columns" :data="customers" search="name"></DataTable>
  </div>
</template>
