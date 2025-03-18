<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/customers.json';
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
    header: 'khách hàng',
    enableSorting: false,
  },
  {
    accessorKey: 'customerType',
    header: 'Loại khách hàng',
    enableSorting: false,
    cell: ({row}) => row.original.customerType.customerTypeName
  },
  {
    accessorKey: 'fullName',
    header: 'Tên khách hàng',
    enableSorting: false,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại',
    enableSorting: false,
  },
  {
    accessorKey: 'fullName',
    header: 'Tên khách hàng',
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
      }, () => "Sửa" ),
      h(Button, {
        variant: "destructive",
      }, () => "Xóa" ),
      
    ])
  },
];
interface PAYLOAD {
  Id : string | number,
  phoneNumber : string ,
  fullName : string ,
  email : string,
  address : string
}
const form = ref<PAYLOAD>({
  Id : "",
  phoneNumber : "",
  fullName : "",
  email : "",
  address : ""
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lí khách hàng"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="customerId">Mã khách hàng</Label>
        <Input type="text" id="customerId" placeholder="Tên khách hàng" v-model="form.Id"/>
      </div>
      
      <div class="grid gap-y-2">
        <Label for="fullName">Tên khách hàng</Label>
        <Input type="text" id="fullName" placeholder="Tên khách hàng" v-model="form.fullName"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="phoneNumber">Số điện thoại</Label>
        <Input type="text" id="phoneNumber" placeholder="Số điện thoại" v-model="form.phoneNumber"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="email">Email</Label>
        <Input type="text" id="email" placeholder="Email" v-model="form.email"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="address">Address</Label>
        <Input type="text" id="address" placeholder="address" v-model="form.address"/>
      </div>
      <Button type="submit">Thêm khách hàng</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="fullName"></DataTable>
  </div>
</template>
