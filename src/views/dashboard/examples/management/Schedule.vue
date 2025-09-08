<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const giaoVienList = ref<any[]>([]); // danh sách giáo viên
const lichDayTheoGV = ref<Record<string, any[]>>({}); // lịch dạy theo gv
const searchQuery = ref(""); // từ khóa tìm kiếm
const days = ['T2','T3','T4','T5','T6','T7','CN'];

// Lấy danh sách giáo viên (có hỗ trợ search)
const fetchGiaoVien = async (keyword = "") => {
  
  try {
    let url = "http://127.0.0.1:8000/api/giao_viens";
    if (keyword) {
      url += `?search=${keyword}`;
    }
    const res = await axios.get(url);
    giaoVienList.value = res.data;

    // load lịch dạy từng gv
    lichDayTheoGV.value = {};
    for (const gv of giaoVienList.value) {
      await fetchLichDayTheoGV(gv.id);
      searchQuery.value ="";
    }
  } catch (err) {
    console.error("Lỗi fetch giáo viên:", err);
  }
};

// Lấy lịch dạy theo giáo viên
const fetchLichDayTheoGV = async (giaoVienId: string) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/lich_day/giao_vien/${giaoVienId}`
    );
    lichDayTheoGV.value[giaoVienId] = res.data;
  } catch (err) {
    console.error("Lỗi fetch lịch dạy:", err);
  }
};
// Hàm format ngày yyyy-mm-dd → dd/mm/yyyy
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

onMounted(async () => {
  await fetchGiaoVien();
});
</script>

<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold mb-4">📅 Lịch dạy của giáo viên</h2>

    <!-- Thanh tìm kiếm -->
    <div class="flex gap-2 mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Nhập tên giáo viên..."
        class="flex-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        @click="fetchGiaoVien(searchQuery)"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Tìm kiếm
      </button>
      <button
        @click="fetchGiaoVien()"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
      >
        Hiển thị tất cả
      </button>
    </div>

    <!-- Mỗi giáo viên một khung -->
    <div
      v-for="gv in giaoVienList"
      :key="gv.id"
      class="border rounded-xl shadow p-4 bg-white"
    >
      <h3 class="text-xl font-semibold text-blue-700 mb-2">
        👨‍🏫 {{ gv.ho_ten }}
      </h3>
      <p class="text-gray-600 mb-4">Mã GV: {{ gv.id }}</p>

      <!-- Lớp học của giáo viên -->
      <div v-if="lichDayTheoGV[gv.id] && lichDayTheoGV[gv.id].length > 0">
        <h2 class="text-lg font-bold mb-2">Lịch dạy các lớp</h2>
        <table class="table-auto border-collapse border border-gray-400 w-full text-center">
          <thead>
            <tr>
              <th class="border border-gray-400 px-2 py-1">Lớp học</th>
              <th class="border border-gray-400 px-2 py-1">Thời hạn</th>
              <th class="border border-gray-400 px-2 py-1">Phòng học</th>
              <th v-for="day in days" :key="day" colspan="3" class="border border-gray-400 px-2 py-1">{{ day }}</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <template v-for="day in days" :key="day + '-slots-class'">
                <th class="border border-gray-400">Sáng</th>
                <th class="border border-gray-400">Chiều</th>
                <th class="border border-gray-400">Tối</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lop in lichDayTheoGV[gv.id]" :key="lop.id">
              <td class="border border-gray-400 px-2 py-1">{{ lop.ten_lop }}</td>
              <td class="border border-gray-400 px-2 py-1">{{ formatDate(lop.ngay_bat_dau) }} - {{ formatDate(lop.ngay_ket_thuc) }}</td>
              <td class="border border-gray-400 px-2 py-1">
                {{ lop.phong_hoc.so_phong || '-' }}
              </td>
              <template v-for="day in days" :key="lop.id + '-' + day">
                <td class="border border-gray-400">
                  <span v-if="lop.lich_days?.some( (ld:any) => ld.thu === day && ld.buoi === 'morning')" class="text-blue-600 font-bold">✔</span>
                </td>
                <td class="border border-gray-400">
                 <span v-if="lop.lich_days?.some((ld:any) => ld.thu === day && ld.buoi === 'afternoon')" class="text-blue-600 font-bold">✔</span>
                </td>
                <td class="border border-gray-400">
                  <span v-if="lop.lich_days?.some((ld:any) => ld.thu === day && ld.buoi === 'evening')" class="text-blue-600 font-bold">✔</span>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-red-500 italic">Không có lịch dạy</p>
    </div>
  </div>
</template>
