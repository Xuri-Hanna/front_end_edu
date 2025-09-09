<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Pie, Bar } from "vue-chartjs"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  BarElement,
  LinearScale
} from "chart.js"
import html2pdf from "html2pdf.js"
import html2canvas from "html2canvas"

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement, LinearScale)

// reactive lưu ngày bắt đầu và ngày kết thúc
const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)

// Hàm tính ngày đầu tháng và cuối tháng
const getDefaultDates = () => {
  const today = new Date()

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1)

  startDate.value = firstDay.toISOString().split('T')[0]
  endDate.value = lastDay.toISOString().split('T')[0]
}

// reactive lưu dữ liệu thống kê
const tongThuNhap = ref<number>(0)
const tongPhieuThue = ref<number>(0)
const soKhachMoi = ref<number>(0)
const soHopDong = ref<number>(0)

// === State mới ===
const topNhanVien = ref<any[]>([])
const hopDongStatusData = ref<any[]>([])
const topPhong = ref<any[]>([])

const fetchThuNhap = async () => {
  if (!startDate.value || !endDate.value) {
    alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc")
    return
  }

  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/tong_thu_nhaps', {
    params: {
      start_date: startDate.value,
      end_date: endDate.value,
    },
  })
    tongThuNhap.value = res.data.tong_thu_nhap_vn
  } catch (error) {
    console.error('Lỗi khi fetch thu nhập:', error)
    alert("Có lỗi xảy ra khi gọi API")
  }
}
const fetchPhieuThue = async () => {
  if (!startDate.value || !endDate.value) {
    alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc")
    return
  }

  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/phieu_thues', {
    params: {
      start_date: startDate.value,
      end_date: endDate.value,
    },
  })
    tongPhieuThue.value = res.data.so_phieu_thue;
  } catch (error) {
    console.error('Lỗi khi fetch thu nhập:', error)
    alert("Có lỗi xảy ra khi gọi API")
  }
}
const fetchKhachMoi = async () => {
  if (!startDate.value || !endDate.value) {
    alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc")
    return
  }

  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/khach_mois', {
    params: {
      start_date: startDate.value,
      end_date: endDate.value,
    },
  })
    soKhachMoi.value = res.data.so_khach_moi;
  } catch (error) {
    console.error('Lỗi khi fetch thu nhập:', error)
    alert("Có lỗi xảy ra khi gọi API")
  }
}
const fetchHopDong = async () => {
  if (!startDate.value || !endDate.value) {
    alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc")
    return
  }

  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/hop_dongs', {
    params: {
      start_date: startDate.value,
      end_date: endDate.value,
    },
  })
    soHopDong.value = res.data.so_hop_dong;
  } catch (error) {
    console.error('Lỗi khi fetch thu nhập:', error)
    alert("Có lỗi xảy ra khi gọi API")
  }
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
const fetchDuLieu = async () =>{
  fetchPhieuThue();
  fetchThuNhap();
  fetchKhachMoi();
  fetchHopDong();
  fetchTopPhong();
  fetchTopNhanVien();
  fetchDoanhthu()
  fetchSoHocSinh()
  fetchTopGiaoVien()
  fetchTopMonHoc()
}

// === Fetch API mới ===
const fetchTopNhanVien = async () => {
  try {
      const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/top_nhan_vien_hop_dong', {
    params: {
      start_date: startDate.value,
      end_date: endDate.value,
    },
  });
      topNhanVien.value = res.data;
      console.log('Top nhân viên:', topNhanVien.value);
    } catch (e) {
      console.error("Lỗi fetch top nhân viên:", e);
    }
}

const fetchHopDongStatus = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/hop_dong_status')
    const raw = res.data.data
    hopDongStatusData.value = Object.keys(raw).map(key => ({
      name: key,
      value: raw[key]
    }))
    console.log('Trạng thái hợp đồng:', hopDongStatusData.value)
  } catch (e) {
    console.error("Lỗi fetch trạng thái hợp đồng:", e)
  }
}


const fetchTopPhong = async () => {
    try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/top_phong', {
    params: {
      start_date: startDate.value,
      end_date: endDate.value,
    },
  });
    topPhong.value = res.data;
  } catch (e) {
    console.error("Lỗi fetch top phòng:", e);
  }
}

const doanhThuThuePhong = ref<any[]>([])

const fetchDoanhThuThuePhong = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/thong_ke/doanh_thu_thue_phong_theo_thang', {
      params: { year: new Date().getFullYear() }
    })
    doanhThuThuePhong.value = res.data
  } catch (e) {
    console.error("Lỗi fetch doanh thu thuê phòng:", e)
  }
}

const chartRef = ref<HTMLDivElement | null>(null)

const downloadChart = async () => {
  if (!chartRef.value) return

  const el = chartRef.value.querySelector("canvas") // chỉ cần lấy thẳng canvas
  if (!el) {
    console.error("Không tìm thấy canvas của biểu đồ")
    return
  }

  const canvas = await html2canvas(el, { scale: 2 })
  const link = document.createElement("a")
  link.download = "doanh_thu_thue_phong.png"
  link.href = canvas.toDataURL("image/png")
  link.click()
}
//Đổi màu cột ở đây
const chartDataThuePhong = computed(() => ({
  labels: doanhThuThuePhong.value.map(item => item.thang),
  datasets: [
    {
      label: 'Doanh thu thuê phòng',
      data: doanhThuThuePhong.value.map(item => item.doanh_thu),
      backgroundColor: '#f97316'
    }
  ]
}))

const chartOptionsThuePhong = {
  responsive: true,
  maintainAspectRatio: false
}

const showReport = ref(false)
const reportRef = ref<HTMLDivElement | null>(null)

const downloadPDF = () => {
  if (!reportRef.value) return

  const opt = {
    margin:       0.5,
    filename:     'bao_cao_thue_phong.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(reportRef.value).save()
}



// Khi component mount -> set ngày mặc định + fetch dữ liệu luôn
onMounted(() => {
  getDefaultDates()
  fetchDuLieu();
  fetchHopDongStatus();
  fetchLopHocStatus()
  fetchDoanhThuThuePhong()
})
</script>

<template>
  <div>
    <page-header title="Báo cáo thống kê">
      <div class="flex items-center space-x-2">
        <!-- Input chọn ngày bắt đầu -->
        <input
          type="date"
          v-model="startDate"
          class="border rounded px-2 py-1"
        />

        <!-- Input chọn ngày kết thúc -->
        <input
          type="date"
          v-model="endDate"
          class="border rounded px-2 py-1"
        />

        <!-- Nút kiểm tra -->
        <Button @click="fetchDuLieu" variant="secondary">Kiểm tra</Button>

        <!-- Nút tải xuống (tạm thời chưa làm gì) -->
        <Button @click="showReport = true" variant="secondary">Tải xuống</Button>
      </div>
    </page-header>

    <Tabs default-value="overview" class="space-y-4">
      <TabsContent value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <div class="text-2xl font-bold">
               {{ tongThuNhap}}
              </div>
              <p class="text-xs text-muted-foreground">
                --------
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Khách hàng thuê phòng
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                + {{ soKhachMoi }}
              </div>
              <p class="text-xs text-muted-foreground">
                ---------------
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Số phiếu thuê phòng đã lập
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
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                {{ tongPhieuThue }} Phiếu thuê
              </div>
              <p class="text-xs text-muted-foreground">
                ------------
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Hợp đồng đã ký kết
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
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">
                +{{ soHopDong }}
              </div>
              <p class="text-xs text-muted-foreground">
                +10 so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>
         <!-- Grid biểu đồ và danh sách -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <!-- Biểu đồ trạng thái hợp đồng -->
         <Card class="col-span-3">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Trạng thái hợp đồng
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
              <div v-for="(item, index) in hopDongStatusData" :key="index" class="flex justify-between px-2 py-1 border rounded">
                <span>{{ item.name }}</span>
                <span class="font-bold">{{ item.value }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
          <!-- Top nhân viên -->
          <Card class="col-span-2">
           <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Thứ hạng nhân viên
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
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b">
                    <th class="px-2 py-1">STT</th>
                    <th class="px-2 py-1">Nhân viên</th>
                    <th class="px-2 py-1">Số hợp đồng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(nv, index) in topNhanVien" :key="nv.id" class="border-b">
                    <td class="px-2 py-1">{{ index + 1 }}</td>
                    <td class="px-2 py-1">{{ nv.ho_ten }}</td>
                    <td class="px-2 py-1 font-bold">{{ nv.so_phieu_thue }}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          <!-- Top phòng -->
             <Card class="col-span-2">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Lượt thuê phòng
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
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b">
                    <th class="px-2 py-1">STT</th>
                    <th class="px-2 py-1">Phòng học</th>
                    <th class="px-2 py-1">Số lượng thuê</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(ph, index) in topPhong" :key="ph.id" class="border-b">
                    <td class="px-2 py-1">{{ index + 1 }}</td>
                    <td class="px-2 py-1">{{ ph.so_phong }}</td>
                    <td class="px-2 py-1 font-bold">{{ ph.so_phieu_thue }}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card class="col-span-4">
            <CardHeader>
              <div class="flex justify-between items-center w-full">
                <CardTitle class="!text-left">Doanh thu thuê phòng theo tháng</CardTitle>
                <Button @click="downloadChart" size="sm" variant="secondary">
                  Tải PNG
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div class="h-[300px]" ref="chartRef">
                <Bar
                  :data="{
                    labels: doanhThuThuePhong.map(item => item.thang),
                    datasets: [
                      {
                        label: 'Doanh thu (VNĐ)',
                        data: doanhThuThuePhong.map(item => item.doanh_thu),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)'
                      }
                    ]
                  }"
                  :options="{ responsive: true, plugins: { legend: { position: 'top' } } }"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
      </TabsContent>
    </Tabs>

    <!-- Popup báo cáo -->
    <div v-if="showReport" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto p-4">
        <!-- Header -->
        <div class="flex justify-between items-center border-b pb-2 mb-4">
          <h2 class="text-lg font-bold">Báo cáo doanh thu thuê phòng học</h2>
          <button @click="showReport = false" class="text-gray-600 hover:text-black">✕</button>
        </div>

        <!-- Nội dung cần in -->
        <div ref="reportRef" class="p-4">
          <h2 class="text-center text-xl font-bold mb-2">Báo cáo thuê phòng</h2>
          <p class="text-center mb-4">
            Từ ngày: {{ startDate }} &nbsp;&nbsp; đến ngày: {{ endDate }}
          </p>

          <p><span class="font-bold text-red-600">Tổng thu nhập:</span> {{ tongThuNhap.toLocaleString() }} VNĐ</p>
          <p><span class="font-bold">Tổng phiếu thuê:</span> {{ tongPhieuThue }}</p>
          <p><span class="font-bold">Khách mới:</span> {{ soKhachMoi }}</p>
          <p><span class="font-bold">Hợp đồng:</span> {{ soHopDong }}</p>

          <!-- Bảng top nhân viên -->
          <p class="mt-4 mb-2 font-bold">Nhân viên có nhiều hợp đồng:</p>
          <table class="w-full border-collapse border mb-6">
            <thead>
              <tr>
                <th class="border p-1">STT</th>
                <th class="border p-1">Tên nhân viên</th>
                <th class="border p-1">Số hợp đồng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(nv, index) in topNhanVien" :key="nv.id">
                <td class="border p-1">{{ index + 1 }}</td>
                <td class="border p-1">{{ nv.ho_ten }}</td>
                <td class="border p-1">{{ nv.so_phieu_thue }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Bảng top phòng -->
          <p class="mt-4 mb-2 font-bold">Phòng được thuê nhiều nhất:</p>
          <table class="w-full border-collapse border mb-6">
            <thead>
              <tr>
                <th class="border p-1">STT</th>
                <th class="border p-1">Số phòng</th>
                <th class="border p-1">Số lần thuê</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(phong, index) in topPhong" :key="phong.id">
                <td class="border p-1">{{ index + 1 }}</td>
                <td class="border p-1">{{ phong.so_phong }}</td>
                <td class="border p-1">{{ phong.so_phieu_thue }}</td> 
              </tr>
            </tbody>
          </table>

          <!-- Biểu đồ trạng thái hợp đồng -->
          <p class="mt-4 font-bold">Trạng thái hợp đồng:</p>
          <ul>
            <li v-for="(item, index) in hopDongStatusData" :key="index">
              {{ item.name }}: <span class="font-bold">{{ item.value }}</span>
            </li>
          </ul>
          <p class="mt-4 font-bold">Doanh thu thuê phòng theo tháng:</p>
          <div class="h-[300px]" ref="chartRef">
            <Bar
              :data="chartDataThuePhong"
              :options="chartOptionsThuePhong"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-4 flex justify-end space-x-2">
          <Button @click="downloadPDF" variant="secondary">In PDF</Button>
          <Button @click="showReport = false" variant="destructive">Đóng</Button>
        </div>
      </div>
    </div>
  </div> 
</template>
