<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import Label from '@/components/ui/label/Label.vue';
import Button from '@/components/ui/button/Button.vue';
import { Input } from '@/components/ui/input';
import { handleError, handleSucess } from '@/lib/utils';

const quyenList = ref([]);
const editMode = ref(false);
const form = ref({
  ma_quyen: undefined,
  ten_quyen: ''
});

// 🔹 Lấy danh sách quyền
const fetchQuyen = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/quyens');
    quyenList.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

// 🔹 Gửi dữ liệu (Thêm hoặc Cập nhật)
const onSubmit = async () => {
  try {
    if (editMode.value) {
      await axios.put(`http://127.0.0.1:8000/api/quyens/${form.value.ma_quyen}`, form.value);
      handleSucess("Thành công","Sửa quyền thành công");
    } else {
      await axios.post('http://127.0.0.1:8000/api/quyens', form.value);
      handleSucess("Thành công","Thêm quyền thành công");
    }
    clearData();
    fetchQuyen();
  } catch (error) {
    handleError(error);
  }
};

// 🔹 Xóa quyền
const deleteQuyen = async (id: number) => {
  if (confirm('Bạn có chắc chắn muốn xóa quyền này?')) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/quyens/${id}`);
      handleSucess("Thành công","Xóa quyền thành công");
      fetchQuyen();
    } catch (error) {
      handleError(error);
    }
  }
};

// 🔹 Xóa dữ liệu form
const clearData = () => {
  editMode.value = false;
  form.value = { ma_quyen: undefined, ten_quyen: '' };
};

onMounted(fetchQuyen);

// 🔹 Cấu hình cột cho DataTable
const columns: ColumnDef<any>[] = [
  { accessorKey: 'ma_quyen', header: 'Mã Quyền' },
  { accessorKey: 'ten_quyen', header: 'Tên Quyền' },
  {
    accessorKey: 'action',
    header: 'Hành động',
    enableSorting: false,
    cell: ({ row }) => h('div', {}, [
      h(Button, {
        variant: "outline",
        onClick: () => {
          editMode.value = true;
          form.value = { ...row.original };
        }
      }, () => "Sửa"),
      h(Button, { variant: "destructive", onClick: () => deleteQuyen(row.original.ma_quyen) }, () => "Xóa")
    ])
  },
];
</script>

<template>
  <div>
    <page-header title="Quản lý Quyền"></page-header>
    
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="ten_quyen">Tên Quyền</Label>
        <Input type="text" v-model="form.ten_quyen" placeholder="Tên Quyền" required />
      </div>
      <Button type="submit" v-if="!editMode">Thêm quyền</Button>
      <Button type="submit" v-if="editMode">Cập nhật</Button>
      <Button v-if="editMode" @click="clearData">Hủy</Button>
    </form>

    <DataTable :columns="columns" :data="quyenList"></DataTable>
  </div>
</template>
