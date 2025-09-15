// import { constants } from "buffer"

interface Menu {
  name: string
  hidden?: boolean,
  icon: string
  children: SubMenu[]
}
interface SubMenu {
  title: string,
  icon: string,
  path: string
  description?: string
}
export const SIDEBAR_EXPAND_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const ADMIN_MENU: Record<string, Menu> = {
  account: {
    name: 'Hệ thống',
    icon: 'UserCog',
    children: [
      {
        title: 'Danh sách tài khoản',
        icon: 'Computer',
        path: 'tai_khoan'
      },
      {
        title: 'Nhân viên',
        icon: 'User',
        path: 'nhan_vien'
      },
      {
        title: 'Chức vụ',
        icon: 'BetweenHorizontalEnd',
        path: 'chuc_vu'
      },

    ]
  },

  management_all: {
    name: 'Quản lý giáo viên',
    icon: 'UserCog',
    children: [

      {
        title: 'Đơn vị công tác',
        icon: 'User',
        path: 'don_vi_cong_tac'
      },
      {
        title: 'Giáo viên',
        icon: 'User',
        path: 'giao_vien'
      },

    ]
  },
  management: {
    name: 'Quản lý giáo dục',
    icon: 'UserCog',
    children: [
      {
        title: 'Lớp học',
        icon: 'BetweenHorizontalEnd',
        path: 'lop_hoc'
      },
      {
        title: 'Lịch dạy',
        icon: 'BetweenHorizontalEnd',
        path: 'lich_day'
      },
      {
        title: 'Phòng học',
        icon: 'BetweenHorizontalEnd',
        path: 'phong_hoc'
      },
      {
        title: 'Học sinh',
        icon: 'BetweenHorizontalEnd',
        path: 'hoc_sinh',
      },
      {
        title: 'Môn học',
        icon: 'BetweenHorizontalEnd',
        path: 'mon_hoc'
      },
      {
        title: 'Hóa đơn học phí',
        icon: 'ReceiptText',
        path: 'hoa_don_hoc_phi'
      },
    ]
  },
  service: {
    name: 'Quản lý thuê phòng',
    icon: 'UserCog',
    children: [
      {
        title: 'Người thuê phòng',
        icon: 'BetweenHorizontalEnd',
        path: 'nguoi_thue_phong'
      },
      {
        title: 'Hóa đơn thuê phòng',
        icon: 'ReceiptText',
        path: 'hoa_don_thue_phong'
      },
      {
        title: 'Hợp đồng thuê phòng',
        icon: 'ReceiptText',
        path: 'hop_dong_thue_phong'
      },
      {
        title: 'Phiếu thuê phòng',
        icon: 'ReceiptText',
        path: 'phieu_thue_phong'
      },
    ]
  },
  statistical: {
    name: 'Thống kê báo cáo',
    icon: 'UserCog',
    children: [
      {
        title: 'Thống kê thuê phòng',
        icon: 'Waypoints',
        path: 'thong_ke_thue_phong'
      },
      {
        title: 'Thống kê giáo dục',
        icon: 'Waypoints',
        path: 'thong_ke_giao_duc'
      },
    ]
  }
}

export const STAFF_MENU: Record<string, Menu> = {
  management_all: {
    name: 'Quản lý chung',
    icon: 'UserCog',
    children: [
      {
        title: 'Đơn vị công tác',
        icon: 'User',
        path: 'don_vi_cong_tac'
      },

    ]
  },
  management: {
    name: 'Quản lý',
    icon: 'UserCog',
    children: [
      {
        title: 'Lớp học',
        icon: 'BetweenHorizontalEnd',
        path: 'lop_hoc'
      },
      {
        title: 'Lịch dạy',
        icon: 'BetweenHorizontalEnd',
        path: 'lich_day'
      },
      {
        title: 'Phòng học',
        icon: 'BetweenHorizontalEnd',
        path: 'phong_hoc'
      },
      {
        title: 'Học sinh',
        icon: 'BetweenHorizontalEnd',
        path: 'hoc_sinh',
      },
      {
        title: 'Môn học',
        icon: 'BetweenHorizontalEnd',
        path: 'mon_hoc'
      },
      {
        title: 'Người thuê phòng',
        icon: 'BetweenHorizontalEnd',
        path: 'nguoi_thue_phong'
      },
    ]
  },
  service: {
    name: 'Thanh toán',
    icon: 'UserCog',
    children: [
      {
        title: 'Hóa đơn học phí',
        icon: 'ReceiptText',
        path: 'hoa_don_hoc_phi'
      },
      {
        title: 'Hóa đơn thuê phòng',
        icon: 'ReceiptText',
        path: 'hoa_don_thue_phong'
      },
      {
        title: 'Hợp đồng thuê phòng',
        icon: 'ReceiptText',
        path: 'hop_dong_thue_phong'
      },
      {
        title: 'Phiếu thuê phòng',
        icon: 'ReceiptText',
        path: 'phieu_thue_phong'
      },
    ]
  },
  statistical: {
    name: 'Thống kê báo cáo',
    icon: 'UserCog',
    children: [
      {
        title: 'Thống kê học phí',
        icon: 'Waypoints',
        path: 'thong_ke_thue_phong'
      },
      {
        title: 'Thống kê học sinh',
        icon: 'Waypoints',
        path: 'thong_ke_giao_duc'
      },
    ]
  }
}

export const TEACHER_MENU: Record<string, Menu> = {
  management: {
    name: 'Quản lý',
    icon: 'UserCog',
    children: [
      {
        title: 'Lớp học',
        icon: 'BetweenHorizontalEnd',
        path: 'lop_hoc'
      },
      {
        title: 'Lịch dạy',
        icon: 'BetweenHorizontalEnd',
        path: 'lich_day'
      },
    ]
  },
}

export function getMenuByRole(role?: string) {
  switch (role) {
    case 'CV001': return ADMIN_MENU
    case 'CV002': return STAFF_MENU
    case 'CV003': return TEACHER_MENU
    default: return {}
  };
}

export const globalSearch = {

};
