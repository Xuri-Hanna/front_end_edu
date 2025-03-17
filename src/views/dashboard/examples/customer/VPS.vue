<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/vps.json';
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
    accessorKey: 'vpsId',
    header: 'Mã vps',
    enableSorting: false,
  },
  {
    accessorKey: 'fullName',
    header:'Tên người dùng',
    enableSorting: false,
    cell : ({row}) => row.original.customer.fullName
  },
  {
    accessorKey: 'plan',
    header: 'Gói VPS',
    enableSorting: false,
  },
  {
    accessorKey: 'cpu',
    header: 'CPU',
    enableSorting: false,
  },
  {
    accessorKey: 'ram',
    header: 'RAM',
    enableSorting: false,
  },
  {
    accessorKey: 'storage',
    header: 'Dung lượng',
    enableSorting: false,
  },
  {
    accessorKey: 'bandwidth',
    header: 'Băng thông',
    enableSorting: false,
  },
  {
    accessorKey: 'os',
    header: 'Os',
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
  userId : string | undefined,
  plan : string | undefined,
  cpu : string | undefined,
  ram : string | undefined,
  storage : string | undefined,
  bandwidth : string | undefined,
  os : string | undefined,
  status : string | undefined,
  createdAt : any,
  updatedAt : any,
}
const form = ref<PAYLOAD>({
  Id : "",  
  userId : "",
  plan : "",
  cpu : "",
  ram : "",
  storage : "",
  bandwidth : "",
  os : "",
  status : "",
  createdAt : "",
  updatedAt : "",
  
})
const onSubmit = () => {
  
}
</script>

<template>
  <div>
    <page-header title="Quản lí VPS"></page-header>
    
    <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="vpsId">Mã VPS</Label>
        <Input type="text" id="vpsId" placeholder="Mã hóa đơn" v-model="form.Id"/>
      </div>
      <div class="grid gap-y-2">
        <Select v-model="form.plan">
          <Label for="plan">Gói dịch vụ</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn gói dịch vụ" />
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
        <Select v-model="form.ram">
          <Label for="ram">Loại ram</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn ram" />
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
        <Select v-model="form.cpu">
          <Label for="cpu">Loại cpu</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn cpu" />
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
        <Label for="storage">Sức chứa</Label>
        <Input type="text" id="storage" placeholder="Sức chứa" v-model="form.storage"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="bandwidth">Băng thông</Label>
        <Input type="text" id="bandwidth" placeholder="Băng thông" v-model="form.bandwidth"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="os">Os</Label>
        <Input type="text" id="os" placeholder="Os" v-model="form.os"/>
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
      <div></div>
      <Button type="submit">Thêm VPS</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="vpsId"></DataTable>
  </div>
</template>
