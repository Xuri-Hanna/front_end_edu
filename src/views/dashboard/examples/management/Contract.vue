<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import Button from '@/components/ui/button/Button.vue';
import Badge from '@/components/ui/badge/Badge.vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date';
import { CalendarIcon } from 'lucide-vue-next';


// API URL
const API_URL = 'http://localhost:8000/api/contracts'; // Cập nhật theo API của bạn

const df = new DateFormatter('en-US', { dateStyle: 'long' });

const tagVariants = {
  active: { tag: 'success', title: 'Kích hoạt' },
  expired: { tag: 'danger', title: 'Hết hạn' },
  pending: { tag: 'warning', title: 'Chờ duyệt' },
};

const contracts = ref([]);
const form = ref({
  id: null,
  user_id: '',
  order_id: '',
  start_date: '',
  end_date: '',
  status: '',
});

const isEditing = ref(false);

// Load hợp đồng từ API
const loadContracts = async () => {
  try {
    const { data } = await axios.get(API_URL);
    contracts.value = data.data;
  } catch (error) {
    console.error('Lỗi khi tải hợp đồng:', error);
  }
};

// Xử lý thêm/sửa hợp đồng
const submitForm = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`${API_URL}/${form.value.id}`, form.value);
    
    } else {
      await axios.post(API_URL, form.value);

    }
    resetForm();
    loadContracts();
  } catch (error) {
    console.error('Lỗi khi xử lý hợp đồng:', error);
  
  }
};

// Xử lý xóa hợp đồng
const deleteContract = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) return;
  try {
    await axios.delete(`${API_URL}/${id}`);

    loadContracts();
  } catch (error) {
    console.error('Lỗi khi xóa hợp đồng:', error);

  }
};

// Chỉnh sửa hợp đồng
const editContract = (contract) => {
  form.value = { ...contract };
  isEditing.value = true;
};

// Reset form
const resetForm = () => {
  form.value = {
    id: null,
    user_id: '',
    order_id: '',
    start_date: '',
    end_date: '',
    status: '',
  };
  isEditing.value = false;
};

// Cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã hợp đồng' },
  { accessorKey: 'khach_hang.name', header: 'Tên khách hàng' },
  { accessorKey: 'order.id', header: 'Mã đơn hàng' },
  { accessorKey: 'start_date', header: 'Ngày bắt đầu' },
  { accessorKey: 'end_date', header: 'Ngày kết thúc' },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) =>
      h(Badge, { variant: tagVariants[row.original.status].tag }, () =>
        tagVariants[row.original.status].title
      ),
  },
  {
    accessorKey: 'action',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'secondary', onClick: () => editContract(row.original) }, () => 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deleteContract(row.original.id) }, () => 'Xóa'),
        h(Button, { variant: 'secondary', onClick: () => deleteContract(row.original.id) }, () => '📩 Gửi Email'),
        h(
            Button,
            {
              variant: "outline",
              onClick: () => exportInvoice(invoice.id),
            },
            () => "Xuất"
          )
      ]),
  },
];

onMounted(loadContracts);
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Quản lý Hợp đồng</h2>

    <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-5 mb-10">
      <div class="grid gap-y-2">
        <Label for="user_id">Khách hàng</Label>
        <Input type="text" id="user_id" placeholder="Nhập ID khách hàng" v-model="form.user_id" />
      </div>
      <div class="grid gap-y-2">
        <Label for="order_id">Đơn hàng</Label>
        <Input type="text" id="order_id" placeholder="Nhập ID đơn hàng" v-model="form.order_id" />
      </div>
      <div class="grid gap-y-2">
        <Label for="start_date">Ngày bắt đầu</Label>
        <Input type="date" id="start_date" v-model="form.start_date" />
      </div>
      <div class="grid gap-y-2">
        <Label for="end_date">Ngày kết thúc</Label>
        <Input type="date" id="end_date" v-model="form.end_date" />
      </div>
      <div class="grid gap-y-2">
        <Label for="status">Trạng thái</Label>
        <Select v-model="form.status">
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="active">Kích hoạt</SelectItem>
              <SelectItem value="expired">Hết hạn</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{{ isEditing ? 'Cập nhật' : 'Thêm hợp đồng' }}</Button>
      <Button type="button" variant="outline" @click="resetForm">Hủy</Button>
    </form>

    <DataTable :columns="columns" :data="contracts" search="id"></DataTable>
  </div>
</template>
