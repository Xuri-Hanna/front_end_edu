<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/ui/button/Button.vue';
import { errorMessages } from 'vue/compiler-sfc';

const domains = ref([]);

const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã Domain' },
  { accessorKey: 'domain_name', header: 'Tên Domain' },
  { 
    accessorKey: 'price_start', 
    header: 'Giá khởi tạo', 
    cell: ({ row }) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.price_start)
  },
  { 
    accessorKey: 'price', 
    header: 'Giá duy trì', 
    cell: ({ row }) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.price)
  },
  { 
    accessorKey: 'domain_type', 
    header: 'Loại Miền',
    cell: ({ row }) => row.original.domain_type === 'international' ? 'Miền Quốc tế' : 'Miền Việt Nam'
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) => h('div', {}, [
      h(Button, { variant: 'outline', onClick: () => editDomain(row.original) }, 'Sửa'),
      h(Button, { variant: 'destructive', onClick: () => deleteDomain(row.original.id) }, 'Xóa')
    ])
  }
];

interface DomainPayload {
  id?: number;
  domain_name: string;
  price: number;
  price_start:number;
  domain_type: string;
}

const form = ref<DomainPayload>({
  domain_name: '',
  price: 0,
  domain_type: 'international',
 price_start:0,
});

const fetchDomains = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/domains');
  domains.value = response.data;
  if(response.data){
    console.log('data',response.data);
  }else{
    console.log('error',errorMessages);
  }
};

const submitForm = async () => {
  if (form.value.id) {
    await axios.put(`http://127.0.0.1:8000/api/domains/${form.value.id}`, form.value);
  } else {
    await axios.post('http://127.0.0.1:8000/api/domains', form.value);
  }
  form.value = { domain_name: '', price: 0, domain_type: 'international', expiry_date: '' };
  fetchDomains();
};

const editDomain = (domain: DomainPayload) => {
  form.value = { ...domain };
};

const deleteDomain = async (id: number) => {
  await axios.delete(`http://127.0.0.1:8000/api/domains/${id}`);
  fetchDomains();
};

onMounted(fetchDomains);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Domain</h1>
    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
      <div class="grid gap-y-2">
        <label for="domain_name">Tên Domain</label>
        <Input type="text" id="domain_name" v-model="form.domain_name" required />
      </div>
      <div class="grid gap-y-2">
        <label for="price">Giá khởi tạo</label>
        <Input type="number" id="price" v-model.number="form.price_start" required />
      </div>
      <div class="grid gap-y-2">
        <label for="price">Giá duy trì </label>
        <Input type="number" id="price" v-model.number="form.price" required />
      </div>
      <div class="grid gap-y-2">
        <label for="domain_type">Loại Miền</label>
        <Select v-model="form.domain_type">
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại miền" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="international">Miền Quốc tế</SelectItem>
            <SelectItem value="vietnamese">Miền Việt Nam</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Domain</Button>
    </form>
    <DataTable :columns="columns" :data="domains"></DataTable>
  </div>
</template>
