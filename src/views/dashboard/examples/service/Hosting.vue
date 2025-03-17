<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/hostings.json';
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
    header: 'Mã hosting',
    enableSorting: false,
  },
  {
    accessorKey: 'customer',
    header: 'Khách hàng',
    enableSorting: false,
    cell: ({row}) => row.original.customer.fullName
  },
  {
    accessorKey: 'domain',
    header: 'Tên miền',
    enableSorting: false,
    cell: ({row}) => row.original.domain.domainName
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
    accessorKey: 'plan',
    header: 'Tên plan',
    enableSorting: false,
  },
  {
    accessorKey: 'diskspace',
    header: 'Dung lượng',
    enableSorting: false,
  },
  {
    accessorKey: 'bandwidth',
    header: 'Băng thông',
    enableSorting: false,
  },
  {
    accessorKey: 'accountFtp',
    header: 'Tài khoản Ftp',
    enableSorting: false,
  },
  {
    accessorKey: 'addonDomains',
    header: 'Miền thêm',
    enableSorting: false,
  },
  {
    accessorKey: 'subDomains',
    header: 'Miền phụ',
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
  domainId : string | undefined,
  plan : string | undefined,
  diskspace : string | undefined,
  bandwidth : string | undefined,
  accountFtp : string | undefined,
  addonDomains : string | undefined,
  subDomains : string | undefined,
  status : string | undefined,
  createdAt : any,
  updatedAt : any
}
const form = ref<PAYLOAD>({
  Id : "",  
  customerId : "",
  domainId : "",
  plan : "",
  diskspace : "",
  bandwidth : "",
  accountFtp : "",
  addonDomains : "",
  subDomains : "",
  status : "",
  createdAt : "",
  updatedAt : ""
  
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lí hosting"></page-header>

    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="hostingId">Mã hosting</Label>
        <Input type="text" id="hostingId" placeholder="Mã miền" v-model="form.Id"/>
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
        <Select v-model="form.domainId">
          <Label for="domainId">Mã miền</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn mã miền" />
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
        <Label for="plan">Tên plan</Label>
        <Input type="text" id="plan" placeholder="Tên plan" v-model="form.plan"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="diskspace">Tên plan</Label>
        <Input type="text" id="diskspace" placeholder="Tên diskspace" v-model="form.diskspace"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="bandwidth">Tên bandwidth</Label>
        <Input type="text" id="bandwidth" placeholder="Tên bandwidth" v-model="form.bandwidth"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="accountFtp">Tên accountFtp</Label>
        <Input type="number" id="accountFtp" placeholder="Tên accountFtp" v-model="form.accountFtp"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="addonDomains">Tên addonDomains</Label>
        <Input type="number" id="addonDomains" placeholder="Tên addonDomains" v-model="form.addonDomains"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="subDomains">Tên subDomains</Label>
        <Input type="number" id="subDomains" placeholder="Tên subDomains" v-model="form.subDomains"/>
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
