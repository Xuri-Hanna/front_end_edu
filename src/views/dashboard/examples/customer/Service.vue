<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets//services.json';
import { ref, h } from 'vue';
import {Input} from '@/components/ui/input';
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
} from '@/components/ui/select'
import Textarea from '@/components/ui/textarea/Textarea.vue';

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
    header: 'Mã dịch vụ',
    enableSorting: false,
  },
  {
    accessorKey: 'serviceName',
    header: 'Tên dịch vụ',
    enableSorting: false,
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    enableSorting: false,
  },
  {
    accessorKey: 'price',
    header: 'Giá',
    enableSorting: false,
  },
  {
    accessorKey: 'serviceType',
    header: 'Loại dịch vụ',
    enableSorting: false,
    cell: ({row}) => row.original.serviceType.serviceTypeName
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
        variant: "destructive",
      }, () => "Xóa" ),
      
    ])
  },
];
interface PAYLOAD {
  Id : string | number,
  serviceName : string | number,
  description :  string | number,
  price : string | number,
  serviceTypeId : string | undefined,
  status : string | undefined,
}
const form = ref<PAYLOAD>({
  Id : "",
  serviceName : "",
  description : "",
  price : 0,
  serviceTypeId : "",
  status : "",
  
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lí dịch vụ"></page-header>
    
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="serviceId">Mã dịch vụ</Label>
        <Input type="text" id="serviceId" placeholder="Mã dịch vụ" v-model="form.Id"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="serviceName">Tên dịch vụ</Label>
        <Input type="text" id="serviceName" placeholder="Tên dịch vụ" v-model="form.serviceName"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="description">Mô tả</Label>
        <Textarea id="description" placeholder="Mô tả" v-model="form.description"/>
      </div>
      <div class=" gap-y-2">
        <Label for="price">Giá</Label>
        <Input type="number" id="price" placeholder="Tên dịch vụ" v-model="form.price"/>
      </div>
      <div class="grid gap-y-2">
        <Select v-model="form.serviceTypeId">
          <Label for="customerId">Loại dịch vụ</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn Loại dịch vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">
                1
              </SelectItem>
              <SelectItem value="2">
                2
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
                1
              </SelectItem>
              <SelectItem value="2">
                2
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit">Thêm dịch vụ</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="serviceName"></DataTable>
  </div>
</template>
