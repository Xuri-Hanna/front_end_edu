<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/domains.json';
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
    header: 'Mã miền',
    enableSorting: false,
  },
  {
    accessorKey: 'customer',
    header: 'Khách hàng',
    enableSorting: false,
    cell: ({row}) => row.original.customer.fullName
  },
  {
    accessorKey: 'domainName',
    header: 'Tên miền',
    enableSorting: false,
  },
  {
    accessorKey: 'register',
    header: 'Ngày đăng kí',
    enableSorting: false,
  },
  {
    accessorKey: 'expireDate',
    header: 'Ngày hết hạn',
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
  customerId : string | undefined,
  domainName : string | undefined,
  register : any,
  expireDate : any,
  status : string | undefined,
  createdAt : any,
  updatedAt : any
}
const form = ref<PAYLOAD>({
  Id : "",  
  customerId : "",
  domainName : "",
  register : "",
  expireDate : "",
  status : undefined,
  createdAt : "",
  updatedAt : ""
  
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lí miền"></page-header>
    
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="domainId">Mã miền</Label>
        <Input type="text" id="domainId" placeholder="Mã miền" v-model="form.Id"/>
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
        <Label for="domainName">Tên miền</Label>
        <Input type="text" id="domainName" placeholder="Tên miền" v-model="form.domainName"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="register">Ngày đăng kí</Label>
        <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal',
          !form.register && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ form.register ? df.format(form.register.toDate(getLocalTimeZone())) : "Chọn ngày đăng kí" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="form.register" initial-focus />
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
      <div class="grid gap-y-2">
        <Label for="createdAt">Ngày lập</Label>
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
      <Button type="submit">Thêm hóa đơn</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="customer"></DataTable>
  </div>
</template>
