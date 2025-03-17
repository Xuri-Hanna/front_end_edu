<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/authorizedUsers.json';
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
import {Card,CardContent} from '@/components/ui/card';
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
    accessorKey: 'nvId',
    header: 'Mã nhân viên',
    enableSorting: false,
  },
  {
    accessorKey: 'nvName',
    header: 'Họ tên',
    enableSorting: false,
  },
  {
    accessorKey: 'roleId',
    header: 'Mã quyền',
    enableSorting: false,
  },
  {
    accessorKey: 'roleName',
    header: 'Tên quyền',
    enableSorting: false,
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
      }, () => "Sửa" ),
      h(Button, {
        variant: "destructive",
      }, () => "Xóa" ),
      
    ])
  },
];

interface PAYLOAD {
  roleId : string | undefined,
  nvId : string | undefined,

}
const form = ref<PAYLOAD>({
  nvId : "",
  roleId : "",
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lý phân quyền"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
        <div class="grid gap-y-2">
        <Select v-model="form.nvId">
          <Label for="roleName">Tên nhân viên</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn nhân viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">
                Lê Hoàng Tuấn
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="grid gap-y-2">
        <Select v-model="form.roleId">
          <Label for="status">Tên quyền</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn quyền" />
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
      <Button type="submit" class="col-span-2">Phân quyền</Button>

    </form>
    <DataTable :columns="columns" :data="tasks" search="nvName"></DataTable>
  </div>
</template>
