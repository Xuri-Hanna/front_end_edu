<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import { Calendar } from 'lucide-vue-next';
import ExcelJS from "exceljs";
import  type { Cell } from "exceljs";
import { saveAs } from "file-saver";

// Danh sách lớp
const lopHocList = ref<any[]>([]);

// Danh sách môn học, giáo viên, phòng học
const monHocList = ref<{ id: string; mon_hoc: string }[]>([]);
const giaoVienList = ref<{ id: string; ho_ten: string }[]>([]);
const phongHocList = ref<{ id: string; so_phong: string }[]>([]);
const userId = localStorage.getItem("user_id"); // lấy id giáo viên từ localStorage

// Cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'ten_lop', header: 'Tên lớp' },
  { accessorKey: 'nam_hoc', header: 'Năm học' },
  {
    accessorKey: 'ngay_bat_dau',
    header: 'Ngày bắt đầu',
    cell: ({ row }) => {
      const date = row.original.ngay_bat_dau;
      return date ? new Date(date).toLocaleDateString('vi-VN') : '';
    }
  },
  {
    accessorKey: 'mon_hoc_id',
    header: 'Môn học',
    cell: ({ row }) => {
      const mon = monHocList.value.find(m => m.id === row.original.mon_hoc_id);
      return mon ? mon.mon_hoc : 'N/A';
    }
  },
  {
    accessorKey: 'giao_vien_id',
    header: 'Giáo viên',
    cell: ({ row }) => {
      const gv = giaoVienList.value.find(g => g.id === row.original.giao_vien_id);
      return gv ? gv.ho_ten : 'N/A';
    }
  },
  {
    accessorKey: 'phong_hoc_id',
    header: 'Phòng học',
    cell: ({ row }) => {
      const ph = phongHocList.value.find(p => p.id === row.original.phong_hoc_id);
      return ph ? ph.so_phong : 'N/A';
    }
  },
  { accessorKey: 'so_buoi', header: 'Số buổi' },
  { accessorKey: 'so_luong', header: 'Sĩ số' },
 {
    accessorKey: 'trang_thai',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const value = row.original.trang_thai;
      let classes =
        'px-2 py-1 rounded text-white text-sm font-medium ';
      switch (value) {
        case 'Đang học':
          classes += 'bg-green-500';
          break;
        case 'Sắp mở':
          classes += 'bg-blue-500';
          break;
        case 'Đã hủy':
          classes += 'bg-gray-500';
          break;
        case 'Đã kết thúc':
          classes += 'bg-red-500';
          break;
        default:
          classes += 'bg-slate-400';
      }
      return h('span', { class: classes }, value);
    }
  },
  {
     accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) => {
      const trangThai = row.original.trang_thai;

      return h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'default', onClick: () => fetchHocSinhTheoLop(row.original.id, 1) }, 'Xem học sinh')
      ]);
    }
  }
];
// Fetch dữ liệu
const fetchLopHoc = async () => {
  const res = await axios.get(`http://127.0.0.1:8000/api/lop_hocs/giao_vien/${userId}`);
  lopHocList.value = res.data;
};
const fetchMonHoc = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/mon_hocs');
  monHocList.value = res.data;
};
const fetchGiaoVien = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/giao_viens');
  giaoVienList.value = res.data;
};
const fetchPhongHoc = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/phong_hocs');
  phongHocList.value = res.data;
};
const selectedTrangThai = ref("Tất cả");

// Danh sách học sinh trong lớp
const hocSinhList = ref<any[]>([]);
const showHocSinhTable = ref(false);
const currentLopHoc = ref<any>(null);
const totalHocSinh = ref(0);
//Phân trang
const currentPage = ref<number>(1);
const totalPages = ref<number>(1);
const perPage = 10;
// Hàm lấy học sinh theo lớp
const fetchHocSinhTheoLop = async (lopHocId: string, page = 1) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/lop_hocs/${lopHocId}/hoc_sinhs?page=${page}&per_page=${perPage}`
    );

    hocSinhList.value = res.data.data;
    currentPage.value = res.data.current_page;
    totalPages.value = res.data.last_page;
    totalHocSinh.value = res.data.total;

    currentLopHoc.value = lopHocList.value.find((l) => l.id === lopHocId);
    showHocSinhTable.value = true;
  } catch (err) {
    console.error("Lỗi khi lấy học sinh theo lớp:", err);
  }
};
//Xuất danh sách học sinh excel
const exportHocSinhToExcel = async () => {
  if (!currentLopHoc.value || hocSinhList.value.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Danh sách học sinh");

  // Tạo tiêu đề
  worksheet.mergeCells("A1:F1");
  worksheet.getCell("A1").value = `Danh sách học sinh - ${currentLopHoc.value.ten_lop}`;
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A1").font = { bold: true, size: 14 };

  // Header
  const header = ["STT", "Họ tên", "Giới tính", "Ngày sinh", "SĐT", "Địa chỉ"];
  worksheet.addRow(header);

  // Style cho header
  worksheet.getRow(2).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Data
  hocSinhList.value.forEach((hs, index) => {
    worksheet.addRow([
      index + 1,
      hs.ho_ten,
      hs.gioi_tinh,
      hs.ngay_sinh,
      hs.so_dien_thoai,
      hs.dia_chi,
    ]);
  });

  // Auto fit content
  worksheet.columns.forEach((col) => {
    let maxLength = 0;
    col.eachCell({ includeEmpty: true }, (cell: Cell) => {
      const len = cell.value ? cell.value.toString().length : 10;
      if (len > maxLength) maxLength = len;
    });
    col.width = maxLength < 15 ? 15 : maxLength;
  });

  // Xuất file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `DanhSach_${currentLopHoc.value.ten_lop}.xlsx`);
};

//Phân trang
const changePage = (page: number) => {
  if (!currentLopHoc.value) return;
  if (page < 1 || page > totalPages.value) return;
  fetchHocSinhTheoLop(currentLopHoc.value.id, page);
};

// ================== Model xem học sinh ==================
// Modal thêm học sinh
const allHocSinhs = ref<any[]>([]);
const selectedHocSinhs = ref<string[]>([]);
const selectAll = ref(false);
const searchQuery = ref("");

const currentPageModal = ref(1);
const lastPageModal = ref(1);
const perPageModal = ref(10);
// Gọi API lấy danh sách mặc định hoặc theo search
const fetchHocSinhs = async (lopHocId: string, search = "", page = 1) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPageModal.value),
    });
    if (search) params.append("search", search);

    const url = `http://127.0.0.1:8000/api/lop_hocs/${lopHocId}/hoc_sinhs/not_in?${params.toString()}`;
    const res = await axios.get(url);

    allHocSinhs.value = res.data.data ?? [];
    currentPageModal.value = res.data.current_page ?? 1;
    lastPageModal.value = res.data.last_page ?? 1;

    selectAll.value = false;
    selectedHocSinhs.value = [];
  } catch (err) {
    console.error("Lỗi fetch học sinh:", err);
  }
};
// hàm chuyển trang
const goToPage = async (page: number) => {
  if (!currentLopHoc.value) return;
  if (page < 1 || page > lastPageModal.value) return;
  await fetchHocSinhs(currentLopHoc.value.id, searchQuery.value, page);
};

onMounted(() => {
  fetchLopHoc();
  fetchMonHoc();
  fetchGiaoVien();
  fetchPhongHoc();
});
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Lớp học</h1>
    <!-- Bộ lọc -->
    <!-- Bảng -->
  <DataTable :columns="columns" :data="lopHocList" />
    <!-- Danh sách học sinh dạng bảng trượt -->
    <transition name="slide-left">
      <div
        v-if="showHocSinhTable"
        class="fixed top-12 right-0 h-8/10 w-full bg-white shadow-lg p-4 overflow-y-auto"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">
            Danh sách học sinh - {{ currentLopHoc?.ten_lop }}
          </h2>
        </div>
        <div class="flex justify-end mt-4">
          <Button variant="outline" @click="showHocSinhTable = false">Đóng</Button>
            <Button variant="default" @click="exportHocSinhToExcel">📥 Xuất Excel</Button>
        </div>
       <!-- Hiển thị số lượng -->
      <div class="mb-4 text-sm">
        <span
          v-if="totalHocSinh > currentLopHoc?.so_luong"
          class="text-red-600 font-semibold"
        >
          Số học sinh hiện tại: {{ totalHocSinh }} / {{ currentLopHoc?.so_luong }}
          (Vượt quá số lượng cho phép!)
        </span>
        <span
          v-else
          class="text-gray-700"
        >
          Số học sinh hiện tại:
          <span class="font-semibold">{{ totalHocSinh }}</span> /
          <span class="font-semibold">{{ currentLopHoc?.so_luong }}</span>
        </span>
      </div>
        <!-- Table -->
        <table class="w-full border-collapse border">
          <thead>
            <tr class="bg-gray-100 text-left">
              <th class="border px-2 py-1">STT</th>
              <th class="border px-2 py-1">Tên</th>
              <th class="border px-2 py-1">Giới tính</th>
              <th class="border px-2 py-1">Ngày sinh</th>
              <th class="border px-2 py-1">Số điện thoại</th>
              <th class="border px-2 py-1">Địa chỉ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(hs,index) in hocSinhList" :key="hs.id">
              <td class="border px-2 py-1 text-center">
                {{ (currentPage - 1) * perPage + index + 1 }}
              </td>
              <td class="border px-2 py-1">{{ hs.ho_ten }}</td>
              <td class="border px-2 py-1">{{ hs.gioi_tinh }}</td>
              <td class="border px-2 py-1">{{ hs.ngay_sinh }}</td>
              <td class="border px-2 py-1">{{ hs.so_dien_thoai }}</td>
              <td class="border px-2 py-1">{{ hs.dia_chi }}</td>
            </tr>
         
            <tr v-if="hocSinhList.length === 0">
              <td colspan="6" class="text-center py-2">Không có học sinh</td>
            </tr>
          </tbody>
        </table>
          <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <button
          class="px-3 py-1 border rounded"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          Trang trước
        </button>

        <span>Trang {{ currentPage }} / {{ totalPages }}</span>

        <button
          class="px-3 py-1 border rounded"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Trang sau
        </button>
      </div>
      </div>
    </transition>
  </div>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

</style>