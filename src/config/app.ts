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

// export const APP_MENU: Record<string, Menu> = {
//   system: {
//     name: 'Hệ thống',
//     icon: 'Home',
//     children: [
//       {
//         title: 'Người dùng',
//         icon: 'User',
//         path: '',
//       },
//       {
//         title: 'Quyền',
//         icon: 'UserPlus',
//         path: '',
//       },
//       {
//         title: 'Phân Quyền',
//         icon: 'UserCog',
//         path: '',
//       },

//     ],
//   },
//   service: {
//     name: 'Dịch vụ',
//     icon: 'Package',
//     children: [
//       {
//         title: 'VPS',
//         icon: 'Waypoints',
//         path: '',
//       },
//       {
//         title: 'Hosting',
//         icon: 'Computer',
//         path: '',
//       },
//       {
//         title: 'Miền',
//         icon: 'MemoryStick',
//         path: '',
//       },
//     ]
//   },

//   account: {
//     name: 'Tài khoản',
//     icon: 'UserCog',
//     children: [
//       {
//         title: 'Tài khoản hosting',
//         icon: 'BetweenHorizontalEnd',
//         path: ''
//       },
//       {
//         title: 'Tài khoản domain',
//         icon: 'BetweenHorizontalEnd',
//         path: ''
//       },
//       {
//         title: 'Tài khoản vps',
//         icon: 'BetweenHorizontalEnd',
//         path: ''
//       },

//     ]
//   },
//   management: {
//     name: 'Quản lý',
//     icon: 'AppWindow',
//     children: [
//       {
//         title: 'Khách hàng',
//         icon: 'BookUser',
//         path: '',
//       },
//       {
//         title: 'Hóa đơn',
//         icon: 'ReceiptText',
//         path: '',
//       },
//       {
//         title: 'Đơn hàng',
//         icon: 'ReceiptText',
//         path: '',
//       },
//       {
//         title: 'Hợp đồng',
//         icon: 'ReceiptText',
//         path: '',
//       },
//       {
//         title: 'Mã giảm giá',
//         icon: 'ReceiptText',
//         path: '',
//       },
//     ],
//   },
// };

export const ADMIN_MENU: Record<string, Menu> = {
  account: {
    name: 'Tài khoản',
    icon: 'UserCog',
    children: [
      {
        title: 'Danh sách tài khoản',
        icon: 'BetweenHorizontalEnd',
        path: 'tai_khoan'
      },
      {
        title: 'Nhân viên',
        icon: 'User',
        path: 'nhan_vien'
      },
      {
        title: 'Giáo viên',
        icon: 'User',
        path: 'giao_vien'
      },
      {
        title: 'Chức vụ',
        icon: 'BetweenHorizontalEnd',
        path: 'chuc_vu'
      },

    ]
  },

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
        icon: 'MemoryStick',
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
        icon: 'User',
        path: 'hoa_don_hoc_phi'
      },
      {
        title: 'Hóa đơn thuê phòng',
        icon: 'User',
        path: 'hoa_don_thue_phong'
      },
      {
        title: 'Hợp đồng thuê phòng',
        icon: 'User',
        path: 'hop_dong_thue_phong'
      },
      {
        title: 'Phiếu thuê phòng',
        icon: 'User',
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
        icon: 'User',
        path: ''
      },
      {
        title: 'Thống kê học sinh',
        icon: 'User',
        path: ''
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
        icon: 'MemoryStick',
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
        icon: 'User',
        path: 'hoa_don_hoc_phi'
      },
      {
        title: 'Hóa đơn thuê phòng',
        icon: 'User',
        path: 'hoa_don_thue_phong'
      },
      {
        title: 'Hợp đồng thuê phòng',
        icon: 'User',
        path: 'hop_dong_thue_phong'
      },
      {
        title: 'Phiếu thuê phòng',
        icon: 'User',
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
        icon: 'User',
        path: ''
      },
      {
        title: 'Thống kê học sinh',
        icon: 'User',
        path: ''
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
        path: ''
      },
      {
        title: 'Lịch dạy',
        icon: 'BetweenHorizontalEnd',
        path: ''
      },
    ]
  },
}

export function getMenuByRole(role?: string) {
  switch (role) {
    case 'CV01': return ADMIN_MENU
    case 'CV02': return STAFF_MENU
    case 'CV03': return TEACHER_MENU
    default: return {}
  };
}

export const globalSearch = {

};
