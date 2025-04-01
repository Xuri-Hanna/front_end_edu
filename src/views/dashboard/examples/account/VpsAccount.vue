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
// Danh sách tài khoản VPS
const vpsAccounts = ref([]);
const vpsProducts = ref([]);

// Định nghĩa cột cho bảng hiển thị
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã tài khoản' },
  { 
    accessorKey: 'vps_id', 
    header: 'Tên VPS',
    cell: ({ row }) => {
      // Tìm hosting tương ứng trong danh sách hostingProducts
      const vps = vpsProducts.value.find(h => h.id === row.original.vps_id);
      return vps ? vps.plan : 'Không xác định'; // Nếu không tìm thấy, hiển thị 'Không xác định'
    }
  }, // Hiển thị tên VPS thay vì ID
  { accessorKey: 'ip_address', header: 'Địa chỉ IP' },
  { accessorKey: 'username', header: 'Tên đăng nhập' },
  { accessorKey: 'password', header: 'Mật khẩu' },
  { accessorKey: 'os', header: 'Hệ điều hành' },
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
  vps_id: '',
  ip_address: '',
  username: '',
  password: '',
  os: ''
});

// Lấy danh sách VPS từ API
const fetchVpsProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/vps_products');
    vpsProducts.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy danh sách VPS accounts từ API
const fetchVpsAccounts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/vps_accounts');
    vpsAccounts.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

// Thêm mới hoặc cập nhật VPS account
const submitForm = async () => {
  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/vps_accounts/${form.value.id}`, form.value);
      handleSucess("Thành công","Sửa tài khoản vps thành công");
    } else {
      await axios.post('http://127.0.0.1:8000/api/vps_accounts', form.value);
      handleSucess("Thành công","Thêm tài khoản vps thành công");
    }
    form.value = { vps_id: '', ip_address: '', username: '', password: '', os: '' };
    fetchVpsAccounts();
  } catch (error) {
    handleError(error);
  }
};

// Chỉnh sửa tài khoản VPS
const editAccount = (account) => {
  form.value = { ...account };
};

// Xóa tài khoản VPS
const deleteAccount = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/vps_accounts/${id}`);
    fetchVpsAccounts();
  } catch (error) {
    handleError(error);
  }
};

onMounted(async () => {
  await fetchVpsProducts();
  await fetchVpsAccounts();
});
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Tài khoản VPS</h1>

    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <label for="vps_id" class="block text-sm font-medium">Chọn vps</label>
        <Select v-model="form.vps_id">
          <SelectTrigger>
            <SelectValue placeholder="Chọn vps" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="vps in vpsProducts" :key="vps.id" :value="vps.id">
                {{ vps.plan }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="grid gap-y-2">
        <label for="ip_address">Địa chỉ IP</label>
        <Input type="text" id="ip_address" v-model="form.ip_address" required />
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
        <label for="os">Hệ điều hành</label>
        <Input type="text" id="os" v-model="form.os" required />
      </div>
      <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Tài khoản</Button>
    </form>

    <DataTable :columns="columns" :data="vpsAccounts"></DataTable>
  </div>
</template>
