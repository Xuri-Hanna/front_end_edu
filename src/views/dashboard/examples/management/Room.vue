<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import axios from 'axios';
import { DataTable, type ColumnDef } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button/Button.vue';
import { computed } from "vue";

// Danh sách phòng học
const phongHocList = ref<any[]>([]);

// Lịch sử dụng: cấu trúc { [idPhong]: { [thu]: { morning: boolean, afternoon: boolean, evening: boolean } } }
const schedule = ref<Record<string, any>>({});

// Danh sách các thứ
const days = ['T2','T3','T4','T5','T6','T7','CN'];

// Lưu lỗi validation
const errors = reactive<Record<string, string>>({});
const successMessage = ref('');
const messageType = ref<'success' | 'error'>('success');

// Định nghĩa cột bảng
const columns: ColumnDef<any>[] = [
  { accessorKey: 'id', header: 'Mã phòng' },
  { accessorKey: 'so_phong', header: 'Số phòng' },
  { accessorKey: 'vi_tri_phong', header: 'Vị trí' },
  { accessorKey: 'so_cho_ngoi', header: 'Số chỗ ngồi' },
  {
    accessorKey: 'gia_phong',
    header: 'Giá phòng',
    cell: ({ row }) => {
      const gia = row.original.gia_phong ?? 0;
      return new Intl.NumberFormat('vi-VN').format(gia) + ' VNĐ';
    }
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(Button, { variant: 'outline', onClick: () => editPhongHoc(row.original) }, 'Sửa'),
        h(Button, { variant: 'destructive', onClick: () => deletePhongHoc(row.original.id) }, 'Xóa')
      ])
  }
];

// Kiểu dữ liệu
interface PhongHocPayload {
  id?: string;
  so_phong: string;
  vi_tri_phong: string;
  so_cho_ngoi: number | null;
  gia_phong?: number | null;
  trang_thai?: string;
}

// Form nhập liệu
const form = ref<PhongHocPayload>({
  so_phong: '',
  vi_tri_phong: '',
  so_cho_ngoi: null,
  gia_phong: null,
});

// Lấy danh sách phòng học
const fetchPhongHoc = async () => {
  const response = await axios.get('http://127.0.0.1:8000/api/phong_hocs');
  phongHocList.value = response.data;

  // Khởi tạo lịch (nếu chưa có)
  phongHocList.value.forEach((p: any) => {
    if (!schedule.value[p.id]) {
      schedule.value[p.id] = {};
      days.forEach(day => {
        schedule.value[p.id][day] = { morning: false, afternoon: false, evening: false };
      });
    }
  });
};

// Validate form
const validateForm = () => {
  Object.keys(errors).forEach(key => (errors[key] = ''));
  let isValid = true;
  if (!form.value.so_phong) {
    errors.so_phong = 'Số phòng là bắt buộc';
    isValid = false;
  }
  if (!form.value.vi_tri_phong) {
    errors.vi_tri_phong = 'Vị trí phòng là bắt buộc';
    isValid = false;
  }
  if (!form.value.so_cho_ngoi || form.value.so_cho_ngoi <= 0) {
    errors.so_cho_ngoi = 'Số chỗ ngồi phải > 0';
    isValid = false;
  }
  if (!form.value.gia_phong) {
    errors.gia_phong = 'Giá phòng là bắt buộc';
    isValid = false;
  }
  return isValid;
};

// Thêm / cập nhật phòng học
const submitForm = async () => {
  successMessage.value = '';
  if (!validateForm()) return;

  try {
    if (form.value.id) {
      await axios.put(`http://127.0.0.1:8000/api/phong_hocs/${form.value.id}`, form.value);
      successMessage.value = 'Cập nhật phòng học thành công!';
      messageType.value = 'success';
    } else {
      await axios.post('http://127.0.0.1:8000/api/phong_hocs', form.value);
      successMessage.value = 'Thêm phòng học thành công!';
      messageType.value = 'success';
    }
    resetForm();
    fetchPhongHoc();
  } catch (err: any) {
    successMessage.value = 'Có lỗi xảy ra, vui lòng thử lại.';
    messageType.value = 'error';
  }
};

// Chỉnh sửa phòng học
const editPhongHoc = (ph: PhongHocPayload) => {
  form.value = { ...ph };
};

// Xóa phòng học
const deletePhongHoc = async (id: string) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/phong_hocs/${id}`);
    successMessage.value = 'Xóa phòng học thành công!';
    messageType.value = 'success';
    fetchPhongHoc();
  } catch (err: any) {
    successMessage.value = err.response?.data?.error || 'Không thể xóa phòng học!';
    messageType.value = 'error';
  }
};

// Reset form
const resetForm = () => {
  form.value = {
    so_phong: '',
    vi_tri_phong: '',
    so_cho_ngoi: null,
    gia_phong: null
  };
  Object.keys(errors).forEach(key => (errors[key] = ''));
};

//LỊCH PHÒNG HỌC

// Lấy lịch phòng từ backend
  const fetchSchedule = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/lich_phongs');
    const lichData = res.data;

    // Reset tất cả về false trước
    Object.keys(schedule.value).forEach(pid => {
      days.forEach(day => {
        schedule.value[pid][day].morning = false;
        schedule.value[pid][day].afternoon = false;
        schedule.value[pid][day].evening = false;
      });
    });

    // Map dữ liệu từ DB vào schedule
    lichData.forEach((lich: any) => {
      if (!schedule.value[lich.phong_id]) return;
      schedule.value[lich.phong_id][lich.thu][lich.buoi] = lich.trang_thai === 'Đang sử dụng';
    });
  };

  const updateSchedule = async (phongId: string, day: string, slot: string, value: boolean) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/lich_phong_updates', {
        phong_id: phongId,
        day: day,
        slot: slot,
        value: value ? 'Đang sử dụng' : 'Chưa sử dụng'
      });

      // Sau khi cập nhật, reload lại lịch từ DB để đồng bộ
      await fetchSchedule();
    } catch (e) {
      console.error('Lỗi khi cập nhật lịch:', e);
    }
  };
  const onCheckboxChange = (
    event: Event,
    phongId: string,
    day: string,
    slot: string
  ) => {
    const target = event.target as HTMLInputElement;
    updateSchedule(phongId, day, slot, target.checked);
  };
// Reset lịch về chưa tick
  const resetSchedule = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/lich_phong_resets');
      
      // reset lại toàn bộ trong frontend
      Object.keys(schedule.value).forEach(pid => {
        days.forEach(day => {
          schedule.value[pid][day].morning = false;
          schedule.value[pid][day].afternoon = false;
          schedule.value[pid][day].evening = false;
        });
      });

    } catch (e) {
      console.error('Lỗi khi reset lịch:', e);
    }
  };

// SCRIPT XEM PHÒNG
const showSchedule = ref(true);

const toggleSchedule = () => {
  showSchedule.value = !showSchedule.value;
};

const weekRange = computed(() => {
  const today = new Date();

  // Lấy thứ hiện tại (0=CN, 1=T2,..., 6=T7)
  const day = today.getDay();
  
  // Trong JS: getDay() CN = 0 → mình muốn tuần bắt đầu từ T2
  const diffToMonday = day === 0 ? -6 : 1 - day; // Nếu CN thì lùi 6 ngày, còn lại thì tính đến thứ 2
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (d: Date) =>
    d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  return `${format(monday)} - ${format(sunday)}`;
});


onMounted(async () => {
  await fetchPhongHoc();
  await fetchSchedule();
});

</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Nút chuyển -->
    <div class="flex justify-end mb-4">
      <Button @click="toggleSchedule()">
        {{ showSchedule ? 'Xem danh sách phòng' : 'Xem lịch phòng' }}
      </Button>
    </div>

    <!-- Container chứa 2 view, dùng transform để trượt -->
    <div
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: showSchedule ? 'translateX(0%)' : 'translateX(-100%)' }"
    >
      <!-- View 1: Lịch phòng -->
      <div class="w-full flex-shrink-0 pr-4">
        <h2 class="text-lg font-bold mb-2">
          Kê hoạch sử dụng phòng
          <span class="ml-2 text-gray-600 text-sm">({{ weekRange }})</span>
        </h2>
        <Button variant="destructive" class="mb-2" @click="resetSchedule">Reset Lịch</Button>

        <table class="table-auto border-collapse border border-gray-400 w-full text-center">
          <thead>
            <tr>
              <th class="border border-gray-400 px-2 py-1">Tên phòng</th>
              <th v-for="day in days" :key="day" colspan="3" class="border border-gray-400 px-2 py-1">{{ day }}</th>
            </tr>
            <tr>
              <th></th>
              <template v-for="day in days" :key="day + '-slots'">
                <th class="border border-gray-400">Sáng</th>
                <th class="border border-gray-400">Chiều</th>
                <th class="border border-gray-400">Tối</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="phong in phongHocList" :key="phong.id">
              <td class="border border-gray-400 px-2 py-1">{{ phong.so_phong }}</td>
              <template v-for="day in days" :key="phong.id + '-' + day">
                <td class="border border-gray-400">
                  <input
                    type="checkbox"
                    :checked="schedule[phong.id][day].morning"
                    @change="onCheckboxChange($event, phong.id, day, 'morning')"
                  />
                </td>
                <td class="border border-gray-400">
                  <input
                    type="checkbox"
                    :checked="schedule[phong.id][day].afternoon"
                    @change="onCheckboxChange($event, phong.id, day, 'afternoon')"
                  />
                </td>
                <td class="border border-gray-400">
                  <input
                    type="checkbox"
                    :checked="schedule[phong.id][day].evening"
                    @change="onCheckboxChange($event, phong.id, day, 'evening')"
                  />
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- View 2: Danh sách + form -->
      <div class="w-full flex-shrink-0 pl-4">
        <h1 class="text-lg font-bold mb-4">Quản lý Phòng học</h1>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label>Số phòng</label>
            <Input type="text" v-model="form.so_phong" />
            <small v-if="errors.so_phong" class="text-red-500">{{ errors.so_phong }}</small>
          </div>
          <div>
            <label>Vị trí phòng</label>
            <Input type="text" v-model="form.vi_tri_phong" />
            <small v-if="errors.vi_tri_phong" class="text-red-500">{{ errors.vi_tri_phong }}</small>
          </div>
          <div>
            <label>Số chỗ ngồi</label>
            <Input type="number" v-model="form.so_cho_ngoi" />
            <small v-if="errors.so_cho_ngoi" class="text-red-500">{{ errors.so_cho_ngoi }}</small>
          </div>
          <div>
            <label>Giá phòng</label>
            <Input type="number" v-model="form.gia_phong" />
            <small v-if="errors.gia_phong" class="text-red-500">{{ errors.gia_phong }}</small>
          </div>
          <div class="col-span-2 flex gap-2 mt-2">
            <Button type="submit">{{ form.id ? 'Cập nhật' : 'Thêm' }} Phòng học</Button>
            <Button type="button" variant="outline" @click="resetForm">Reset</Button>
          </div>
        </form>

        <p v-if="successMessage" :class="messageType === 'success' ? 'text-green-500' : 'text-red-500'">
          {{ successMessage }}
        </p>

        <!-- Bảng danh sách -->
        <DataTable :columns="columns" :data="phongHocList"></DataTable>
      </div>
    </div>
  </div>
</template>
<style></style>