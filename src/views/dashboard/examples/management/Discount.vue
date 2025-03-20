<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';

// Danh sách mã giảm giá
const discounts = ref([]);

// Định nghĩa cột cho bảng hiển thị
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã ID' },
  { accessorKey: 'code', header: 'Mã giảm giá' },
  { accessorKey: 'percentage', header: 'Phần trăm (%)' },
  { accessorKey: 'expiry_date', header: 'Ngày hết hạn' },
  { accessorKey: 'discount_type', header: 'Loại giảm giá' },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', {}, [
        h(Button, { variant: 'outline', onClick: () => editDiscount(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deleteDiscount(row.original.id) }, 'Xóa')
      ])
  }
];

// Dữ liệu form
const form = ref({
  id: null,
  percentage: '',
  expiry_date: '',
  discount_type: 'manual'
});

// Lấy danh sách mã giảm giá từ API
const fetchDiscounts = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/discounts');
    discounts.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách mã giảm giá:', error);
  }
};

// Thêm hoặc cập nhật mã giảm giá
const submitForm = async () => {
  try {   
      await axios.post('http://127.0.0.1:8000/api/discounts', form.value);
    form.value = { id: null, percentage: '', expiry_date: '', discount_type: '' };
    fetchDiscounts();
  } catch (error) {
    console.error('Lỗi khi lưu mã giảm giá:', error);
  }
};

// Chỉnh sửa mã giảm giá
const editDiscount = (discount) => {
  form.value = { ...discount };
};

// Xóa mã giảm giá
const deleteDiscount = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/discounts/${id}`);
    fetchDiscounts();
  } catch (error) {
    console.error('Lỗi khi xóa mã giảm giá:', error);
  }
};

onMounted(fetchDiscounts);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Mã Giảm Giá</h1>

    <form @submit.prevent="submitForm" class="grid grid-cols-3 gap-4 mb-6">
      <div class="grid gap-y-2">
        <label for="percentage">Phần Trăm (%)</label>
        <Input type="number" id="percentage" v-model="form.percentage" min="1" max="100" required />
      </div>
      <div class="grid gap-y-2">
        <label for="expiry_date">Ngày Hết Hạn</label>
        <Input type="date" id="expiry_date" v-model="form.expiry_date" required />
      </div>
      <div class="grid gap-y-2">
        <label for="discount_type">Loại Giảm Giá</label>
        <select v-model="form.discount_type" class="border p-2" required>
          <option value="">Chọn loại</option>
          <option value="manual">Thường niên</option>
          <option value="vip">Khách VIP</option>
        </select>
      </div>
      <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Mã Giảm Giá</Button>
    </form>

    <DataTable :columns="columns" :data="discounts"></DataTable>
  </div>
</template>
