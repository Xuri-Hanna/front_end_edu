<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Lấy dữ liệu user và role từ localStorage khi component mount
//const username = ref('');
const role = ref('');
const fullname = ref('')

const roleLabels: Record<string, string> = {
  CV01: 'Trưởng Phòng',
  CV02: 'Nhân viên',
  CV03: 'Giáo viên',
};

onMounted(() => {
  fullname.value = localStorage.getItem('full_name') || 'Người dùng';
  role.value = localStorage.getItem('role') || '';
});

</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-2">
      Xin chào người dùng <span class="text-blue-600">{{ fullname }}</span>
    </h1>
    <p class="mb-6 text-gray-700">
      Bạn đang đăng nhập với quyền hạn
      <strong>{{ roleLabels[role] || 'Chưa xác định' }}</strong>
    </p>
  </div>
</template>