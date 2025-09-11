<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale
} from 'chart.js'
import html2pdf from "html2pdf.js"
import html2canvas from "html2canvas"



ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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

const showReport = ref(false)

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
// Doanh thu 12 tháng
const doanhThuThang = ref<any[]>([])

const fetchDoanhThuThang = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/doanh_thu_hoc_phi_theo_thang', {
      params: { year: new Date().getFullYear() }
    })
    doanhThuThang.value = res.data
  } catch (e) {
    console.error('Lỗi fetch doanh thu theo tháng:', e)
  }
}

//Đổi màu cột ở đây
const chartData = computed(() => ({
  labels: doanhThuThang.value.map(item => item.thang),
  datasets: [
    {
      label: 'Doanh thu',
      data: doanhThuThang.value.map(item => item.doanh_thu),
      backgroundColor: '#4f46e5'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const chartWrapper = ref<HTMLDivElement | null>(null)

const downloadChart = async () => {
  if (!chartWrapper.value) return

  const canvas = await html2canvas(chartWrapper.value, { scale: 2 })
  const link = document.createElement("a")
  link.download = "doanh_thu_hoc_phi.png"
  link.href = canvas.toDataURL("image/png")
  link.click()

}
const reportRef = ref<HTMLDivElement | null>(null)

const downloadPDF = () => {
  if (!reportRef.value) return

  const opt = {
    margin:       0.5,
    filename:     'bao_cao_thong_ke.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(reportRef.value).save()
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
  fetchDoanhThuThang()
})
</script>

<template>
  <div>
    <page-header title="Báo cáo trung tâm">
      <div class="flex items-center space-x-2">
        <input type="date" v-model="startDate" class="border rounded px-2 py-1" />
        <input type="date" v-model="endDate" class="border rounded px-2 py-1" />
        <Button @click="fetchDuLieu" variant="secondary">Cập nhật</Button>

        <Button @click="showReport = true" variant="secondary">Tải xuống</Button>
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
                    <td class="p-1">{{ mon.mon}} - {{ mon.khoi }} </td>
                    <td class="p-1">{{ mon.so_lop }}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card class="col-span-1">
            <CardHeader>
              <div class="flex justify-between items-center w-full">
                <CardTitle class="!text-left">Doanh thu học phí theo tháng</CardTitle>
                <Button @click="downloadChart" size="sm" variant="secondary">
                  Tải PNG
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div ref="chartWrapper">
                <div class="h-[300px]" >
                  <Bar
                    :data="{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: 'Doanh thu (VNĐ)',
                          data: chartData.datasets[0].data,
                          backgroundColor: 'rgba(34, 197, 94, 0.6)'
                        }
                      ]
                    }"
                    :options="{ responsive: true, plugins: { legend: { position: 'top' } }, maintainAspectRatio: false }"
                  />
                </div>
                <!-- Phần bảng số liệu theo tháng -->
                <div class="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div
                    v-for="(value, index) in chartData.datasets[0].data"
                    :key="index"
                    class="text-left"
                  >
                    <span class="font-semibold">Tháng {{ index + 1 }}:</span>
                    {{ new Intl.NumberFormat('vi-VN').format(value) }} đ
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </TabsContent>
    </Tabs>
  </div>
  <!-- Popup -->
  <div v-if="showReport" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto p-4">
        <!-- Header -->
        <div class="flex justify-between items-center border-b pb-2 mb-4">
          <h2 class="text-lg font-bold">Báo cáo doanh thu</h2>
          <button @click="showReport = false" class="text-gray-600 hover:text-black">✕</button>
        </div>
      <div ref="reportRef" class="p-4">
      <!-- Tiêu đề -->
      <h2 class="text-center text-xl font-bold mb-2">
        Báo cáo doanh thu học phí
      </h2>
      <p class="text-center mb-4">
        Từ ngày: {{ startDate }} &nbsp;&nbsp; đến ngày: {{ endDate }}
      </p>

      <!-- Doanh thu, học sinh, trạng thái -->
      <p><span class="font-bold text-red-600">Doanh thu:</span> {{ tongDoanhThu.toLocaleString() }} VNĐ</p>
      <p><span class="font-bold">Số học sinh:</span> {{ soHocSinh }}</p>

      <p class="mt-2 font-bold">Trạng thái lớp học:</p>
      <ul>
        <li v-for="(item, index) in lopHocStatus" :key="index">
          {{ item.name }}: <span class="font-bold">{{ item.value }}</span>
        </li>
      </ul>

      <!-- Bảng giáo viên -->
      <p class="mt-4 mb-2 font-bold">Số lớp của giáo viên:</p>
      <table class="w-full border-collapse border mb-6">
        <thead>
          <tr>
            <th class="border p-1">STT</th>
            <th class="border p-1">Tên giáo viên</th>
            <th class="border p-1">Số lớp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(gv, index) in topGiaoVien" :key="gv.id">
            <td class="border p-1">{{ index + 1 }}</td>
            <td class="border p-1">{{ gv.ten }}</td>
            <td class="border p-1">{{ gv.so_lop }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Bảng môn học -->
      <p class="mt-4 mb-2 font-bold">Số lớp của các lớp học:</p>
      <table class="w-full border-collapse border mb-6">
        <thead>
          <tr>
            <th class="border p-1">STT</th>
            <th class="border p-1">Môn học</th>
            <th class="border p-1">Số lớp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mon, index) in topMonHoc" :key="mon.id">
            <td class="border p-1">{{ index + 1 }}</td>
            <td class="border p-1">{{ mon.mon }}</td>
            <td class="border p-1">{{ mon.so_lop }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Biểu đồ -->
      <p class="mt-4 font-bold">Doanh thu học phí theo tháng:</p>
      <div class ="page-break-avoid">
        <div class="h-[300px]" ref="chartRef">
          <Bar
            :data="chartData"
            :options="chartOptions"
          />
        </div>
      </div>
      <!-- Bảng số liệu theo tháng -->
      <div class ="page-break-avoid">
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div
            v-for="(item, index) in doanhThuThang"
            :key="index"
            class="text-left"
          >
            <span class="font-semibold">Tháng {{ item.thang }}:</span>
            {{ new Intl.NumberFormat('vi-VN').format(item.doanh_thu) }} đ
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <div class="mt-4 flex justify-end space-x-2">
      <Button @click="downloadPDF" variant="secondary">In PDF</Button>
      <Button @click="showReport = false" variant="destructive">Đóng</Button>
    </div>
  </div>
</div>
</template>


