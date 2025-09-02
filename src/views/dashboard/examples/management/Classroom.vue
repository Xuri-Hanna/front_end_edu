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

// Lỗi + message
const errors = reactive<Record<string, string>>({});
const successMessage = ref('');

// Kiểu dữ liệu lớp
interface LopHocPayload {
  id?: string;
  ten_lop: string;
  nam_hoc:string;
  mon_hoc_id: string;
  giao_vien_id: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  so_luong: number | null;
  phong_hoc_id: string;
  trang_thai: string;
  don_gia: number | null;
  so_buoi: number | null;
}

// Form mặc định
const form = ref<LopHocPayload>({
  ten_lop: '',
  nam_hoc: '',
  mon_hoc_id: '',
  giao_vien_id: '',
  ngay_bat_dau: '',
  ngay_ket_thuc: '',
  so_luong: null,
  phong_hoc_id: '',
  trang_thai: '',
  don_gia: null,
  so_buoi: null
});

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
  { accessorKey: 'don_gia', header: 'Đơn giá',
    cell: ({ row }) => {
      const gia = row.original.don_gia ?? 0;
      return new Intl.NumberFormat('vi-VN').format(gia) + ' VNĐ';
    }
   },
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
        h(Button, { variant: 'outline', onClick: () => editLopHoc(row.original) }, 'Sửa'),

        // chỉ hiện nút Xóa nếu trạng thái KHÔNG phải "Đang học"
        trangThai !== 'Đang học'
          ? h(Button, { variant: 'destructive', onClick: () => deleteLopHoc(row.original.id) }, 'Xóa')
          : null,

        h(Button, { variant: 'default', onClick: () => fetchHocSinhTheoLop(row.original.id, 1) }, 'Xem học sinh'),

        h(
          Button,
          { size: 'icon', class: 'bg-blue-500 hover:bg-blue-600 text-white', onClick: () => showSchedule(row.original) },
          () => h(Calendar, { class: 'w-4 h-4' })
        )
      ]);
    }
  }
];
const showForm = ref(false);

const closeForm = () => {
  showForm.value = false;
  resetForm();
};

// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => (errors[key] = ''));
  let isValid = true;

  if (!form.value.ten_lop) {
    errors.ten_lop = 'Tên lớp bắt buộc';
    isValid = false;
  }
  if (!form.value.mon_hoc_id) {
    errors.mon_hoc_id = 'Môn học bắt buộc';
    isValid = false;
  }
  if (!form.value.giao_vien_id) {
    errors.giao_vien_id = 'Giáo viên bắt buộc';
    isValid = false;
  }
  if (!form.value.ngay_bat_dau) {
    errors.ngay_bat_dau = 'Ngày bắt đầu bắt buộc';
    isValid = false;
  }
  if (!form.value.ngay_ket_thuc) {
    errors.ngay_ket_thuc = 'Ngày kết thúc bắt buộc';
    isValid = false;
  }

  // ✅ Kiểm tra ngày kết thúc > ngày bắt đầu
  if (form.value.ngay_bat_dau && form.value.ngay_ket_thuc) {
    const start = new Date(form.value.ngay_bat_dau);
    const end = new Date(form.value.ngay_ket_thuc);
    if (end < start) {
      errors.ngay_ket_thuc = 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu';
      isValid = false;
    }
  }

  if (!form.value.so_luong || form.value.so_luong <= 0) {
    errors.so_luong = 'Số lượng phải > 0';
    isValid = false;
  }
  if (!form.value.phong_hoc_id) {
    errors.phong_hoc_id = 'Phòng học bắt buộc';
    isValid = false;
  }
  if (!form.value.trang_thai) {
    errors.trang_thai = 'Trạng thái bắt buộc';
    isValid = false;
  }
  if (!form.value.don_gia || form.value.don_gia < 0) {
    errors.don_gia = 'Đơn giá không hợp lệ';
    isValid = false;
  }
  if (!form.value.so_buoi || form.value.so_buoi <= 0) {
    errors.so_buoi = 'Số buổi phải > 0';
    isValid = false;
  }
  if (!form.value.trang_thai) {
    errors.trang_thai = 'Trạng thái bắt buộc';
    isValid = false;
  } else if (!['Sắp mở', 'Đang học', 'Đã hủy', 'Đã kết thúc'].includes(form.value.trang_thai)) {
    errors.trang_thai = 'Trạng thái không hợp lệ';
    isValid = false;
  }

  return isValid;
};

// Fetch dữ liệu
const fetchLopHoc = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/lop_hocs');
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
const selectedTrangThai = ref("Đang học");

// Submit form
const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/lop_hocs/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật lớp học thành công!';
    } else {
      await axios.post('http://127.0.0.1:8000/api/lop_hocs', form.value);
      successMessage.value = 'Thêm lớp học thành công!';
    }
    resetForm();
    fetchLopHoc();
  } catch (err) {
    console.error('Lỗi:', err);
  }
  showForm.value=false;
};

// Edit
const editLopHoc = (lop: LopHocPayload) => {
  form.value = { ...lop };
  showForm.value = true;
};

// Delete
const deleteLopHoc = async (id: string) => {
  await axios.delete(`http://127.0.0.1:8000/api/lop_hocs/${id}`);
  fetchLopHoc();
};

// Reset
const resetForm = () => {
  form.value = {
    ten_lop: '',
    nam_hoc: '',
    mon_hoc_id: '',
    giao_vien_id: '',
    ngay_bat_dau: '',
    ngay_ket_thuc: '',
    so_luong: null,
    phong_hoc_id: '',
    trang_thai: '',
    don_gia: null,
    so_buoi: null
  };
  Object.keys(errors).forEach(k => (errors[k] = ''));
};
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

const xoaHocSinhKhoiLop = async (lopHocId: string, hocSinhId: string) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/lop_hocs/${lopHocId}/hoc_sinhs/${hocSinhId}`);
    hocSinhList.value = hocSinhList.value.filter(h => h.id !== hocSinhId);
  } catch (e) {
    console.error('Lỗi xóa học sinh khỏi lớp:', e);
  }
};
// ================== Model thêm học sinh ==================
// Modal thêm học sinh
const showAddHocSinhModal = ref(false);
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
const openThemHocSinhForm = async (lopHocId: string) => {
  currentLopHoc.value = { id: lopHocId }
  searchQuery.value = "" // reset khi mở modal
  await fetchHocSinhs(lopHocId,"",1)
  selectedHocSinhs.value = []
  selectAll.value = false
  showAddHocSinhModal.value = true
}

const searchHocSinhs = async () => {
  if (currentLopHoc.value) {
    await fetchHocSinhs(currentLopHoc.value.id, searchQuery.value,1)
  }
}

const resetSearch = async () => {
  searchQuery.value = ""
  if (currentLopHoc.value) {
    await fetchHocSinhs(currentLopHoc.value.id,"",1)
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedHocSinhs.value = allHocSinhs.value.map(h => h.id);
  } else {
    selectedHocSinhs.value = [];
  }
};

const confirmAddHocSinh = async () => {
  if (!currentLopHoc.value || selectedHocSinhs.value.length === 0) return;
  try {
    for (const hsId of selectedHocSinhs.value) {
      await axios.post('http://127.0.0.1:8000/api/chi_tiet_lops', {
        lop_hoc_id: currentLopHoc.value.id,
        hoc_sinh_id: hsId
      });
    }
    await fetchHocSinhTheoLop(currentLopHoc.value.id);
    showAddHocSinhModal.value = false;
  } catch (err) {
    console.error('Lỗi khi thêm học sinh:', err);
  }
};
// hàm chuyển trang
const goToPage = async (page: number) => {
  if (!currentLopHoc.value) return;
  if (page < 1 || page > lastPageModal.value) return;
  await fetchHocSinhs(currentLopHoc.value.id, searchQuery.value, page);
};

//=====Lịch dạy=======
const showScheduleModal = ref(false);
const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// map checkbox state: key = `${day}_${slotToken}`
const selectedSchedules = reactive<Record<string, boolean>>({});

const showSchedule = async (lopHoc: any) => {
  currentLopHoc.value = lopHoc;
  showScheduleModal.value = true;

  // reset
  Object.keys(selectedSchedules).forEach(k => delete selectedSchedules[k]);
  days.forEach(d => {
    selectedSchedules[`${d}_morning`] = false;
    selectedSchedules[`${d}_afternoon`] = false;
    selectedSchedules[`${d}_evening`] = false;
  });

  try {
    // GET lịch dạy hiện tại (buoi trả về: morning/afternoon/evening)
    const res = await axios.get(`http://127.0.0.1:8000/api/lop_hocs/${lopHoc.id}/lich_day`);
    const lichDayList = res.data; // [{thu:'T3', buoi:'afternoon'}, ...]

    lichDayList.forEach((lich: any) => {
      const key = `${lich.thu}_${lich.buoi}`;
      selectedSchedules[key] = true;
    });
  } catch (err) {
    console.error("Lỗi load lịch học:", err);
  }
};

// Tick/untick → cập nhật DB ngay
const toggleSchedule = async (thu: string, slotToken: 'morning' | 'afternoon' | 'evening', checked: boolean) => {
  if (!currentLopHoc.value) return;
  try {
    await axios.post(`http://127.0.0.1:8000/api/lop_hocs/${currentLopHoc.value.id}/lich_day/toggle`, {
      thu,
      buoi: slotToken,
      value: checked
    });
  } catch (err) {
    console.error("Lỗi cập nhật lịch:", err);
    // rollback checkbox nếu lỗi
    selectedSchedules[`${thu}_${slotToken}`] = !checked;
  }
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
    <!-- Nút mở form -->
    <div class="mb-4">
      <Button variant="default" @click="showForm = true">+ Thêm lớp</Button>
    </div>

    <!-- Form -->
    <transition name="slide-down">
      <div v-if="showForm"  class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg w-2/3 mt-10 p-6">
          <h2 class="text-lg font-bold mb-4">
            {{ form.id ? "Cập nhật lớp học" : "Thêm lớp học" }}
          </h2>
          
          <!--FORM-->
          <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
            <div class="grid gap-y-2">
              <label>Tên lớp</label>
              <Input type="text" v-model="form.ten_lop" />
              <small v-if="errors.ten_lop" class="text-red-500">{{ errors.ten_lop }}</small>
            </div>
            <div class="grid gap-y-2">
              <label>Năm học</label>
              <Input type="text" v-model="form.nam_hoc" placeholder="VD: 2024-2025" />
              <small v-if="errors.nam_hoc" class="text-red-500">{{ errors.nam_hoc }}</small>
            </div>
            <div class="grid gap-y-2">
              <label>Môn học</label>
              <select v-model="form.mon_hoc_id" class="border rounded p-2">
                <option value="">-- Chọn môn --</option>
                <option v-for="m in monHocList" :key="m.id" :value="m.id">{{ m.mon_hoc }}</option>
              </select>
              <small v-if="errors.mon_hoc_id" class="text-red-500">{{ errors.mon_hoc_id }}</small>
            </div>
            <div class="grid gap-y-2">
              <label>Giáo viên</label>
              <select v-model="form.giao_vien_id" class="border rounded p-2">
                <option value="">-- Chọn giáo viên --</option>
                <option v-for="gv in giaoVienList" :key="gv.id" :value="gv.id">{{ gv.ho_ten }}</option>
              </select>
              <small v-if="errors.giao_vien_id" class="text-red-500">{{ errors.giao_vien_id }}</small>
            </div>
            <div class="grid gap-y-2">
              <label>Phòng học</label>
              <select v-model="form.phong_hoc_id" class="border rounded p-2">
                <option value="">-- Chọn phòng --</option>
                <option v-for="ph in phongHocList" :key="ph.id" :value="ph.id">{{ ph.so_phong }}</option>
              </select>
              <small v-if="errors.phong_hoc_id" class="text-red-500">{{ errors.phong_hoc_id }}</small>
            </div>
            <div class="grid gap-y-2">
              <label>Ngày bắt đầu</label>
              <Input type="date" v-model="form.ngay_bat_dau" />
              <small v-if="errors.ngay_bat_dau" class="text-red-500">{{ errors.ngay_bat_dau }}</small>
            </div>
            <div class="grid gap-y-2">
              <label>Ngày kết thúc</label>
              <Input type="date" v-model="form.ngay_ket_thuc" />
              <small v-if="errors.ngay_ket_thuc" class="text-red-500">{{ errors.ngay_ket_thuc }}</small>
            </div>
            <div class="grid gap-y-2">
              <label>Số lượng</label>
              <Input type="number" v-model="form.so_luong" />
              <small v-if="errors.so_luong" class="text-red-500">{{ errors.so_luong }}</small>
            </div>
            <div class="grid gap-y-2">
              <label>Số buổi</label>
              <Input type="number" v-model="form.so_buoi" />
              <small v-if="errors.so_buoi" class="text-red-500">{{ errors.so_buoi }}</small>
            </div>
            <div class="grid gap-y-2">
              <label>Đơn giá</label>
              <Input type="number" v-model="form.don_gia" />
              <small v-if="errors.don_gia" class="text-red-500">{{ errors.don_gia }}</small>
            </div>
            <div class="grid gap-y-2">
              <label for="trang_thai">Trạng thái</label>
              <select v-model="form.trang_thai" class="border rounded px-2 py-1 w-full">
                <option disabled value="">-- Chọn trạng thái --</option>
                <option value="Sắp mở">Sắp mở</option>
                <option value="Đang học">Đang học</option>
                <option value="Đã hủy">Đã hủy</option>
                <option value="Đã kết thúc">Đã kết thúc</option>
              </select>
              <p v-if="errors.trang_thai" class="text-red-500 text-sm">{{ errors.trang_thai }}</p>
            </div>


            <div class="col-span-2 flex gap-2 mt-2">
              <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Lớp</Button>
              <Button type="button" variant="outline" @click="resetForm">Reset</Button>
              <Button type="button" variant="outline" @click="closeForm">Đóng</Button>
            </div>
          </form>
        </div>
      </div>
    </transition>
    

    <div v-if="successMessage" class="mb-4 text-green-600 font-semibold">
      {{ successMessage }}
    </div>

    <!-- Bộ lọc -->
    <div class="mb-4 flex items-center gap-2">
      <label class="font-semibold">Lọc theo trạng thái:</label>
      <select v-model="selectedTrangThai" class="border rounded px-2 py-1">
        <option value="Tất cả">Tất cả</option>
        <option value="Sắp mở">Sắp mở</option>
        <option value="Đang học">Đang học</option>
        <option value="Đã hủy">Đã hủy</option>
        <option value="Đã kết thúc">Đã kết thúc</option>
      </select>
    </div>

    <!-- Bảng -->
  <DataTable :columns="columns" :data="lopHocList.filter(l => selectedTrangThai === 'Tất cả' || l.trang_thai === selectedTrangThai)" />

     <!-- Modal chọn lịch học -->
    <div v-if="showScheduleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg w-11/12 max-w-6xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">Chọn lịch học</h3>
          <button @click="showScheduleModal = false" class="text-gray-500 hover:text-red-500 text-xl">×</button>
        </div>

        <table class="table-auto border-collapse border border-gray-400 w-full text-center">
          <thead>
            <tr>
              <th v-for="day in days" :key="day" colspan="3" class="border border-gray-400 px-2 py-1">{{ day }}</th>
            </tr>
            <tr>
              <template v-for="day in days" :key="day + '-slots'">
                <th class="border border-gray-400 px-2 py-1">Sáng</th>
                <th class="border border-gray-400 px-2 py-1">Chiều</th>
                <th class="border border-gray-400 px-2 py-1">Tối</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr>
              <template v-for="day in days" :key="day">
                <td class="border border-gray-400">
                  <input
                    type="checkbox"
                    v-model="selectedSchedules[`${day}_morning`]"
                    @change="toggleSchedule(day, 'morning', selectedSchedules[`${day}_morning`])"
                  >
                </td>
                <td class="border border-gray-400">
                  <input
                    type="checkbox"
                    v-model="selectedSchedules[`${day}_afternoon`]"
                    @change="toggleSchedule(day, 'afternoon', selectedSchedules[`${day}_afternoon`])"
                  >
                </td>
                <td class="border border-gray-400">
                  <input
                    type="checkbox"
                    v-model="selectedSchedules[`${day}_evening`]"
                    @change="toggleSchedule(day, 'evening', selectedSchedules[`${day}_evening`])"
                  >
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
          <Button variant="default" @click="openThemHocSinhForm(currentLopHoc?.id)">
            + Thêm học sinh
          </Button>
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
              <th class="border px-2 py-1 text-center">Hành động</th>
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
              <td class="border px-2 py-1 text-center">
                <Button
                  variant="destructive"
                  size="sm"
                  @click="xoaHocSinhKhoiLop(currentLopHoc.id, hs.id)"
                >
                  Xóa học sinh khỏi lớp
                </Button>
              </td>
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

  <!-- Modal thêm học sinh -->
    <div v-if="showAddHocSinhModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-xl shadow-lg w-2/3 max-h-[80vh] overflow-y-auto p-4">
        <h3 class="text-lg font-bold mb-4">Chọn học sinh để thêm</h3>
        
        <!-- Ô tìm kiếm -->
        <div class="flex gap-2 mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm học sinh theo tên..."
            class="flex-1 border px-3 py-2 rounded"
          />
          <Button @click="searchHocSinhs">Tìm</Button>
          <Button variant="outline" @click="resetSearch">Hiển thị tất cả</Button>
        </div>

        <table class="w-full border-collapse border">
          <thead>
            <tr class="bg-gray-100 text-left">
              <th class="border px-2 py-1">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
              </th>
              <th class="border px-2 py-1">Tên</th>
              <th class="border px-2 py-1">Giới tính</th>
              <th class="border px-2 py-1">Ngày sinh</th>
              <th class="border px-2 py-1">SĐT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hs in allHocSinhs" :key="hs.id">
              <td class="border px-2 py-1 text-center">
                <input type="checkbox" v-model="selectedHocSinhs" :value="hs.id" />
              </td>
              <td class="border px-2 py-1">{{ hs.ho_ten }}</td>
              <td class="border px-2 py-1">{{ hs.gioi_tinh }}</td>
              <td class="border px-2 py-1">{{ hs.ngay_sinh }}</td>
              <td class="border px-2 py-1">{{ hs.so_dien_thoai }}</td>
            </tr>
            <tr v-if="allHocSinhs.length === 0">
              <td colspan="5" class="text-center py-2">Không tìm thấy học sinh</td>
            </tr>
          </tbody>
        </table>
        <!-- Phân trang modal -->
        <div class="flex justify-center items-center gap-2 mt-3">
          <Button
            variant="outline"
            :disabled="currentPageModal === 1"
            @click="goToPage(currentPageModal - 1)"
          >
            « Trước
          </Button>

          <span>Trang {{ currentPageModal }} / {{ lastPageModal }}</span>

          <Button
            variant="outline"
            :disabled="currentPageModal === lastPageModal"
            @click="goToPage(currentPageModal + 1)"
          >
            Sau »
          </Button>
        </div>
        <div class="flex justify-end mt-4 gap-2">
          <Button variant="outline" @click="showAddHocSinhModal = false">Hủy</Button>
          <Button @click="confirmAddHocSinh">Xác nhận</Button>
        </div>
      </div>
    </div>
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