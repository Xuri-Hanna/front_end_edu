<script setup lang="ts">
import GlobalSearchPopover from '@/components/core/GlobalSearchPopover.vue';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Breadcrumb from '@/components/ui/Breadcrumb.vue';
import {
  LogOut,
  User,
  Bell,
  Sun,
  MoonStar,
  Menu,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'


const store = useAppStore();
const fullname = ref('')
const role = ref('')
const router = useRouter()

// Map mã chức vụ sang tên hiển thị
const roleLabels: Record<string, string> = {
  CV01: 'Trưởng phòng',
  CV02: 'Nhân viên',
  CV03: 'Giáo viên'
}

onMounted(() => {
  fullname.value = localStorage.getItem('full_name') || 'Người dùng'
  role.value = localStorage.getItem('role') || ''
})

const toggleMode = () => {
  store.toggleTheme();
};

const handleLogout = async () => {
  try {
    await axios.post('http://localhost:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  } catch (error) {
    console.error('Lỗi khi gọi API logout:', error)
  } finally {
    // Xóa dữ liệu lưu trữ
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('full_name')

    // Điều hướng về trang login
    router.push('/login')
  }
}

// === ĐỔI MẬT KHẨU ===
const showPasswordForm = ref(false)
const passwordForm = ref({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

const showPassword = ref({
  old: false,
  new: false,
  confirm: false
})

const errors = ref<Record<string, string>>({})
const successMessage = ref('')

const submitPasswordChange = async () => {
  errors.value = {}
  successMessage.value = ''

  if (!passwordForm.value.old_password) {
    errors.value.old_password = 'Vui lòng nhập mật khẩu hiện tại'
    return
  }
  if (!passwordForm.value.new_password) {
    errors.value.new_password = 'Vui lòng nhập mật khẩu mới'
    return
  }
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    errors.value.confirm_password = 'Xác nhận mật khẩu không khớp'
    return
  }

  try {
    await axios.post('http://localhost:8000/api/change-password', {
      username: localStorage.getItem("username"),
      old_password: passwordForm.value.old_password,
      new_password: passwordForm.value.new_password,
      confirm_password: passwordForm.value.confirm_password,
    })
    successMessage.value = 'Đổi mật khẩu thành công!'
    passwordForm.value = { old_password: '', new_password: '', confirm_password: '' }
    setTimeout(() => {
      showPasswordForm.value = false
      successMessage.value = ''
    }, 1500)
  } catch (error) {
    errors.value.old_password = 'Mật khẩu hiện tại không đúng'
  }
}

const closePasswordForm = () => {
  showPasswordForm.value = false
  passwordForm.value = { old_password: '', new_password: '', confirm_password: '' }
  errors.value = {}
  successMessage.value = ''
}


</script>

<template>
  <nav class="flex items-center justify-between h-[64px] border-b-[1px] px-4 fixed z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border" :style="{ width: store.navWidth }">
    <div class="w-24 hidden lg:block">
      <Breadcrumb />
    </div>
    <!-- <div class="w-2/5 hidden lg:block">
      <GlobalSearchPopover />
    </div> -->
    <Button
      variant="outline"
      class="p-[6px] w-8 h-8 transition-all duration-200 block lg:hidden"
      :class="store.sidebarExpanded ? 'bg-transparent' : 'dark:bg-white'"
      @click="store.toggleSidebar()"
    >
      <Menu class="transition-all duration-500 text-black" />
    </Button>
    <div class="flex items-center">
      <!-- <Button variant="outline" class="border-0 p-[6px] w-8 h-8">
        <Bell />
      </Button> -->
      <Button variant="outline" class="border-0 p-[6px] ml-2 w-8 h-8" @click="toggleMode">
        <Sun v-if="store.isDark" />
        <MoonStar v-else />
      </Button>
      <div class="border-x-[1px] border-gray-300 h-[24px] w-[1px] mx-2"></div>


      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="border-0 flex items-center max-w-[200px] w-full justify-start">
            <Avatar class="h-8 w-8">
              <AvatarImage src="https://github.com/radix-vue.png"></AvatarImage>
            </Avatar>
            <span class="ml-2 hidden md:flex justify-start flex-col items-start">
              <p class="mb-0">{{ fullname }}</p>
              <small class="text-xs text-slate-400 font-light">{{ roleLabels[role] || 'Chưa xác định' }}</small>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56 relative mr-4">
          <DropdownMenuLabel>{{ fullname }}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="showPasswordForm = true">
            <User class="mr-2 h-4 w-4" />
            <span>Đổi mật khẩu</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout">
            <LogOut class="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
            <!-- <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> -->
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </nav>

  <!-- FORM ĐỔI MẬT KHẨU -->
  <transition name="slide-down">
    <div v-if="showPasswordForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg w-1/3 mt-20 p-6">
        <h2 class="text-lg font-bold mb-4">Đổi mật khẩu</h2>
        <form @submit.prevent="submitPasswordChange" class="grid gap-4 mb-6">

          <div class="grid gap-y-2">
            <label>Mật khẩu hiện tại</label>
              <div class="relative">
                <Input :type="showPassword.old ? 'text' : 'password'" v-model="passwordForm.old_password" class="border border-gray-300 rounded-md px-2 py-1 w-full"/>
                <button
                  type="button"
                  class="absolute right-2 top-2 text-gray-500"
                  @click="showPassword.old = !showPassword.old"
                >
                  <Eye v-if="!showPassword.old" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            <small v-if="errors.old_password" class="text-red-500">{{ errors.old_password }}</small>
          </div>

          <div class="grid gap-y-2">
            <label>Mật khẩu mới</label>
              <div  class="relative">
                <Input :type="showPassword.new ? 'text' : 'password'" v-model="passwordForm.new_password" class="border border-gray-300 rounded-md px-2 py-1 w-full"/>
                <button
                  type="button"
                  class="absolute right-2 top-2 text-gray-500"
                  @click="showPassword.new = !showPassword.new"
                >
                  <Eye v-if="!showPassword.new" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            <small v-if="errors.new_password" class="text-red-500">{{ errors.new_password }}</small>
          </div>

          <div class="grid gap-y-2">
            <label>Xác nhận mật khẩu</label>
               <div  class="relative">
                <Input :type="showPassword.confirm ? 'text' : 'password'" v-model="passwordForm.confirm_password" class="border border-gray-300 rounded-md px-2 py-1 w-full"/>
                <button
                  type="button"
                  class="absolute right-2 top-2 text-gray-500"
                  @click="showPassword.confirm = !showPassword.confirm"
                >
                  <Eye v-if="!showPassword.confirm" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </button>
              </div>
            <small v-if="errors.confirm_password" class="text-red-500">{{ errors.confirm_password }}</small>
          </div>
          <div class="flex gap-2 mt-2">
            <Button type="submit">Xác nhận</Button>
            <Button type="button" variant="outline" @click="closePasswordForm">Đóng</Button>
          </div>
        </form>
        <div v-if="successMessage" class="mb-4 text-green-600 font-semibold">
          {{ successMessage }}
        </div>
      </div>
    </div>
  </transition>

</template>
