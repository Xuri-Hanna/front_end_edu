<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auths';
import { RouterLink } from 'vue-router';
import { computed, onMounted } from 'vue';

const authStore = useAuthStore();

// Nếu reload trang mà store trống → lấy từ localStorage
onMounted(() => {
  if (!authStore.role) {
    authStore.role = localStorage.getItem('role');
  }
});

// Xác định đường dẫn home theo role
const homePath = computed(() => {
  switch (authStore.role) {
    case 'CV001': return '/admin/dashboard';
    case 'CV002': return '/staff/dashboard';
    case 'CV003': return '/teacher/dashboard';
    default:     return '/login'; // fallback nếu chưa đăng nhập
  }
});
</script>

<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <div class="w-1/2 flex flex-col items-center">
      <h2 class="font-bold text-8xl text-center">404</h2>
      <h3 class="font-medium text-2xl text-center my-2">Not Found</h3>
      <p class="text-center text-foreground/30 text-sm">The page you're trying to access <br/> could not be found</p>
      <RouterLink :to="homePath">
        <Button class="mt-4" variant="outline" prepend-icon="ArrowLeft">Back to Home</Button>
      </RouterLink>
    </div>
  </div>
</template>