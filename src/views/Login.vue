<script setup lang="ts">

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormLabel, FormItem, FormMessage } from '@/components/ui/form'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auths'

import axios from 'axios'
import { ref } from 'vue'

const router = useRouter()
const error = ref('')
const authStore = useAuthStore()

// State
const username = ref('')
const password = ref('')
const errors = ref<{ username?: string; password?: string }>({})

const onSubmit = async () => {
  // Reset lỗi
  errors.value = {}
  error.value = ''

  // Validate thủ công
  if (!username.value) {
    errors.value.username = 'Tài khoản không được để trống'
  }
  if (!password.value) {
    errors.value.password = 'Mật khẩu không được để trống'
  }

  // Nếu không có lỗi -> gọi API
  if (Object.keys(errors.value).length === 0) {
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        username: username.value,
        password: password.value,
      })
      const data = response.data

      authStore.setAuthData({
        role: data.role,
        fullName: data.full_name,
        id: data.id,
      })

      localStorage.setItem('username', username.value)

      if (data.role === 'CV001') {
        router.push('/admin/dashboard')
      } else if (data.role === 'CV002') {
        router.push('/staff/dashboard')
      } else if (data.role === 'CV003') {
        router.push('/teacher/dashboard')
      } else {
        error.value = 'Không xác định được quyền truy cập.'
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else {
        error.value = 'Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu.'
      }
    }
  }
}


</script>

<template>
  <main class="h-screen w-screen flex items-center justify-center">
    <Card class="max-w-[320px] md:max-w-[400px] w-full">
      <CardHeader>
        <CardTitle class="text-center">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit" novalidate>

          <!-- Username -->
          <div class="mb-4">
            <label class="block mb-1">Tên đăng nhập</label>
            <Input v-model="username" type="text" placeholder="Nhập tên đăng nhập" />
            <p v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</p>
          </div>

          <!-- Password -->
          <div class="mb-4">
            <label class="block mb-1">Mật khẩu</label>
            <Input v-model="password" type="password" placeholder="Nhập mật khẩu" />
            <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
          </div>

          <!-- Hiển thị lỗi -->
          <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>

          <!-- Nút đăng nhập -->
          <Button class="w-full mt-4" type="submit">Đăng nhập</Button>
        </form>
      </CardContent>
      <!-- <CardFooter class="flex flex-col items-end">
        <RouterLink
          to="forgot-password"
          class="text-sm text-blue-600 hover:text-blue-800 hover:underline transition duration-200"
        >
          Quên mật khẩu?
        </RouterLink>
      </CardFooter> -->
    </Card>
  </main>
</template>
