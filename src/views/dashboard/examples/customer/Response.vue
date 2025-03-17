<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/responses.json';
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
    header: 'Mã phản hồi',
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
    accessorKey: 'rate',
    header: 'Đánh giá',
    enableSorting: false,
  },
  {
    accessorKey: 'comment',
    header: 'Bình luận',
    enableSorting: false,
  },
  {
    accessorKey: 'date',
    header: 'Ngày lập',
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
        variant: "destructive",
      }, () => "Xóa" ),
      
    ])
  },
];
interface PAYLOAD {
  Id : string | number,
  customerId : string ,
  serviceId :  string,
  rate : number | string,
  comment : string | number,
  date : any,
}
const form = ref<PAYLOAD>({
  Id : "",
  customerId : "",
  serviceId : "",
  rate : 0,
  comment : "",
  date : "",
  
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lí phản hồi"></page-header>
    
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="receiptId">Mã phản hồi</Label>
        <Input type="text" id="receiptId" placeholder="Mã phản hồi" v-model="form.Id"/>
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
        <Label for="rate">Đánh giá</Label>
        <Input type="number" id="rate" placeholder="Đánh giá" v-model="form.rate"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="comment">Bình luận</Label>
        <Input type="text" id="comment" placeholder="Bình luận" v-model="form.comment"/>
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
      <Button type="submit">Tìm kiếm</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="Id"></DataTable>
  </div>
</template>
