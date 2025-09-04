<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Pie } from "vue-chartjs"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from "chart.js"

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

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

const fetchDuLieu = async () =>{
  fetchPhieuThue();
  fetchThuNhap();
  fetchKhachMoi();
  fetchHopDong();
  fetchTopPhong();
  fetchTopNhanVien();
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
// Khi component mount -> set ngày mặc định + fetch dữ liệu luôn
onMounted(() => {
  getDefaultDates()
  fetchDuLieu();
  fetchHopDongStatus();
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
        <Button>Tải xuống</Button>
      </div>
    </page-header>

    <Tabs default-value="overview" class="space-y-4">
      <TabsContent value="overview" class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">
                Thu nhập
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
          <CardHeader>
            <CardTitle>Trạng thái hợp đồng</CardTitle>
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
            <CardHeader>
              <CardTitle>Top nhân viên ký hợp đồng</CardTitle>
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
            <CardHeader>
              <CardTitle>Top nhân viên (phiếu thuê đã ký)</CardTitle>
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
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
