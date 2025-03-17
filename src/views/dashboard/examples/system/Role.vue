<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/roles.json';
import { ref, h } from 'vue';
import {Input} from '@/components/ui/input';
import Label from '@/components/ui/label/Label.vue';
import Button from '@/components/ui/button/Button.vue';

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
    accessorKey: 'Id',
    header: 'Mã quyền',
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: 'Tên quyền',
    enableSorting: false,
  },
  {
    accessorKey: 'action',
    header: () => h('div', { class : 'text-center'},'Hành động'),
    enableSorting: false,
    cell: ({ row }) => h('div', {
      class: 'flex justify-center',
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
  name : string | number,
}
const form = ref<PAYLOAD>({
  Id : "",
  name : "",
})
const onSubmit = () => {
  
}
</script>
<template>
    <div>
      <page-header title="Quản lý quyền"></page-header>
      <form class="w-full grid grid-cols-2 mb-10 gap-5" @submit.prevent="onSubmit">
      <div class="grid gap-y-2">
        <Label for="roleId">Mã quyền</Label>
        <Input type="text" id="nvId" placeholder="Mã quyền" v-model="form.Id"/>
      </div>
      <div class="grid gap-y-2">
        <Label for="name">Tên quyền</Label>
        <Input type="text" id="name" placeholder="Tên quyền" v-model="form.name"/>
      </div>
      <Button type="submit">Thêm quyền</Button>
      </form>
      <DataTable :columns="columns" :data="tasks" search="name"></DataTable>
    </div>
</template>