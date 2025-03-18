<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/users.json';
import { ref, h } from 'vue';
import { Badge } from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import Button from '@/components/ui/button/Button.vue';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import router from '@/router';
interface status {
  tag : string,
  title : string
}
const tagVariants: status[] = [
  {
      tag : 'success',
      title : 'Kích hoạt'
  },
  {
      tag : 'warning',
      title : 'Khóa'
  },
]


const tasks = ref(data);
const columns: ColumnDef<any>[] = [
  
  {
    accessorKey: 'Id',
    header: 'Mã nhân viên',
    enableSorting: false,
  },
  {
    accessorKey: 'fullName',
    header: 'Họ tên',
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: 'Chức vụ',
    enableSorting: false,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại',
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    enableSorting: false,
    cell: ({ row }) => h('div', {
      class: 'max-w-[500px] truncate flex items-center',
    }, [
      h(Badge, {
        variant: (tagVariants[Number(row.original.status )].tag as any),
        class: 'mr-2',
      }, () => tagVariants[Number(row.original.status )].title ),
      
    ])
  },
  {
    accessorKey: 'action',
    header: 'Hành động',
    enableSorting: false,
    cell: ({ row }) => h('div', {
      class: 'max-w-[500px] truncate flex items-center',
    }, [
      h(Button, {
        variant: "outline",
        class: 'mr-2',
        onClick : () => {
          editMode.value = true;
          form.value = row.original
        }
      }, () => "Sửa"),
      h(Button, {
        variant: "destructive",
      }, () => "Xóa" )
    ])
  },
];
interface PAYLOAD {
  Id : number | undefined,
  role : string | undefined,
  status : string | undefined,
  phoneNumber : string | number,
  fullName : string | number,
  email : string | number
}
const form = ref<PAYLOAD>({
  Id : undefined,
  role : undefined,
  status : undefined,
  phoneNumber : "",
  fullName : "",
  email : ""
})
const onSubmit = () => {
  
}
const clearData = () => {
  editMode.value = false;
  form.value = {
    Id : undefined,
    role : undefined,
    status : undefined,
    phoneNumber : "",
    fullName : "",
    email : ""
  }
}
const editMode = ref(false);
</script>

<template>
  <div>
    <page-header title="Quản lý nhân viên"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="Id">Mã nhân viên</Label>
        <Input type="text" id="Id" placeholder="Mã nhân viên" v-model="form.Id"/>
      </div>
      <div class="grid gap-y-2">
        <Select v-model="form.role">
          <Label for="role">Chức vụ</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn chức vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">
                Giám đốc
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-y-2">
        <Select v-model="form.status">
          <Label for="status">Trạng thái</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">
                Kích hoạt
              </SelectItem>
              <SelectItem value="2">
                Khóa
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-y-2">
        <Label for="phoneNumber">Số điện thoại</Label>
        <Input type="number" id="phoneNumber" placeholder="Số điện thoại" v-model="form.phoneNumber"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="fullName">Họ tên</Label>
        <Input type="text" id="fullName" placeholder="Họ tên" v-model="form.fullName"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" v-model="form.email"/>
      </div>
      <Button type="submit" class="col-span-2" v-if="!editMode">Thêm người dùng</Button>
      <Button type="submit" v-if="editMode">Sửa người dùng</Button>
      <Button type="submit" @click="clearData()" v-if="editMode">Hủy</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="email"></DataTable>
  </div>
</template>
