<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/ui/button/Button.vue';

// Danh sách VPS
const vpsList = ref([]);

// Định nghĩa cột cho bảng hiển thị
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã VPS' },
  { accessorKey: 'plan', header: 'Gói VPS' },
  { accessorKey: 'cpu', header: 'CPU' },
  { accessorKey: 'ram', header: 'RAM' },
  { accessorKey: 'storage', header: 'Dung lượng' },
  { accessorKey: 'bandwidth', header: 'Băng thông' },
  { accessorKey: 'os', header: 'Hệ điều hành' },
  { 
    accessorKey: 'price', 
    header: 'Giá',
    cell: ({ row }) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.price)
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) => h('div', {}, [
      h(Button, { variant: 'outline', onClick: () => editVPS(row.original) }, 'Sửa'),
      h(Button, { variant: 'destructive', onClick: () => deleteVPS(row.original.id) }, 'Xóa')
    ])
  }
];

// Giao diện dữ liệu VPS
interface VPSPayload {
  id?: number;
  plan: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  os: string;
  price: number;
}

// Khởi tạo form nhập liệu
const form = ref<VPSPayload>({
  plan: '',
  cpu: '',
  ram: '',
  storage: '',
  bandwidth: '',
  os: '',
  price: 0
});

// Lấy danh sách VPS từ API
const fetchVPS = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/vps');
  vpsList.value = response.data;
};

// Gửi dữ liệu để thêm/cập nhật VPS
const submitForm = async () => {
  if (form.value.id) {
    await axios.put(`http://127.0.0.1:8000/api/vps/${form.value.id}`, form.value);
  } else {
    await axios.post('http://127.0.0.1:8000/api/vps', form.value);
  }
  form.value = { plan: '', cpu: '', ram: '', storage: '', bandwidth: '', os: '', price: 0 };
  fetchVPS();
};

// Chỉnh sửa VPS
const editVPS = (vps: VPSPayload) => {
  form.value = { ...vps };
};

// Xóa VPS
const deleteVPS = async (id: number) => {
  await axios.delete(`http://127.0.0.1:8000/api/vps/${id}`);
  fetchVPS();
};

onMounted(fetchVPS);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý VPS</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <label for="plan">Gói VPS</label>
        <Input type="text" id="plan" v-model="form.plan" required />
      </div>
      <div class="grid gap-y-2">
        <label for="cpu">CPU</label>
        <Input type="text" id="cpu" v-model="form.cpu" required />
      </div>
      <div class="grid gap-y-2">
        <label for="ram">RAM</label>
        <Input type="text" id="ram" v-model="form.ram" required />
      </div>
      <div class="grid gap-y-2">
        <label for="storage">Dung lượng</label>
        <Input type="text" id="storage" v-model="form.storage" required />
      </div>
      <div class="grid gap-y-2">
        <label for="bandwidth">Băng thông</label>
        <Input type="text" id="bandwidth" v-model="form.bandwidth" required />
      </div>
      <div class="grid gap-y-2">
        <label for="os">Hệ điều hành</label>
        <Input type="text" id="os" v-model="form.os" required />
      </div>
      <div class="grid gap-y-2">
        <label for="price">Giá VPS</label>
        <Input type="number" id="price" v-model.number="form.price" required />
      </div>
      <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} VPS</Button>
    </form>
    
    <DataTable :columns="columns" :data="vpsList"></DataTable>
  </div>
</template>
