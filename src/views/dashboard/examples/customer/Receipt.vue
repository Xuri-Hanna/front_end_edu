<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/receipts.json';
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
    header: 'Mã hóa đơn',
    enableSorting: false,
  },
  {
    accessorKey: 'customer',
    header: 'Khách hàng',
    enableSorting: false,
    cell: ({row}) => row.original.customer.fullName
  },
  {
    accessorKey: 'service',
    header: 'Dịch vụ',
    enableSorting: false,
    cell: ({row}) => row.original.service.serviceName
  },
  {
    accessorKey: 'totalMoney',
    header: 'Tổng tiền',
    enableSorting: false,
  },
  {
    accessorKey: 'date',
    header: 'Ngày lập',
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
  receiptId : string | number,
  customerId : string | undefined,
  serviceId : string | undefined,
  totalMoney : string | number,
  date : any,
  status : string | undefined,
}
const form = ref<PAYLOAD>({
  receiptId : "",  
  customerId : "",
  serviceId : "",
  totalMoney : 0,
  date : "",
  status : undefined,
  
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lí hóa đơn"></page-header>
    
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="receiptId">Mã hóa đơn</Label>
        <Input type="text" id="receiptId" placeholder="Mã hóa đơn" v-model="form.receiptId"/>
      </div>
      <div class="grid gap-y-2">
        <Select v-model="form.customerId">
          <Label for="customerId">Mã khách hàng</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn mã khách hàng" />
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
        <Select v-model="form.customerId">
          <Label for="serviceId">Mã dịch vụ</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn mã dịch vụ" />
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
        <Label for="totalMoney">Tổng tiền</Label>
        <Input type="number" id="totalMoney" placeholder="Tên khách hàng" v-model="form.totalMoney"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="date">Ngày lập</Label>
        <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal',
          !form.date && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ form.date ? df.format(form.date.toDate(getLocalTimeZone())) : "Chọn ngày lập" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="form.date" initial-focus />
    </PopoverContent>
  </Popover>
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
      <Button type="submit">Thêm hóa đơn</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="customer"></DataTable>
  </div>
</template>
