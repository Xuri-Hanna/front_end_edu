<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/voucherTypes.json';
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
const columns: ColumnDef<PAYLOAD>[] = [
  
  {
    accessorKey: 'voucherTypeId',
    header: 'Mã loại khuyến mại',
    enableSorting: false,
  },
  {
    accessorKey: 'voucherTypeName',
    header: 'Tên loại khuyến mại',
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
  voucherTypeId : string | number,
  voucherTypeName : string | undefined,
  status : string | undefined,
}
const form = ref<PAYLOAD>({
  voucherTypeId : "",
  voucherTypeName : "",
  status : undefined,
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Phân loại khuyến mại"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="voucherTypeId">Mã loại dịch vụ</Label>
        <Input type="text" id="voucherTypeId" placeholder="Mã loại dịch vụ" v-model="form.voucherTypeId"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="voucherTypeName">Tên loại dịch vụ</Label>
        <Input type="text" id="voucherTypeName" placeholder="Tên loại dịch vụ" v-model="form.voucherTypeId"/>
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
      <div></div>
      <Button type="submit">Thêm loại khuyến mại</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="voucherTypeName"></DataTable>
  </div>
</template>
