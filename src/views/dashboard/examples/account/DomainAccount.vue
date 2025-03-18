<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';

// Danh sách tài khoản domain
const domainAccounts = ref([]);
const domainProducts = ref([]);

// Định nghĩa cột cho bảng hiển thị
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã tài khoản' },
  {
    accessorKey: 'domain_id',
    header: 'Tên Domain',
    cell: ({ row }) => {
      // Tìm hosting tương ứng trong danh sách hostingProducts
      const domain = domainProducts.value.find(h => h.id === row.original.domain_id);
      return domain ? domain.domain_name : 'Không xác định'; // Nếu không tìm thấy, hiển thị 'Không xác định'
    }
  },
  { accessorKey: 'registrar_panel', header: 'Bảng điều khiển' },
  { accessorKey: 'username', header: 'Tên đăng nhập' },
  { accessorKey: 'password', header: 'Mật khẩu' },
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
  domain_id: '',
  registrar_panel: '',
  username: '',
  password: ''
});

// Lấy danh sách domain products
const fetchDomainProducts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/domain_products');
    domainProducts.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách domain:', error);
  }
};

// Lấy danh sách domain accounts từ API
const fetchDomainAccounts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/domain_accounts');
    domainAccounts.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách domain account:', error);
  }
};

// Thêm mới hoặc cập nhật domain account
const submitForm = async () => {
  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/domain_accounts/${form.value.id}`, form.value);
    } else {
      await axios.post('http://127.0.0.1:8000/api/domain_accounts', form.value);
    }
    form.value = { domain_id: '', registrar_panel: '', username: '', password: '' };
    fetchDomainAccounts();
  } catch (error) {
    console.error('Lỗi khi lưu domain account:', error);
  }
};

// Chỉnh sửa tài khoản domain
const editAccount = (account) => {
  form.value = { ...account };
};

// Xóa tài khoản domain
const deleteAccount = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/domain_accounts/${id}`);
    fetchDomainAccounts();
  } catch (error) {
    console.error('Lỗi khi xóa domain account:', error);
  }
};

onMounted(async () => {
  await fetchDomainProducts();
  await fetchDomainAccounts();
});
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Tài khoản Domain</h1>

    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <label for="domain_id">Chọn Domain</label>
        <select v-model="form.domain_id" class="border p-2">
          <option value="">Chọn Domain</option>
          <option v-for="domain in domainProducts" :key="domain.id" :value="domain.id">
            {{ domain.domain_name }}
          </option>
        </select>
      </div>

      <div class="grid gap-y-2">
        <label for="registrar_panel">Bảng điều khiển</label>
        <Input type="text" id="registrar_panel" v-model="form.registrar_panel" required />
      </div>
      <div class="grid gap-y-2">
        <label for="username">Tên đăng nhập</label>
        <Input type="text" id="username" v-model="form.username" required />
      </div>
      <div class="grid gap-y-2">
        <label for="password">Mật khẩu</label>
        <Input type="password" id="password" v-model="form.password" required />
      </div>
      <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Tài khoản</Button>
    </form>

    <DataTable :columns="columns" :data="domainAccounts"></DataTable>
  </div>
</template>
