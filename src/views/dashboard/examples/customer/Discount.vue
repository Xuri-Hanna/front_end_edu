<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/discounts.json';
import { ref, h } from 'vue';
import { Badge } from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import Button from '@/components/ui/button/Button.vue';
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-vue-next'
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
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})
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
    header: 'Mã giảm giá',
    enableSorting: false,
  },
  {
    accessorKey: 'code',
    header: 'Code',
    enableSorting: false,
  },
  {
    accessorKey: 'percentage',
    header: 'Phần trăm giảm',
    enableSorting: false,
  },
  {
    accessorKey: 'expireDate',
    header: 'Ngày hết hạn',
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày lập',
    enableSorting: false,
  },
  {
    accessorKey: 'updatedAt',
    header: 'Ngày cập nhật',
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
  Id : string | number,
  code : string | undefined,
  percentage : string | undefined,
  expireDate : any,
  createdAt : any,
  updatedAt : any,
}
const form = ref<PAYLOAD>({
  Id : "",  
  code : "",
  percentage : "",
  expireDate : "",
  createdAt : "",
  updatedAt : undefined,
  
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lí mã giảm giá"></page-header>
    
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="discountId">Mã giảm giá</Label>
        <Input type="text" id="discountId" placeholder="Mã hóa đơn" v-model="form.Id"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="code">Code giảm giá</Label>
        <Input type="text" id="code" placeholder="Mã hóa đơn" v-model="form.code"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="percentage">Phần trăm giảm giá</Label>
        <Input type="number" id="percentage" placeholder="Mã hóa đơn" v-model="form.percentage"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="expireDate">Ngày hết hạn</Label>
        <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal',
          !form.expireDate && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ form.expireDate ? df.format(form.expireDate.toDate(getLocalTimeZone())) : "Chọn ngày hết hạn" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="form.expireDate" initial-focus />
    </PopoverContent>
  </Popover>
      </div>
      <div class="grid gap-y-2">
        <Label for="date">Ngày lập</Label>
        <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal',
          !form.createdAt && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ form.createdAt ? df.format(form.createdAt.toDate(getLocalTimeZone())) : "Chọn ngày lập" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="form.createdAt" initial-focus />
    </PopoverContent>
  </Popover>
      </div>
      <div></div>
      <Button type="submit">Thêm mã giảm giá</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="code"></DataTable>
  </div>
</template>
