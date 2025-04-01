<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
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

// Danh sách nhân viên, quyền, và phân quyền
const phanQuyenList = ref([]);
const taiKhoanList = ref([]);
const quyenList = ref([]);
const editMode = ref(false);

// Dữ liệu form
const form = ref({
  ma_phan_quyen:'',
  ma_nhan_vien: '',
  ma_quyen: ''
});

// 🛠 Lấy danh sách phân quyền từ API
const fetchPhanQuyen = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/phan_quyens');
    phanQuyenList.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

// 🛠 Lấy danh sách tài khoản (nhân viên)
const fetchTaiKhoan = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/tai_khoans');
    taiKhoanList.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

// 🛠 Lấy danh sách quyền
const fetchQuyen = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/quyens');
    quyenList.value = response.data;
  } catch (error) {
    handleError(error);
  }
};

// 🛠 Gửi dữ liệu (Thêm / Sửa phân quyền)
const onSubmit = async () => {
  try {
    if (editMode.value) {
      await axios.put(`http://localhost:8000/api/phan_quyens/${form.value.ma_phan_quyen}`, form.value);
    } else {
      await axios.post('http://localhost:8000/api/phan_quyens', form.value);
    }
    handleSucess("Thành công","Phân quyền thành công");
    clearData();
    fetchPhanQuyen();
  } catch (error) {
    handleError(error);
  }
};

// 🛠 Xóa phân quyền
const deletePhanQuyen = async (id: number) => {
  if (confirm('Bạn có chắc chắn muốn xóa phân quyền này?')) {
    try {
      await axios.delete(`http://localhost:8000/api/phan_quyens/${id}`);
      handleSucess("Thành công","Hủy phân quyền thành công");
      fetchPhanQuyen();
    } catch (error) {
      handleError(error);
    }
  }
};

// 🛠 Xóa dữ liệu form
const clearData = () => {
  editMode.value = false;
  form.value = { 
    ma_phan_quyen: '', // ✅ Đặt lại giá trị khi hủy
    ma_nhan_vien: '', 
    ma_quyen: ''
  };
};

// 🛠 Load dữ liệu khi component được tạo
onMounted(() => {
  fetchPhanQuyen();
  fetchTaiKhoan();
  fetchQuyen();
});

// 🛠 Cấu hình cột cho DataTable
const columns: ColumnDef<any>[] = [
  { accessorKey: 'ten_nhan_vien', header: '' }, 
  { accessorKey: 'chuc_vu', header: 'Chức vụ' },
  { accessorKey: 'ten_quyen', header: 'Tên quyền' },
  {
    accessorKey: 'action',
    header: 'Hành động',
    enableSorting: false,
    cell: ({ row }) =>
      h('div', { class: 'flex justify-center' }, [
        h(
          Button,
          {
            variant: 'outline',
            class: 'mr-2',
            onClick: () => {
              editMode.value = true;
              form.value = {
                ma_phan_quyen: row.original.ma_phan_quyen, 
                ma_nhan_vien: row.original.ma_nhan_vien,
                ma_quyen: row.original.ma_quyen
              };
            }
          },
          () => 'Sửa'
        ),
        h(
          Button,
          {
            variant: 'destructive',
            onClick: () => deletePhanQuyen(row.original.ma_phan_quyen)
          },
          () => 'Xóa'
        )
      ])
  }
];

</script>

<template>
  <div>
    <h2 class="text-lg font-bold mb-4">Quản lý Phân Quyền</h2>

    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div>
        <label for="ma_nhan_vien" class="block text-sm font-medium">Tên nhân viên</label>
        <Select v-model="form.ma_nhan_vien">
          <SelectTrigger>
            <SelectValue placeholder="Chọn nhân viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="tk in taiKhoanList" :key="tk.ma_nhan_vien" :value="tk.ma_nhan_vien">
                {{ tk.chuc_vu }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label for="ma_quyen" class="block text-sm font-medium">Tên quyền</label>
        <Select v-model="form.ma_quyen">
          <SelectTrigger>
            <SelectValue placeholder="Chọn quyền" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="quyen in quyenList" :key="quyen.ma_quyen" :value="quyen.ma_quyen">
                {{ quyen.ten_quyen }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" class="col-span-2">{{ editMode ? "Cập nhật" : "Thêm mới" }}</Button>
      <Button v-if="editMode" @click="clearData">Hủy</Button>
    </form>

    <DataTable :columns="columns" :data="phanQuyenList" search="ten_nhan_vien"></DataTable>
  </div>
</template>
