<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'

// Ngày mặc định
const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)

const getDefaultDates = () => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  startDate.value = firstDay.toISOString().split('T')[0]
  endDate.value = lastDay.toISOString().split('T')[0]
}

// --- Dữ liệu báo cáo ---
const tongDoanhThu = ref<number>(0)
const soHocSinh = ref<number>(0)
const lopHocStatus = ref<any[]>([])

const topGiaoVien = ref<any[]>([])
const topMonHoc = ref<any[]>([])

// --- Fetch API ---
const fetchDoanhthu = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/doanh_thu_hoc_phi', {
      params: { start_date: startDate.value, end_date: endDate.value }
    })
    tongDoanhThu.value = res.data.doanh_thu_vn
  } catch (e) {
    console.error('Lỗi fetch báo cáo chung:', e)
  }
}
const fetchSoHocSinh = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/so_hoc_sinh')
    soHocSinh.value = res.data.so_luong_hoc_sinh;
  } catch (e) {
    console.error('Lỗi fetch báo cáo chung:', e)
  }
}
const fetchLopHocStatus = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/lop_hoc_status')
    const data = res.data
    // Chuyển object thành array [{name: "Đang học", value: 12}, ...]
    lopHocStatus.value = Object.keys(data).map(key => ({
      name: key,
      value: data[key]
    }))
  } catch (e) {
    console.error('Lỗi fetch trạng thái lớp học:', e)
  }
}
const fetchTopGiaoVien = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/top_giao_vien', {
      params: { start_date: startDate.value, end_date: endDate.value }
    })
    topGiaoVien.value = res.data
  } catch (e) {
    console.error('Lỗi fetch báo cáo chung:', e)
  }
}
const fetchTopMonHoc = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/top_mon_hoc', {
      params: { start_date: startDate.value, end_date: endDate.value }
    })
    topMonHoc.value = res.data
  } catch (e) {
    console.error('Lỗi fetch báo cáo chung:', e)
  }
}

const fetchDuLieu = () => {
  fetchDoanhthu()
  fetchSoHocSinh()
  fetchTopGiaoVien()
  fetchTopMonHoc()
}

// --- Mounted ---
onMounted(() => {
  getDefaultDates()
  fetchDuLieu()
  fetchLopHocStatus()
})
</script>

<template>
  <div>
    <page-header title="Báo cáo trung tâm">
      <div class="flex items-center space-x-2">
        <input type="date" v-model="startDate" class="border rounded px-2 py-1" />
        <input type="date" v-model="endDate" class="border rounded px-2 py-1" />
        <Button @click="fetchDuLieu" variant="secondary">Cập nhật</Button>
      </div>
    </page-header>

    <Tabs default-value="overview" class="space-y-4">
      <TabsContent value="overview" class="space-y-4">
        <!-- Báo cáo chung -->
        <div class="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Doanh thu
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ tongDoanhThu }}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Số học sinh
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ soHocSinh }} học sinh</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Trạng thái lớp học
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="(item, index) in lopHocStatus" :key="index" class="flex justify-between px-2 py-1 border rounded">
                  <span>{{ item.name }}</span>
                  <span class="font-bold">{{ item.value }}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <!-- Báo cáo giáo viên -->
        <div class="grid gap-4 md:grid-cols-2 mt-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Số lớp của giáo viên
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <table class="w-full text-left">
                <thead>
                  <tr>
                    <th class="p-1">STT</th>
                    <th class="p-1">Tên giáo viên</th>
                    <th class="p-1">Số lớp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(gv, index) in topGiaoVien" :key="gv.id">
                    <td class="p-1">{{ index + 1 }}</td>
                    <td class="p-1">{{ gv.ten }}</td>
                    <td class="p-1">{{ gv.so_lop }}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Số lớp của các môn học
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                class="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <table class="w-full text-left">
                <thead>
                  <tr>
                    <th class="p-1">STT</th>
                    <th class="p-1">Môn học</th>
                    <th class="p-1">Số lớp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(mon, index) in topMonHoc" :key="mon.id">
                    <td class="p-1">{{ index + 1 }}</td>
                    <td class="p-1">{{ mon.mon}}</td>
                    <td class="p-1">{{ mon.so_lop }}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
