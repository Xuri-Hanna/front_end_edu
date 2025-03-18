<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/orders.json';
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
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-vue-next'
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
    header: 'Mã hợp đồng',
    enableSorting: false,
  },
  {
    accessorKey: 'user',
    header: 'Tên khách hàng',
    enableSorting: false,
  },
  {
    accessorKey: 'order',
    header: 'Đơn hàng',
    enableSorting: false,
  },
  {
    accessorKey: 'serviceType',
    header: 'Loại dịch vụ',
    enableSorting: false,
  },
  {
    accessorKey: 'startDate',
    header: 'Ngày bắt đầu',
    enableSorting: false,
  },
  {
    accessorKey: 'endDate',
    header: 'Ngày kết thúc',
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
        variant: (tagVariants[Number(row.original.status )]?.tag as any),
        class: 'mr-2',
      }, () => tagVariants[Number(row.original.status )]?.title ),
      
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
        variant: "destructive",
      }, () => "Xóa" ),
      
    ])
  },
];
interface PAYLOAD {
  Id : string | number,
  userId : string | undefined,
  orderId : string | undefined,
  serviceType : string | undefined,
  startDate : any,
  endDate : any,
  status : string | undefined,
  createdAt : any,
  updatedAt : any
}
const form = ref<PAYLOAD>({
  Id : "",
  userId : "",
  orderId : "",
  serviceType : "",
  startDate : "",
  endDate : "",
  status : "",
  createdAt : "",
  updatedAt : ""
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lí hợp đồng"></page-header>
    
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="Id">Mã hợp đồng</Label>
        <Input type="text" id="Id" placeholder="Mã hợp đồng" v-model="form.Id"/>
      </div>
      <div class="grid gap-y-2">
        <Select v-model="form.userId">
          <Label for="customerId">Khách hàng</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn khách hàng" />
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
        <Select v-model="form.orderId">
          <Label for="orderId">Đơn hàng</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn đơn hàng" />
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
        <Select v-model="form.serviceType">
          <Label for="serviceType">Loại dịch vụ</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại dịch vụ" />
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
      <div class="grid gap-y-2">
        <Label for="date">Ngày bắt đầu</Label>
        <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal',
          !form.startDate && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ form.startDate ? df.format(form.startDate.toDate(getLocalTimeZone())) : "Chọn ngày bắt đầu" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="form.startDate" initial-focus />
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
      <div class="grid gap-y-2">
        <Label for="date">Ngày kết thúc</Label>
        <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn(
          'w-full justify-start text-left font-normal',
          !form.endDate && 'text-muted-foreground',
        )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ form.endDate ? df.format(form.endDate.toDate(getLocalTimeZone())) : "Chọn ngày kết thúc" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="form.endDate" initial-focus />
    </PopoverContent>
  </Popover>
      </div>
      <Button type="submit">Thêm hợp đồng</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="Id"></DataTable>
  </div>
</template>
