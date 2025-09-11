<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import { saveAs } from "file-saver";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { computed } from "vue";

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
    cell: ({ row }) => {
      const hopDong = row.original.hop_dong_thue_phong;
      if (!hopDong) return 'Chưa có';

      // Gán màu theo trạng thái
      let colorClass = 'text-gray-600';
      switch (hopDong.han_hop_dong) {
        case 'Chờ':
          colorClass = 'text-yellow-500';
          break;
        case 'Còn thời hạn':
          colorClass = 'text-green-600';
          break;
        case 'Kết thúc':
          colorClass = 'text-red-600';
          break;
        case 'Hủy':
          colorClass = 'text-gray-400 line-through';
          break;
      }

      // Danh sách nút nhỏ bên cạnh trạng thái
      const buttons: any[] = [];
      if (hopDong.han_hop_dong === 'Chờ') {
        buttons.push(
          h('button', {
            class: 'ml-2 text-xs text-green-600 hover:underline',
            onClick: () => updateTrangThai(hopDong.id, 'Còn thời hạn')
          }, 'Kích hoạt')
        );
      } else if (hopDong.han_hop_dong === 'Còn thời hạn') {
        buttons.push(
          h('button', {
            class: 'ml-2 text-xs text-red-600 hover:underline',
            onClick: () => updateTrangThai(hopDong.id, 'Kết thúc')
          }, 'Kết thúc')
        );
        buttons.push(
          h('button', {
            class: 'ml-2 text-xs text-gray-600 hover:underline',
            onClick: () => updateTrangThai(hopDong.id, 'Hủy')
          }, 'Hủy')
        );
      }

      return h('div', { class: 'flex flex-col' }, [
        h('span', {}, `#${hopDong.id}`),
        h('div', { class: 'flex items-center gap-1' }, [
          h('span', { class: `text-xs italic ${colorClass}` }, hopDong.han_hop_dong),
          ...buttons
        ])
      ]);
    }
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
//update trạng thái
const updateTrangThai = async (id: number, newStatus: string) => {
  try {
    await axios.patch(`http://127.0.0.1:8000/api/hop_dong_thue_phongs/${id}/trang_thai`, {
      han_hop_dong: newStatus
    });
    triggerNotification(`Cập nhật trạng thái thành công: ${newStatus}`, 'success');
    fetchPhieu(); // refresh lại bảng
  } catch (error) {
    triggerNotification('Cập nhật trạng thái thất bại!', 'error');
  }
};
//lọc theo hạn hợp đồng
// ================== Bộ lọc ==================
const selectedHanHopDong = ref<string>("Tất cả");

const filteredPhieuList = computed(() => {
  if (selectedHanHopDong.value === "Tất cả") return phieuList.value;

  return phieuList.value.filter((item) => {
    const hopDong = item.hop_dong_thue_phong;
    return hopDong && hopDong.han_hop_dong === selectedHanHopDong.value;
  });
});

//=========Tạo Hợp Đồng ===========
const showHopDongForm = ref(false);
const selectedPhieuForHopDong = ref<any>(null);

const hopDongForm = ref({
  dieu_khoan: '',
  ngay_lap: ''
});

// ========= Điều khoản mặc định =========
// const DEFAULT_DIEU_KHOAN = `
//   <h3>Điều khoản hợp đồng mặc định</h3>
//   <p><b>Điều 1:</b> Bên A đồng ý cho Bên B thuê phòng theo thỏa thuận.</p>
//   <p><b>Điều 2:</b> Bên B có trách nhiệm sử dụng phòng đúng mục đích, không được tự ý chuyển nhượng.</p>
//   <p><b>Điều 3:</b> Hai bên cam kết thực hiện đúng các điều khoản đã ký.</p>
//   <p><b>Điều 4:</b> Hợp đồng có hiệu lực kể từ ngày ký.</p>
// `;

const DEFAULT_DIEU_KHOAN = `
  <p><b>ĐIỀU 3: ĐIỀU KHOẢN THANH TOÁN</b></p>
  <p>Đợt 1. Bên A tạm ứng trước 50% giá trị thỏa thuận cho bên B tại điều 2 tương ứng ............ cho bên B trước ngày .............</p>
  <p>Đợt 2. Bên A thanh toán số tiền còn lại cho bên B là .............. cùng với các chi phí phát sinh trước ngày .............</p>
  <p><b>ĐIỀU 4: QUYỀN VÀ TRÁCH NHIỆM CỦA BÊN A</b></p>
  <p>4.1. Chịu trách nhiệm trước pháp luật nếu sử dụng dịch vụ trái với pháp luật nước Cộng hòa xã hội chủ nghĩa Việt Nam và các điều khoản quy định trong hợp đồng này.</p>
  <p>4.2. Phối hợp với bên B về việc sắp xếp phòng học theo yêu cầu.</p>
  <p>4.3. Có trách nhiệm thông báo nội quy phòng học theo quy định của bên B cho học viên trong thời gian sử dụng phòng học của bên B.<p>
  <p>4.4. Chỉ được phép sử dụng phòng học để đào tạo các chương trình phù hợp với cấp phép của mình và không thuộc trong diện không cho phép của các cơ quan quản lý nhà nước. Nếu vi phạm thì hoàn toàn phải chịu trách nhiệm trước pháp luật. <p>
  <p>4.5. Thanh toán chi phí theo đúng thời hạn của hợp đồng và các chi phí phát sinh (nếu có).</p>
  <p><b>ĐIỀU 5: QUYỀN VÀ TRÁCH NHIỆM CỦA BÊN B</b></p>
  <p>5.1. Cử nhân viên phối hợp với bên A chuẩn bị phòng học.</p>
  <p>5.2. Xuất hóa đơn tài chính hợp lệ cho bên A.<p>
  <p>5.3. Bố trí người dọn dẹp kiểm tra các thiết bị trong phòng học trước và sau mỗi lịch thuê phòng.</p>
  <p>5.4. Được quyền yêu cầu bên A bồi hoàn các thiệt hại do hư hỏng trang thiết bị trong phòng học do bên B cung cấp nếu những hư hỏng này do bên A hoặc học viên của bên A gây ra trong thời gian bên A sử dụng.</p>
  <p>5.5. Có quyền hủy hợp đồng với bên A nếu phát hiện bên A có dấu hiệu hoặc cố tình vi phạm các nội dung trong việc thuê phòng để làm các việc ngoài mục đích sử dụng đã đăng ký hoặc thuộc diện cấm hoặc không được phép của các cơ quan nhà nước.</p>
  <p><b>ĐIỀU 6: ĐIỀU KHOẢN CHUNG</b></p>
  <p>6.1. Hai bên cam kết sử dụng đúng các thỏa thuận trong hợp đồng, những điều khoản không có trong hợp đồng được thực hiện theo các luật trong Hợp đồng này và các văn bản hướng dẫn của các luật đó.</p>
  <p>6.2. Nếu phát sinh tranh chấp về hợp đồng, các bên sẽ tiến hành thương lượng, thỏa thuận. Nếu không thỏa thuận được, một trong các bên có quyền khởi kiện theo quy định của pháp luật.</p>
  <p>6.3. Hợp đồng này được lập thành 04 bản, các bản có nội dung và giá trị pháp lý như nhau, mỗi bên giữ 02 bản. Hợp đồng sẽ có hiệu lực kể từ ngày đến lịch thuê phòng của bên A.</p>
`;


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
  hopDongForm.value = {
     dieu_khoan: DEFAULT_DIEU_KHOAN ,
     ngay_lap: ''
    };
  showHopDongForm.value = true;
};

const submitHopDong = async () => {
  if (!selectedPhieuForHopDong.value) return;
  try {
    await axios.post('http://127.0.0.1:8000/api/hop_dong_thue_phongs', {
      phieu_thue_phong_id: selectedPhieuForHopDong.value.id,
      dieu_khoan: hopDongForm.value.dieu_khoan,
      ngay_lap: hopDongForm.value.ngay_lap
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

//=======Xuất hợp đồng ra Word======= 
const exportHopDongWord = async () => {
  const content = document.getElementById("hopdong-content");
  if (!content) {
    triggerNotification("Không tìm thấy nội dung hợp đồng để xuất.", "error");
    return;
  }

  try {
    // Clone DOM để tránh ảnh hưởng
    const clone = content.cloneNode(true) as HTMLElement;

    // Loại bỏ các phần không muốn export
    clone.querySelectorAll(".no-print, button, [data-ignore-export]").forEach((el) => el.remove());

    // Thêm CSS inline cơ bản
    const style = `
      <style>
        body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.4; }
        h1,h2,h3 { margin: 0 0 8px 0; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .italic { font-style: italic; }
        .mt-1 { margin-top: 4px; }
        .mt-4 { margin-top: 16px; }
        .mt-6 { margin-top: 24px; }
        .mt-10 { margin-top: 40px; }
        table { border-collapse: collapse; width: 100%; margin: 8px 0; }
        td, th { border: 1px solid #000; padding: 6px; vertical-align: top; }
      </style>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" />${style}</head>
        <body>${clone.innerHTML}</body>
      </html>
    `;

     const blob = new Blob(["\ufeff", html], {
      type: "application/msword",
    });

    saveAs(blob, `HopDong_${hopDongDetail.value?.hop_dong?.id || "HD"}.doc`);
  } catch (e) {
    console.error("Export Word error:", e);
    triggerNotification("Không xuất được file Word. Vui lòng mở console để xem lỗi chi tiết.", "error");
  }
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

    <!-- Bộ lọc trạng thái -->
  <div class="flex items-center gap-3 mb-4">
    <label class="font-semibold">Lọc theo trạng thái:</label>
    <select
      v-model="selectedHanHopDong"
      class="border rounded px-2 py-1"
    >
      <option value="Tất cả">Tất cả</option>
      <option value="Chờ">Chờ</option>
      <option value="Còn thời hạn">Còn thời hạn</option>
      <option value="Kết thúc">Kết thúc</option>
      <option value="Hủy">Hủy</option>
    </select>
  </div>
    <!-- Bảng -->
   <DataTable :columns="columns" :data="filteredPhieuList" />


    <!-- Popup tạo hợp đồng -->
    <div v-if="showHopDongForm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <!-- <div class="bg-white p-6 rounded shadow-lg w-96 "> -->
      <div class="bg-white p-6 rounded shadow-lg w-[800px] max-h-screen overflow-y-auto">
        <h2 class="text-lg font-bold mb-4">
          Tạo hợp đồng cho phiếu {{ selectedPhieuForHopDong?.id }}
        </h2>
        <div class="grid gap-y-2 mb-4 ">
          <label>Điều khoản</label>
          <QuillEditor
            v-model:content="hopDongForm.dieu_khoan"
            contentType="html"
            theme="snow"
            @update:content="(val: string) => hopDongForm.dieu_khoan = val"
          />
        </div>
        <div class="grid gap-y-2">
        <label>Ngày lập</label>
        <Input type="date" v-model="hopDongForm.ngay_lap" />
      </div>
        <div class="flex gap-2 justify-end">
          <Button variant="outline" @click="showHopDongForm = false">Hủy</Button>
          <Button variant="default" @click="submitHopDong">Tạo hợp đồng</Button>
        </div>
      </div>
    </div>
   <!-- Popup xem hợp đồng -->
  <transition name="slide-left">
    <div v-if="showViewHopDong" class="fixed inset-0 flex z-50">
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
        <div class="text-center">
          <h3 class="font-semibold mt-6">Số: .../HĐDV</h3>
        </div>

        <!-- Căn cứ -->
        <div class="mt-4">
          <p>- Căn cứ Bộ luật dân sự được Quốc hội thông qua ngày 24 tháng 11 năm 2015.</p>
          <p>- Căn cứ Văn bản hợp nhất 17/VBHN-VPQH năm 2019 Luật Thương mại do Văn phòng Quốc hội ban hành.</p>
          <p>- Xem xét yêu cầu của khách hàng và khả năng cung cấp dịch vụ của Công ty TNHH thương mại và dịch vụ giáo dục và đào tạo Tinh Hoa Việt.</p>
          <p>- Căn cứ vào nhu cầu thực tế của 2 bên</p>
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
            <td class="border px-2 py-1">CÔNG TY TNHH Thương Mại và Dịch Vụ giáo dục và đào tạo Tinh Hoa Việt</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Người đại diện</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nhan_vien?.ho_ten }}</td>
          </tr>
          <tr>
            <td class="border px-2 py-1">Chức vụ</td>
            <td class="border px-2 py-1">{{ hopDongDetail?.nhan_vien?.chuc_vu }}</td>
             <!-- <td class="border px-2 py-1">{{nhanVienList.find(nv => nv.id === hopDongDetail?.nhan_vien?.id)?.chucvu?.ten_chucvu}}</td> -->
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
        <!-- Điều khoản -->
        <!-- <h3 class="font-semibold mt-4">Điều khoản hợp đồng:</h3> -->
         <h3 class="font-semibold mt-4">Hai bên đều thống nhất ký kết hợp đồng với những điều khoản sau đây:</h3>
        <p><b>Điều 1: Nội dung hợp đồng.</b></p>
        <p>Bên B cung cấp các dịch vụ thiết bị và phòng học tại số 74 TDP số 4, Phường Ngọc Xuyên, Thành Phố Hải Phòng theo yêu cầu của bên A với chi tiết như sau:</p>
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
            <td class="border px-2 py-1">Giá phòng</td>
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
          <!-- <tr>
            <td class="border px-2 py-1">Thành tiền:</td>
            <td class="border px-2 py-1">
                {{
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                  }).format(hopDongDetail?.hop_dong?.thanh_tien)
                }}
            </td>
          </tr> -->
        </table>
        <p><b>Điều 2: Giá trị thanh toán</b></p>
        <p>- Giá trị thanh toán: {{
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
          }).format(hopDongDetail?.hop_dong?.thanh_tien ?? 0)
        }}</p>

        <div v-html="hopDongDetail?.hop_dong?.dieu_khoan"></div>

        
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
            @click="exportHopDongWord"
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