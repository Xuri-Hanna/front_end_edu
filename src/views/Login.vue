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

// Validate form
const formSchema = toTypedSchema(z.object({
  username: z.string().min(1, { message: "Tài khoản không được để trống" }),
  password: z.string().min(1, { message: "Mật khẩu không được để trống" }),
}))

const form = useForm({
  validationSchema: formSchema,
})

const authStore = useAuthStore()

const onSubmit = form.handleSubmit(async (values) => {
  error.value = ''
  try {
    const response = await axios.post('http://localhost:8000/api/login', values)
    const data = response.data

    authStore.setAuthData({
      role: data.role,
      fullName: data.full_name
      // token: data.token  // nếu có
    })

    // localStorage.setItem('token', data.token)
    // localStorage.setItem('role', data.role) // CV01, CV02, CV03
    // localStorage.setItem('full_name', data.full_name)

    // Điều hướng dựa trên quyền
    if (data.role === 'CV01') {
      router.push('/admin/dashboard')
    } else if (data.role === 'CV02') {
      router.push('/staff/dashboard')
    } else if (data.role === 'CV03') {
      router.push('/teacher/dashboard')
    } else {
      error.value = 'Không xác định được quyền truy cập.'
    }


  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message
    } else {
      error.value = 'Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu.'
    }
  }
})
</script>

<template>
  <main class="h-screen w-screen flex items-center justify-center">
    <Card class="max-w-[320px] md:max-w-[400px] w-full">
      <CardHeader>
        <CardTitle class="text-center">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit">
          <!-- Username -->
          <FormField v-slot="{ componentField }" name="username">
            <FormItem class="mb-4">
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nhập tên đăng nhập" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Password -->
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nhập mật khẩu" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

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
