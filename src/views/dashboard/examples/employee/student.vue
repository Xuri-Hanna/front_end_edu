<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import { Eye, Pencil, Trash2 } from 'lucide-vue-next';

// Danh sách học sinh
const hocSinhList = ref([]);

// Lưu lỗi validation
const errors = reactive<Record<string, string>>({});

// Lưu thông báo thành công
const successMessage = ref('');
// Lưu thông báo thất bại
const errorMessage = ref('');

// Hiển thị form popup
const showForm = ref(false);

// Mở form thêm
const openAddForm = () => {
  resetForm();
  showForm.value = true;
};

// Mở form sửa
const editHocSinh = (hs: HocSinhPayload) => {
  form.value = { ...hs };
  showForm.value = true;
};

// Đóng form
const closeForm = () => {
  showForm.value = false;
  resetForm();
};

// Lớp học của học sinh
const lopHocList = ref<{dangHoc: any[], sapMo: any[]}>({ dangHoc: [], sapMo: [] });
const showLopHocPopup = ref(false);

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã HS' },
  { accessorKey: 'ho_ten', header: 'Họ tên' },
  { accessorKey: 'so_dien_thoai', header: 'SĐT' },
  { accessorKey: 'gioi_tinh', header: 'Giới tính' },
  { accessorKey: 'ngay_sinh', header: 'Ngày sinh' },
  { accessorKey: 'dia_chi', header: 'Địa chỉ' },
  { accessorKey: 'so_phu_huynh', header: 'SĐT Phụ huynh' },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-3' }, [
        // Sửa học sinh
        h(
          'button',
          {
            class: 'text-blue-600 hover:text-blue-800',
            onClick: () => editHocSinh(row.original)
          },
          [h(Pencil, { size: 18 })]
        ),

        // Xóa học sinh
        h(
          'button',
          {
            class: 'text-red-600 hover:text-red-800',
            onClick: () => deleteHocSinh(row.original.id)
          },
          [h(Trash2, { size: 18 })]
        ),
        h(
          'button',
          {
            class: 'text-gray-600 hover:text-gray-800',
            onClick: () => xemLopHoc(row.original.id)
          },
          [h(Eye, { size: 18 })]
        ),
      ])
  }
];

// Kiểu dữ liệu học sinh
interface HocSinhPayload {
  id?: string;
  ho_ten: string;
  so_dien_thoai: string;
  gioi_tinh: string;
  ngay_sinh: string;
  dia_chi: string;
  so_phu_huynh: string;
}

// Form nhập liệu
const form = ref<HocSinhPayload>({
  ho_ten: '',
  so_dien_thoai: '',
  gioi_tinh: '',
  ngay_sinh: '',
  dia_chi: '',
  so_phu_huynh: ''
});
const keyword = ref('');

// Lấy danh sách học sinh
const fetchHocSinh = async () => {
  //const response = await axios.get('http://127.0.0.1:8000/api/hoc_sinhs');
  let url = 'http://127.0.0.1:8000/api/hoc_sinhs';
  if (keyword.value) {
    url = `http://127.0.0.1:8000/api/hoc_sinhs/search?keyword=${keyword.value}`;
  }
  const response = await axios.get(url);
  hocSinhList.value = response.data;
};
/// Xem lớp học của học sinh
const xemLopHoc = async (hocSinhId: string) => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/lop_hoc/${hocSinhId}/hoc_sinh`);
    const allLopHoc = res.data;
    console.log(allLopHoc);
    // Chia theo trạng thái
    lopHocList.value = {
      dangHoc: allLopHoc.filter((lop: any) => lop.trang_thai === 'Đang học'),
      sapMo: allLopHoc.filter((lop: any) => lop.trang_thai === 'Sắp mở'),
    };
    showLopHocPopup.value = true;
  } catch (err) {
    console.error('Lỗi fetch lớp học:', err);
  }
};


// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => (errors[key] = ''));
  let isValid = true;

  if (!form.value.ho_ten) {
    errors.ho_ten = 'Họ tên là bắt buộc';
    isValid = false;
  }

  if (!form.value.so_dien_thoai) {
    errors.so_dien_thoai = 'Số điện thoại là bắt buộc';
    isValid = false;
  } else if (!/^\d{10}$/.test(form.value.so_dien_thoai)) {
    errors.so_dien_thoai = 'Số điện thoại phải đúng 10 chữ số';
    isValid = false;
  }
  const gioiTinhHopLe =['nam','nữ'];
  if (!form.value.gioi_tinh) {
    errors.gioi_tinh = 'Giới tính là bắt buộc';
    isValid = false;
  }else 
  if(!gioiTinhHopLe.includes(form.value.gioi_tinh.toLowerCase())) {
    errors.gioi_tinh = 'Giới tính chỉ được là "nam" hoặc "nữ"';
    isValid = false;
  }
  if (!form.value.ngay_sinh) {
    errors.ngay_sinh = 'Ngày sinh là bắt buộc';
    isValid = false;
  }

  if (!form.value.dia_chi) {
    errors.dia_chi = 'Địa chỉ là bắt buộc';
    isValid = false;
  }

  if (!form.value.so_phu_huynh) {
    errors.so_phu_huynh = 'SĐT phụ huynh là bắt buộc';
    isValid = false;
  } else if (!/^\d{10}$/.test(form.value.so_phu_huynh)) {
    errors.so_phu_huynh = 'SĐT phụ huynh phải đúng 10 chữ số';
    isValid = false;
  }

  return isValid;
};

// Thêm / cập nhật học sinh
const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/hoc_sinhs/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật học sinh thành công!';
    } else {
      await axios.post('http://127.0.0.1:8000/api/hoc_sinhs', form.value);
      successMessage.value = 'Thêm học sinh thành công!';
    }
    //resetForm();
    fetchHocSinh();
    closeForm();
  } catch (err: any) {
    if (err.response && err.response.status === 422) {
      const validationErrors = err.response.data.errors;
      for (const key in validationErrors) {
        errors[key] = validationErrors[key][0];
      }
    } else {
      console.error('Lỗi không xác định:', err);
    }
  }
};

// Chỉnh sửa học sinh
// const editHocSinh = (hs: HocSinhPayload) => {
//   form.value = { ...hs };
// };

// Xóa học sinh
const deleteHocSinh = async (id: string) => {
  // await axios.delete(`http://127.0.0.1:8000/api/hoc_sinhs/${id}`);
  // fetchHocSinh();
  successMessage.value = '';
  errorMessage.value = '';
  if (!confirm('Bạn có chắc muốn xóa học sinh này?')) return;
  try {
    const res = await axios.delete(`http://127.0.0.1:8000/api/hoc_sinhs/${id}`);
    successMessage.value = res.data.message;
    fetchHocSinh();
  } catch (err: any) {
    if (err.response && err.response.data.message) {
      errorMessage.value = err.response.data.message;
    } else {
      errorMessage.value = 'Không thể xóa học sinh này!';
    }
  }
};

// Reset form
const resetForm = () => {
  form.value = {
    ho_ten: '',
    so_dien_thoai: '',
    gioi_tinh: '',
    ngay_sinh: '',
    dia_chi: '',
    so_phu_huynh: ''
  };
  Object.keys(errors).forEach(key => (errors[key] = ''));
};

onMounted(fetchHocSinh);
</script>

<template>
  <div>
    <h1 class="text-lg font-bold mb-4">Quản lý Học sinh</h1>
    <!-- Nút mở form -->
    <div class="mb-4">
      <Button @click="openAddForm">+ Thêm học sinh</Button>
    </div>
    <!-- Popup Lớp học -->
    <div v-if="showLopHocPopup" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <h2 class="font-bold text-lg mb-4">📚 Lớp học của học sinh</h2>

        <h3 class="font-semibold text-blue-600 mb-2">Đang học</h3>
        <ul class="list-disc pl-6 mb-4">
          <li v-for="lop in lopHocList.dangHoc" :key="lop.id">
            {{ lop.ten_lop }} 
          </li>
        </ul>

        <h3 class="font-semibold text-orange-600 mb-2">Sắp mở</h3>
        <ul class="list-disc pl-6 mb-4">
          <li v-for="lop in lopHocList.sapMo" :key="lop.id">
            {{ lop.ten_lop }} 
          </li>
        </ul>

        <div class="flex justify-end gap-2 mt-4">
          <Button variant="outline" @click="showLopHocPopup = false">Đóng</Button>
        </div>
      </div>
    </div>
    <!-- Form popup -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-[600px]">
        <h2 class="font-bold text-lg mb-4">
          {{ form.id ? 'Sửa Học sinh' : 'Thêm Học sinh' }}
        </h2>

        <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4">
          <div>
            <label>Họ tên</label>
            <Input type="text" v-model="form.ho_ten" />
            <small v-if="errors.ho_ten" class="text-red-500">{{ errors.ho_ten }}</small>
          </div>
          <div>
            <label>Số điện thoại</label>
            <Input type="text" v-model="form.so_dien_thoai" />
            <small v-if="errors.so_dien_thoai" class="text-red-500">{{ errors.so_dien_thoai }}</small>
          </div>
          <div>
            <label>Giới tính</label>
            <Input type="text" v-model="form.gioi_tinh" placeholder="Nam/Nữ" />
            <small v-if="errors.gioi_tinh" class="text-red-500">{{ errors.gioi_tinh }}</small>
          </div>
          <div>
            <label>Ngày sinh</label>
            <Input type="date" v-model="form.ngay_sinh" />
            <small v-if="errors.ngay_sinh" class="text-red-500">{{ errors.ngay_sinh }}</small>
          </div>
          <div>
            <label>Địa chỉ</label>
            <Input type="text" v-model="form.dia_chi" />
            <small v-if="errors.dia_chi" class="text-red-500">{{ errors.dia_chi }}</small>
          </div>
          <div>
            <label>SĐT Phụ huynh</label>
            <Input type="text" v-model="form.so_phu_huynh" />
            <small v-if="errors.so_phu_huynh" class="text-red-500">{{ errors.so_phu_huynh }}</small>
          </div>

          <div class="col-span-2 flex gap-2 justify-end mt-4">
            <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm học sinh' }}</Button>
            <Button type="button" variant="outline" @click="closeForm">Đóng</Button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="successMessage" class="mb-4 text-green-600 font-semibold">
      {{ successMessage }}
    </div>
    
    
    <div v-if="errorMessage" class="mb-4 text-red-600 font-semibold">
      {{ errorMessage }}
    </div>

    <div class="mb-4 flex gap-4">
      <Input
        type="text"
        v-model="keyword"
        placeholder="Tìm kiếm theo mã HS hoặc họ tên..."
        @input="fetchHocSinh"
        class="flex-1"
      />
      <Button type="button" variant="outline" @click="fetchHocSinh">Tìm kiếm</Button>
    </div>

    <DataTable :columns="columns" :data="hocSinhList"></DataTable>
  </div>
</template>
