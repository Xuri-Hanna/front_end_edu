<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import Button from '@/components/ui/button/Button.vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';

const hostings = ref([]);

const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã Hosting' },
  { accessorKey: 'plan', header: 'Tên Plan' },
  {
    accessorKey: 'price',
    header: 'Giá',
    enableSorting: false,
    cell: ({ row }) => {
      const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(row.original.price);

      return formattedPrice;
    }
  },
  { accessorKey: 'disk_space', header: 'Dung lượng' },
  { accessorKey: 'bandwidth', header: 'Băng thông' },
  { accessorKey: 'accounts_ftp', header: 'Tài khoản FTP' },
  { accessorKey: 'addon_domains', header: 'Miền thêm' },
  { accessorKey: 'sub_domains', header: 'Miền phụ' },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) => h('div', {}, [
      h(Button, { variant: 'outline', onClick: () => editHosting(row.original) }, 'Sửa'),
      h(Button, { variant: 'destructive', onClick: () => deleteHosting(row.original.id) }, 'Xóa')
    ])
  }
];

interface HostingPayload {
  id?: number;
  plan: string;
  disk_space: string;
  bandwidth: string;
  accounts_ftp: number;
  addon_domains: number;
  sub_domains: number;
  status: string;
}

const form = ref<HostingPayload>({
  plan: '',
  disk_space: '',
  bandwidth: '',
  accounts_ftp: 0,
  addon_domains: 0,
  sub_domains: 0,
  status: 'active'
});

const fetchHostings = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/hostings');
  hostings.value = response.data;
};

const submitForm = async () => {
  if (form.value.id) {
    await axios.put(`http://127.0.0.1:8000/api/hostings/${form.value.id}`, form.value);
  } else {
    await axios.post('http://127.0.0.1:8000/api/hostings', form.value);
  }
  form.value = { plan: '', disk_space: '', bandwidth: '', accounts_ftp: 0, addon_domains: 0, sub_domains: 0, status: 'active' };
  fetchHostings();
};

const editHosting = (hosting: HostingPayload) => {
  form.value = { ...hosting };
};

const deleteHosting = async (id: number) => {
  await axios.delete(`http://127.0.0.1:8000/api/hostings/${id}`);
  fetchHostings();
};

onMounted(fetchHostings);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Hosting</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <Label for="plan">Tên Plan</Label>
        <Input type="text" id="plan" v-model="form.plan" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="price">Giá</Label>
        <Input type="number" id="price" placeholder="Giá" v-model="form.price" />
      </div>
      <div class="grid gap-y-2">
        <Label for="disk_space">Dung lượng</Label>
        <Input type="text" id="disk_space" v-model="form.disk_space" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="bandwidth">Băng thông</Label>
        <Input type="text" id="bandwidth" v-model="form.bandwidth" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="accounts_ftp">Tài khoản FTP</Label>
        <Input type="number" id="accounts_ftp" v-model.number="form.accounts_ftp" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="addon_domains">Miền thêm</Label>
        <Input type="number" id="addon_domains" v-model.number="form.addon_domains" required />
      </div>
      <div class="grid gap-y-2">
        <Label for="sub_domains">Miền phụ</Label>
        <Input type="number" id="sub_domains" v-model.number="form.sub_domains" required />
      </div>
      <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Hosting</Button>
    </form>
    <DataTable :columns="columns" :data="hostings"></DataTable>
  </div>
</template>
