<script setup lang="ts">
import { ref, onMounted } from 'vue';

// import { useAuthStore } from '@/stores/auths'
// const authStore = useAuthStore()


// Lấy dữ liệu user và role từ localStorage khi component mount
//const username = ref('');
const role = ref('');
const fullname = ref('')

const roleLabels: Record<string, string> = {
  CV001: 'Trưởng Phòng',
  CV002: 'Nhân viên',
  CV003: 'Giáo viên',
};

onMounted(() => {
  fullname.value = localStorage.getItem('full_name') || 'Người dùng';
  role.value = localStorage.getItem('role') || '';
});

</script>

<!-- <template>
  <div>
    <h1 class="text-lg font-bold mb-2">
      Xin chào người dùng <span class="text-blue-600">{{ fullname }}</span>
    </h1>
    <p class="mb-6 text-gray-700">
      Bạn đang đăng nhập với quyền hạn
      <strong>{{ roleLabels[role] || 'Chưa xác định' }}</strong>
    </p>
  </div>
</template> -->

<template>
  <!-- <p>Xin chào {{ authStore.fullName }} (ID: {{ authStore.userId }})</p> -->
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
     
      <!-- Lời chào -->
      <h1 class="text-2xl font-extrabold mb-2">
        Xin chào, <span class="text-blue-600">{{ fullname }}</span>
      </h1>

      <!-- Quyền hạn -->
      <p class="mb-6 text-gray-600">
        Bạn đang đăng nhập với quyền hạn:
      </p>
      <div
        class="inline-block px-4 py-2 rounded-full text-white font-semibold"
        :class="{
          'bg-purple-600': role === 'CV001',
          'bg-green-600': role === 'CV002',
          'bg-orange-500': role === 'CV003',
          'bg-gray-500': !role
        }"
      >
        {{ roleLabels[role] || 'Chưa xác định' }}
      </div>
    </div>
  </div>
</template>