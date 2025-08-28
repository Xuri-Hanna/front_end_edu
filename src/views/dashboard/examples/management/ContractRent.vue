<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import * as htmlDocx from "html-docx-js-typescript";
import html2pdf from "html2pdf.js";


// ================== State ==================
const phieuList = ref<any[]>([]);
const nhanVienList = ref<any[]>([]);
const nguoiThueList = ref<any[]>([]);
const phongHocList = ref<any[]>([]);

// ================== Notification ==================
const notification = ref<{ message: string; type: 'error' | 'success' } | null>(null);
const showNotification = ref(false);

const triggerNotification = (msg: string, type: 'error' | 'success' = 'error') => {
  notification.value = { message: msg, type };
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

// ================== Columns ==================
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã phiếu' },
   {
    accessorKey: 'hop_dong_id',
    header: 'Mã hợp đồng',
    cell: ({ row }) => row.original.hop_dong_thue_phong ? row.original.hop_dong_thue_phong.id : 'Chưa có'
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) => h('div', { class: 'flex gap-2' }, [
      h(Button, { variant: 'outline', onClick: () => openCreateHopDong(row.original) }, () => 'Tạo HĐ'),
      h(Button, { variant: 'default', onClick: () => viewHopDong(row.original) }, () => 'Xem HĐ')
    ])
  }
];


//=========Tạo Hợp Đồng ===========
const showHopDongForm = ref(false);
const selectedPhieuForHopDong = ref<any>(null);

const hopDongForm = ref({
  dieu_khoan: ''
});

const openCreateHopDong = async (phieu: any) => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/kiem_tra_hop_dong/${phieu.id}`);
    if (res.data) {
      triggerNotification('Phiếu này đã có hợp đồng!', 'error');
      return;
    }
  } catch (e) {
    // Nếu trả về 404 nghĩa là chưa có hợp đồng
  }
  selectedPhieuForHopDong.value = phieu;
  hopDongForm.value = { dieu_khoan: '' };
  showHopDongForm.value = true;
};

const submitHopDong = async () => {
  if (!selectedPhieuForHopDong.value) return;
  try {
    await axios.post('http://127.0.0.1:8000/api/hop_dong_thue_phongs', {
      phieu_thue_phong_id: selectedPhieuForHopDong.value.id,
      dieu_khoan: hopDongForm.value.dieu_khoan
    });
    showHopDongForm.value = false;
    triggerNotification('Tạo hợp đồng thành công!', 'success');
    fetchPhieu();
  } catch (error: any) {
    triggerNotification('Lỗi khi tạo hợp đồng!', 'error');
  }
};
//======Xem hợp đồng============

const showViewHopDong = ref(false);
const hopDongDetail = ref<any>(null);

const viewHopDong = async (phieu: any) => {
  try {
    const res1 = await axios.get(`http://127.0.0.1:8000/api/kiem_tra_hop_dong/${phieu.id}`);
    if (!res1.data) {
      triggerNotification('Phiếu này chưa có hợp đồng nào!', 'error');
      return;
    }
    const res = await axios.get(`http://127.0.0.1:8000/api/hop_dong_thue_phongs/by-phieu/${phieu.id}`);
    hopDongDetail.value = res.data;
    showViewHopDong.value = true;
  } catch (error) {
    triggerNotification('Phiếu này chưa có hợp đồng nào!', 'error');
  }
};
// ================== API Calls ==================
const fetchPhieu = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/phieu_thue_phongs');
  phieuList.value = res.data.data ?? res.data;
};

const fetchNhanVien = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/nhan_viens');
  nhanVienList.value = res.data.data ?? res.data;
};

const fetchNguoiThue = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/nguoi_thue_phongs');
  nguoiThueList.value = res.data.data ?? res.data;
};

const fetchPhongHoc = async () => {
  const res = await axios.get('http://127.0.0.1:8000/api/phong_hocs');
  phongHocList.value = res.data.data ?? res.data;
};

//=======Xuất hợp đồng=======
const exportHopDongPDF = () => {
  const content = document.getElementById("hopdong-content");
  if (!content) return;

html2pdf()
  .from(content)
  .set({
    margin: [10, 10, 10, 10], // trên, phải, dưới, trái
    filename: `HopDong_${hopDongDetail.value?.hop_dong?.id || "HD"}.pdf`,
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] } // 👈 thêm "avoid-all"
  })
  .save();

};


// ========== Công nợ ==========
const showCongNoModal = ref(false);
const congNoDetail = ref<any>(null);

const xemCongNo = async (id: string) => {
  try {
    const congNoId = hopDongDetail.value?.hop_dong?.cong_no_id;
    if (!congNoId) {
      triggerNotification("Không tìm thấy công nợ của hợp đồng này", "error");
      return;
    }

    // Gọi API lấy công nợ theo cong_no_id
    const res = await axios.get(`http://127.0.0.1:8000/api/cong_no/${congNoId}`);
    congNoDetail.value = res.data;
    showCongNoModal.value = true;
  } catch (error) {
    triggerNotification("Lỗi khi lấy công nợ!", "error");
  }
};



// ================== Mounted ==================
onMounted(() => {
  fetchPhieu();
  fetchNhanVien();
  fetchNguoiThue();
  fetchPhongHoc();
});
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý  Hợp đồng thuê phòng</h1>
     <!-- Notification -->
    <transition name="slide-right">
      <div
        v-if="showNotification"
        class="fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50"
        :class="notification?.type === 'error' ? 'bg-red-500' : 'bg-green-500'"
      >
        {{ notification?.message }}
      </div>
    </transition>

    <!-- Bảng -->
    <DataTable :columns="columns" :data="phieuList" />

    <!-- Popup tạo hợp đồng -->
    <div v-if="showHopDongForm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">
          Tạo hợp đồng cho phiếu {{ selectedPhieuForHopDong?.id }}
        </h2>
        
        <div class="grid gap-y-2 mb-4">
          <label>Điều khoản</label>
          <textarea v-model="hopDongForm.dieu_khoan" class="border rounded p-2 w-full"></textarea>
        </div>

        <div class="flex gap-2 justify-end">
          <Button variant="outline" @click="showHopDongForm = false">Hủy</Button>
          <Button variant="default" @click="submitHopDong">Tạo hợp đồng</Button>
        </div>
      </div>
    </div>
   <!-- Popup xem hợp đồng -->
  <transition name="slide-left">
    <div v-if="showViewHopDong" class="fixed inset-0 flex">
      <!-- Overlay -->
      <div class="flex-1 bg-black bg-opacity-50" @click="showViewHopDong = false"></div>

      <!-- Nội dung hợp đồng -->
      <div id="hopdong-content" class="bg-white p-10 rounded shadow-lg w-[800px] max-h-screen overflow-y-auto text-[14px] leading-6">
        <!-- Quốc hiệu -->
        <div class="text-center font-bold">
          <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
          <p>Độc lập - Tự do - Hạnh phúc</p>
          <p class="mt-1">-----o0o-----</p>
        </div>

        <!-- Ngày tháng -->
        <p class="text-right italic mt-4">
          Hải Phòng, ngày .... tháng .... năm ....
        </p>

        <!-- Tiêu đề -->
        <h2 class="text-center font-bold text-lg mt-4 underline">
          HỢP ĐỒNG CUNG CẤP DỊCH VỤ
        </h2>

        <!-- Căn cứ -->
        <div class="mt-4">
          <p>- Căn cứ Bộ luật dân sự được Quốc hội thông qua ngày 24 tháng 11 năm 2015.</p>
          <p>- Căn cứ Văn bản hợp nhất 17/VBHN-VPQH năm 2019 Luật Thương mại do Văn phòng Quốc hội ban hành.</p>
          <p>- Căn cứ Luật Công nghệ thông tin số 67/2006/QH11 ban hành ngày 29/06/2006.</p>
          <p>- Căn cứ Luật Viễn thông số 41/2009/QH12 ban hành ngày 23/11/2009.</p>
          <p>- Xem xét yêu cầu của khách hàng và khả năng cung cấp dịch vụ của Công ty Cổ phần Tinh Hoa Việt.</p>
        </div>

        <!-- Bảng thông tin -->
        <h3 class="font-semibold mt-6">Chúng tôi gồm:</h3>

        <p class="mt-2 font-semibold">Bên sử dụng dịch vụ (Bên A):</p>
        <p class="mt-2 font-semibold">----------------------------</p>
        <table class="table-auto border border-black w-full text-sm mb-4">
          <tr>
            <td class="border px-2 py-1 w-1/3">Người đại diện</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nguoi_thue?.ho_ten }}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Địa chỉ</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nguoi_thue?.dia_chi }}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Điện thoại</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nguoi_thue?.dien_thoai }}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Email</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nguoi_thue?.email }}</td>
          </tr>
        </table>

        <p class="mt-2 font-semibold">Bên cung cấp dịch vụ (Bên B):</p>
        <p class="mt-2 font-semibold">-----------------------------</p>
        <table class="table-auto border border-black w-full text-sm mb-4">
          <tr>
            <td class="border px-2 py-1 w-1/3">Công ty</td>
            <td class="border px-2 py-1">CÔNG TY CỔ PHẦN Tinh Hoa Việt</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Người đại diện</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nhan_vien?.ho_ten }}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Chức vụ</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nhan_vien?.chuc_vu }}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Địa chỉ</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nhan_vien?.dia_chi }}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Điện thoại</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nhan_vien?.dien_thoai }}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Email</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nhan_vien?.email }}</td>
          </tr>
        </table>

         <p class="mt-2 font-semibold">Thông tin dịch vụ:</p>
        <table class="table-auto border border-black w-full text-sm mb-4">
          <tr>
            <td class="border px-2 py-1 w-1/3">Tên phòng</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.phong?.ten_phong }}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Số chỗ</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.phong?.so_cho}}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Gía phòng</td>
            <td class="border px-2 py-1">
              {{
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                  }).format(hopDongDetail?.phong?.gia_phong)
                }}
            </td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Thời hạn thuê</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.phong?.thoi_han }}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Thành tiền:</td>
            <td class="border px-2 py-1">
                {{
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                  }).format(hopDongDetail?.hop_dong?.thanh_tien)
                }}
            </td>
          </tr>
        </table>

        <!-- Điều khoản -->
        <h3 class="font-semibold mt-4">Điều khoản hợp đồng:</h3>
        <p class="border p-2 whitespace-pre-line">{{ hopDongDetail?.hop_dong?.dieu_khoan }}</p>

        <!-- Chữ ký -->
        <div class="flex justify-between mt-10">
          <div class="text-center w-1/2">
            <p class="font-semibold">ĐẠI DIỆN BÊN A</p>
            <div class="mt-20">Ký tên</div>
          </div>
          <div class="text-center w-1/2">
            <p class="font-semibold">ĐẠI DIỆN BÊN B</p>
            <div class="mt-20">Ký tên</div>
          </div>
        </div>
      <!-- Các nút chức năng -->
      <div class="no-print mt-6 flex items-center justify-between">
        <!-- Hiển thị trạng thái -->
        <div>
          <span class="font-semibold">Trạng thái: </span>
          <span class="text-gray-600 italic">
            {{ hopDongDetail?.hop_dong?.trang_thai }}
          </span>
        </div>

        <!-- Các nút -->
        <div class="flex gap-3">
          <!-- Xuất file -->
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="exportHopDongPDF"
          >
            📄 Xuất file
          </button>
          <!-- Xem công nợ -->
          <button
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            @click="xemCongNo"
          >
            💰 Xem công nợ
          </button>
        </div>
      </div>
      </div>
    </div>
  </transition>
  <!-- Modal Công nợ -->
  <div
    v-if="showCongNoModal"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-lg font-bold mb-4">Công nợ hợp đồng</h2>

      <table class="table-auto border border-black w-full text-sm mb-4">
        <tr>
          <td class="border px-2 py-1">Tổng nợ</td>
          <td class="border px-2 py-1">
            {{
              new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
                .format(congNoDetail?.tien_no ?? 0)
            }}
          </td>
        </tr>
        <tr>
          <td class="border px-2 py-1">Đã trả</td>
          <td class="border px-2 py-1">
            {{
              new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
                .format(congNoDetail?.da_tra ?? 0)
            }}
          </td>
        </tr>
      </table>

      <div class="flex justify-end gap-2">
        <Button variant="outline" @click="showCongNoModal = false">Đóng</Button>
      </div>
    </div>
  </div>

  </div>
</template>
<style>
.page-break {
  page-break-before: always;
}

.no-print {
  display: block;
}
@media print {
  .no-print {
    display: none !important;
  }
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to,
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>