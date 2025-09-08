<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const lichDayGV = ref<any[]>([]); // lịch dạy của giáo viên hiện tại
const userId = localStorage.getItem("user_id"); // lấy id giáo viên từ localStorage
const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Hàm format ngày yyyy-mm-dd → dd/mm/yyyy
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Lấy lịch dạy theo giáo viên hiện tại
const fetchLichDayGV = async () => {
  if (!userId) return;
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/lich_day/giao_vien/${userId}`
    );
    lichDayGV.value = res.data;
  } catch (err) {
    console.error("Lỗi fetch lịch dạy:", err);
  }
};

onMounted(fetchLichDayGV);
</script>

<template>
   <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold mb-4">📅 Lịch dạy của tôi</h2>

    <div v-if="lichDayGV.length > 0" class="border rounded-xl shadow p-4 bg-white">
      <h3 class="text-xl font-semibold text-blue-700 mb-2">👨‍🏫 Giáo viên ID: {{ userId }}</h3>

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
          <tr v-for="lop in lichDayGV" :key="lop.id">
            <td class="border border-gray-400 px-2 py-1">{{ lop.ten_lop }}</td>
            <td class="border border-gray-400 px-2 py-1">{{ formatDate(lop.ngay_bat_dau) }} - {{ formatDate(lop.ngay_ket_thuc) }}</td>
            <td class="border border-gray-400 px-2 py-1">
              {{ lop.phong_hoc.so_phong || '-' }}
            </td>
            <template v-for="day in days" :key="lop.id + '-' + day">
              <td class="border border-gray-400">
                <span v-if="lop.lich_days?.some((ld:any) => ld.thu === day && ld.buoi === 'morning')" class="text-blue-600 font-bold">✔</span>
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
</template>
