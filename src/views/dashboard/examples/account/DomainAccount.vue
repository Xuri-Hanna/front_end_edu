<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/domainAccounts.json';
import { ref, h } from 'vue';
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
    header: 'Mã tài khoản domain',
    enableSorting: false,
  },
  {
    accessorKey: 'domainId',
    header: 'Mã domain',
    enableSorting: false,
  },
  {
    accessorKey: 'registerPanel',
    header: 'Register panel',
    enableSorting: false,
  },
  {
    accessorKey: 'username',
    header: 'Tên người dùng',
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
  Id :string | number,
  domainId : string | undefined,
  registerPanel : string | undefined,
  username : string | undefined,
  password : string | undefined,
  createdAt : any,
  updatedAt : any,
}
const form = ref<PAYLOAD>({
  Id : "",
  domainId : "",  
  registerPanel : "",
  username : "",
  password : "",
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
        <Label for="Id">Mã tài khoản hosting</Label>
        <Input type="text" id="Id" placeholder="Mã hóa đơn" v-model="form.Id"/>
      </div>
      <div class="grid gap-y-2">
        <Select v-model="form.domainId">
          <Label for="domainId">Gói domain</Label>
          <SelectTrigger>
            <SelectValue placeholder="Chọn domain" />
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
        <Label for="registerPanel">Register Panel</Label>
        <Input type="text" id="registerPanel" placeholder="Register panel" v-model="form.registerPanel"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="username">Tên người dùng</Label>
        <Input type="username" id="username" placeholder="Tên người dùng" v-model="form.username"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="password">Mật khẩu</Label>
        <Input type="password" id="password" placeholder="Mật khẩu" v-model="form.password"/>
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
      <Button type="submit">Thêm tài khoản domain</Button>
    </form>
    <DataTable :columns="columns" :data="tasks" search="Id"></DataTable>
  </div>
</template>
