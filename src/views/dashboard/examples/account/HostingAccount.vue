<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { handleError, handleSucess } from '@/lib/utils';
// Danh sách tài khoản hosting
const hostingAccounts = ref([]);
const hostingProducts  = ref([]);

// Định nghĩa cột cho bảng hiển thị
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã tài khoản' },
  {
    accessorKey: 'hosting_id',
    header: 'Tên Hosting',
    cell: ({ row }) => {
      // Tìm hosting tương ứng trong danh sách hostingProducts
      const hosting = hostingProducts.value.find(h => h.id === row.original.hosting_id);
      return hosting ? hosting.plan : 'Không xác định'; // Nếu không tìm thấy, hiển thị 'Không xác định'
    }
  },
  { accessorKey: 'username', header: 'Tên đăng nhập' },
  { accessorKey: 'password', header: 'Mật khẩu' },
  { accessorKey: 'control_panel', header: 'Bảng điều khiển' },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', {}, [
        h(Button, { variant: 'outline', onClick: () => editAccount(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deleteAccount(row.original.id) }, 'Xóa')
      ])
  }
];

// Định nghĩa dữ liệu form
const form = ref({
  hosting_id: '',
  username: '',
  password: '',
  control_panel: ''
});
// Lấy danh sách hosting
const fetchHostingProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/hosting_products');
    hostingProducts.value = response.data;
    console.log('hosting_product',hostingProducts.value);
  } catch (error) {
    handleError(error);
  }
};

// Lấy danh sách tài khoản hosting từ API
const fetchHostingAccounts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/hosting_accounts');
    hostingAccounts.value = response.data;
    console.log('data_account', hostingAccounts.value);
  } catch (error) {
    handleError(error);
  }
};

// Thêm mới hoặc cập nhật tài khoản hosting
const submitForm = async () => {
  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/hosting_accounts/${form.value.id}`, form.value);
      handleSucess("Thành công","Sửa tài khoản hosting thành công");
    } else {
      await axios.post('http://127.0.0.1:8000/api/hosting_accounts', form.value);
      handleSucess("Thành công","Thêm tài khoản hosting thành công");
    }
    form.value = { hosting_id: '', username: '', password: '', control_panel: '' };
    fetchHostingAccounts();
  } catch (error) {
    handleError(error);
  }
};

// Chỉnh sửa tài khoản hosting
const editAccount = (account) => {
  form.value = { ...account };
};

// Xóa tài khoản hosting
const deleteAccount = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/hosting_accounts/${id}`);
    fetchHostingAccounts();
  } catch (error) {
    handleError(error);
  }
};

onMounted(async () => {
  await fetchHostingProducts();
  await fetchHostingAccounts();
});
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Tài khoản Hosting</h1>

    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <label for="hosting_id" class="block text-sm font-medium">Chọn hosting</label>
        <Select v-model="form.hosting_id">
          <SelectTrigger>
            <SelectValue placeholder="Chọn hosting" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="hosting in hostingProducts" :key="hosting.id" :value="hosting.id">
                {{ hosting.plan }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="grid gap-y-2">
        <label for="username">Tên đăng nhập</label>
        <Input type="text" id="username" v-model="form.username" required />
      </div>
      <div class="grid gap-y-2">
        <label for="password">Mật khẩu</label>
        <Input type="password" id="password" v-model="form.password" required />
      </div>
      <div class="grid gap-y-2">
        <label for="control_panel">Bảng điều khiển</label>
        <Input type="text" id="control_panel" v-model="form.control_panel" required />
      </div>
      <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Tài khoản</Button>
    </form>

    <DataTable :columns="columns" :data="hostingAccounts"></DataTable>
  </div>
</template>
