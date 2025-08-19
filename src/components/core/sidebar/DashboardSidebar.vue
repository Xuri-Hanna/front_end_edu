<script setup lang="ts">
import { computed } from 'vue';
import SidebarInner from './SidebarInner.vue';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auths'
import { getMenuByRole } from '@/config/app'

// const props = defineProps<{
//   menu: Record<string, any>
// }>();

const store = useAppStore();
const authStore = useAuthStore()

// const menu = computed(() => getMenuByRole(authStore.role))

const menu = computed(() => {
  if (!authStore.role) return {};
  return getMenuByRole(authStore.role);
});

const isVisible = computed(() => window.innerWidth < 1025);


</script>

<template>
  <div >
    <SidebarInner  :menu="menu"  class="hidden lg:block" />
    <Sheet v-if="isVisible" :open="store.sidebarExpanded" class="block lg:hidden">
      <SheetContent class="p-0" side="left" style="width: 280px" :show-close="false" @interact-outside="store.toggleSidebar()">
        <SidebarInner :menu="menu"  style="width: 280px;" />
      </SheetContent>
    </Sheet>
  </div>
</template>