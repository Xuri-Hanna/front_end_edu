<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

const giaoVienList = ref<any[]>([]); // danh sách giáo viên
const lichDayTheoGV = ref<Record<string, any[]>>({}); // lịch dạy theo gv
const searchQuery = ref(""); // từ khóa tìm kiếm

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
      `http://127.0.0.1:8000/api/lop_hocs/giao_vien/${giaoVienId}`
    );
    lichDayTheoGV.value[giaoVienId] = res.data;
  } catch (err) {
    console.error("Lỗi fetch lịch dạy:", err);
  }
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
        <div
          v-for="lop in lichDayTheoGV[gv.id]"
          :key="lop.id"
          class="mb-4 border rounded-lg p-3 bg-gray-50"
        >
          <h4 class="font-bold text-lg text-gray-800">
            📘 {{ lop.ten_lop }}
          </h4>

          <!-- Lịch dạy của lớp -->
          <ul class="list-disc list-inside ml-4 mt-2">
            <li
              v-for="lich in lop.lich_days"
              :key="lich.id"
              class="text-gray-700"
            >
              {{ lich.thu }} - {{ lich.buoi }}
            </li>
          </ul>
        </div>
      </div>
      <p v-else class="text-red-500 italic">Không có lịch dạy</p>
    </div>
  </div>
</template>
