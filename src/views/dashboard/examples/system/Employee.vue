<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
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

interface StatusType {
  tag: string;
  title: string;
}

const tagVariants: StatusType[] = [
  { tag: 'success', title: 'Kích hoạt', value: 'active' },
  { tag: 'warning', title: 'Khóa', value: 'none' },
];


const tasks = ref([]);
const editMode = ref(false);
const form = ref({
  id: undefined, // Sửa ma_nhan_vien -> id
  chuc_vu: '',
  status: '1',
  hoten: '',
  email: '',
  password: ''
});

// Hàm lấy danh sách tài khoản
const fetchTaiKhoan = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/tai_khoans');
    tasks.value = response.data.map(nv => ({
      ma_nhan_vien: nv.ma_nhan_vien,
      hoten: nv.hoten,
      email: nv.email,
      password: nv.password,
      chuc_vu: nv.chuc_vu,
      status: nv.status === "Kích hoạt" ? "active" : "none" // Đảm bảo dữ liệu chuẩn hóa
    }));
  } catch (error) {
    handleError(error);
  }
};



const onSubmit = async () => {
  try {
    console.log("Dữ liệu gửi lên:", form.value);
    if (editMode.value) {
      await axios.put(`http://127.0.0.1:8000/api/tai_khoans/${form.value.ma_nhan_vien}`, {
        ...form.value,
      });
      handleSucess("Thành công","Sửa tài khoản thành công");
    } else {
      await axios.post('http://127.0.0.1:8000/api/tai_khoans', {
        ...form.value,
      });
      handleSucess("Thành công","Thêm tài khoản thành công");
    }
    clearData();
    fetchTaiKhoan();
  } catch (error) {
    handleError(error);
  }
};



// Xóa tài khoản
const deleteTaiKhoan = async (id: number) => {
  if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tai_khoans/${id}`);
      handleSucess("Thành công","Xóa tài khoản thành công");
      fetchTaiKhoan();
    } catch (error) {
      handleError(error);
    }
  }
};

// Xóa dữ liệu form
const clearData = () => {
  editMode.value = false;
  form.value = { id: undefined, chuc_vu: '', status: '1', hoten: '', email: '', password: '' };
};

onMounted(fetchTaiKhoan);


// Cấu hình cột cho DataTable
const columns: ColumnDef<any>[] = [
  { accessorKey: 'ma_nhan_vien', header: 'Mã nhân viên' },  // Hiển thị mã nhân viên
  { accessorKey: 'hoten', header: 'Họ tên' },
  { accessorKey: 'chuc_vu', header: 'Chức vụ' },
  { accessorKey: 'email', header: 'Email' },
  {
  accessorKey: 'status',
  header: 'Trạng thái',
  enableSorting: false,
  cell: ({ row }) => {
    const statusTag = tagVariants.find(tag => tag.value === row.original.status);
    return h(Badge, { variant: statusTag?.tag }, () => statusTag?.title);
  }
  },
  {
    accessorKey: 'action',
    header: 'Hành động',
    enableSorting: false,
    cell: ({ row }) => h('div', {}, [
      h(Button, {
        variant: "outline",
        onClick: () => {
          editMode.value = true;
          form.value = { ...row.original };  // Cập nhật form khi sửa
        }
      }, () => "Sửa"),
      h(Button, { variant: "destructive", onClick: () => deleteTaiKhoan(row.original.ma_nhan_vien) }, () => "Xóa")
    ])
  },
];

</script>

<template>
  <div>
    <page-header title="Quản lý tài khoản"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="hoten">Họ tên</Label>
        <Input type="text" v-model="form.hoten" placeholder="Họ tên" />
      </div>
      <div class="grid gap-y-2">
        <Label for="email">Email</Label>
        <Input type="email" v-model="form.email" placeholder="Email" />
      </div>
      <div class="grid gap-y-2">
        <Label for="password">Mật khẩu</Label>
        <Input type="password" v-model="form.password" placeholder="Mật khẩu" />
      </div>
      <div class="grid gap-y-2">
        <Label for="chuc_vu">Chức vụ</Label>
        <Input type="text" v-model="form.chuc_vu" placeholder="Chức vụ" />
      </div>
      <div class="grid gap-y-2">
        <Label for="status">Trạng thái</Label>
        <Select v-model="form.status">
          <SelectTrigger>
            <SelectValue :placeholder="form.status === 'active' ? 'Kích hoạt' : 'Khóa'" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="active">Kích hoạt</SelectItem>
              <SelectItem value="none">Khóa</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" v-if="!editMode">Thêm tài khoản</Button>
      <Button type="submit" v-if="editMode">Cập nhật</Button>
      <Button v-if="editMode" @click="clearData">Hủy</Button>
    </form>
    <DataTable :columns="columns" :data="tasks"></DataTable>
  </div>
</template>
