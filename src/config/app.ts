
interface Menu {
  name: string
  hidden?: boolean,
  icon : string
  children : SubMenu[]
}
interface SubMenu {
  title : string,
  icon : string,
  path : string
  description? : string
}
export const SIDEBAR_EXPAND_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const APP_MENU: Record<string,Menu> = {
  system: {
    name: 'Hệ thống',
    icon: 'Home',
    children: [
      {
        title: 'Người dùng',
        icon: 'User',
        path: 'user',
      },
      {
        title: 'Quyền',
        icon: 'UserPlus',
        path: 'role',
      },
      {
        title: 'Phân Quyền',
        icon: 'UserCog',
        path: 'authorize',
      },
      
    ],
  },
  service: {
    name: 'Dịch vụ',
    icon: 'Package',
    children: [
      {
        title: 'VPS',
        icon: 'Waypoints',
        path: 'vps',
      },
      {
        title: 'Hosting',
        icon: 'Computer',
        path: 'hosting',
      },
      {
        title: 'Miền',
        icon: 'MemoryStick',
        path: 'domain',
      },
    ]
  },
  management: {
    name: 'Quản lý',
    icon: 'AppWindow',
    children: [
      {
        title: 'Khách hàng',
        icon: 'BookUser',
        path: 'customer',
      },
      {
        title: 'Đơn hàng',
        icon: 'Package2',
        path: 'order',
      },
      {
        title: 'Hóa đơn',
        icon: 'ReceiptText',
        path: 'invoice',
      },
      {
        title: 'Hợp đồng',
        icon: 'Contact',
        path: 'contract',
      },
    ],
  },
  account: {
    name: 'Tài khoản',
    icon: 'UserCog',
    children: [
      {
        title: 'Tài khoản hosting',
        icon: 'BetweenHorizontalEnd',
        path: 'account-hosting'
      },
      {
        title: 'Tài khoản domain',
        icon: 'BetweenHorizontalEnd',
        path: 'account-domain'
      },
      {
        title: 'Tài khoản vps',
        icon: 'BetweenHorizontalEnd',
        path: 'account-vps'
      },

    ]
  }
};

export const globalSearch = {

};
