<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/carts.json';
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
    accessorKey: 'cartId',
    header: 'Mã giỏ hàng',
    enableSorting: false,
  },
  {
    accessorKey: 'customer',
    header: 'khách hàng',
    enableSorting: false,
    cell: ({row}) => row.original.customer.fullName
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
        class: 'mr-2',
      }, () => "Xóa" ),
      h(Button, {
        variant: "secondary",
        onClick : () => {
          router.push({name: 'CartDetail',params: {id : '1'}})
        }
      }, () => "Chi tiết" ),
      
    ])
  },
];
interface PAYLOAD {
  cartId : string | number,
  customerId : string | undefined,
  status : string | undefined,
}
const form = ref<PAYLOAD>({
  cartId : "",
  customerId : "",
  status : undefined
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lí giỏ hàng"></page-header>
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="cartId">Mã giỏ hàng</Label>
        <Input type="text" id="cartId" placeholder="Tên giỏ hàng" v-model="form.cartId"/>
      </div>
      <div class="grid gap-y-2">
        <Select v-model="form.customerId">
          <Label for="customerId">Chọn khách hàng</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn khách hàng" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">
                Lê Hoàng Tuấn
              </SelectItem>
              <SelectItem value="2">
                Nguyễn Quốc Trung
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
      <div></div>
      <Button type="submit">Tìm kiếm</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="cartId"></DataTable>
  </div>
</template>
