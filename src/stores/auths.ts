
// src/stores/auths.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const role = ref<string | null>(localStorage.getItem('role'))
  const fullName = ref<string | null>(localStorage.getItem('full_name'))
  const userId = ref<string | null>(localStorage.getItem('user_id'))

  function setAuthData(payload: { token?: string; role?: string; fullName?: string; id?: string }) {
    if (payload.token) {
      token.value = payload.token
      localStorage.setItem('token', payload.token)
    }
    if (payload.role) {
      role.value = payload.role
      localStorage.setItem('role', payload.role)
    }
    if (payload.fullName) {
      fullName.value = payload.fullName
      localStorage.setItem('full_name', payload.fullName)
    }
    if (payload.id) {
      userId.value = payload.id
      localStorage.setItem('user_id', payload.id)
    }
  }

  function clearAuthData() {
    token.value = null
    role.value = null
    fullName.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('full_name')
    localStorage.removeItem('user_id')
  }

  return {
    token,
    role,
    fullName,
    userId,
    setAuthData,
    clearAuthData
  }
})
