<script setup lang="ts">
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import data from '@/assets/services.json';
import cartData from "@/assets/carts.json"
import { ref, h, onMounted } from 'vue';
import Badge from '@/components/ui/badge/Badge.vue';
import { useRoute } from 'vue-router';
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
const carts = ref(cartData);
const route = useRoute();
onMounted(() => {
  console.log(route.params.id);
  
})
const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'serviceId',
    header: 'Mã dịch vụ',
    enableSorting: false,
  },
  {
    accessorKey: 'serviceName',
    header: 'Tên dịch vụ',
    enableSorting: false,
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    enableSorting: false,
  },
  {
    accessorKey: 'price',
    header: 'Giá',
    enableSorting: false,
  },
  {
    accessorKey: 'serviceType',
    header: 'Loại dịch vụ',
    enableSorting: false,
    cell: ({row}) => row.original.serviceType.serviceTypeName
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

];
interface PAYLOAD {
  serviceId : string | number,
  serviceName : string | number,
  description :  string | number,
  price : string | number,
  serviceTypeId : string | undefined,
  status : string | undefined,
}
const form = ref<PAYLOAD>({
  serviceId : "",
  serviceName : "",
  description : "",
  price : 0,
  serviceTypeId : "",
  status : "",
  
})
const onSubmit = () => {
  
}
</script>
<template>
  <div>
    <page-header title="Chi tiết giỏ hàng"></page-header>
    <DataTable :columns="columns" :data="tasks" search="serviceName"></DataTable>
  </div>
</template>