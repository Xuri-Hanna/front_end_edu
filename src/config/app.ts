
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
  category: {
    name: 'Danh mục',
    icon: 'AlignStartVertical',
    children: [
      {
        title: 'Loại khách hàng',
        icon: 'Users',
        path: 'customer_type',
      },
      {
        title: 'Loại dịch vụ',
        icon: 'CircleDollarSign',
        path: 'service_type',
      },
      {
        title: 'Loại khuyến mại',
        icon: 'Ticket',
        path: 'voucher_type',
      },
      
    ],
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
        title: 'Hóa đơn',
        icon: 'ReceiptText',
        path: 'receipt',
      },
      {
        title: 'Phản hồi',
        icon: 'MessageCircleReply',
        path: 'response',
      },
      {
        title: 'Thanh toán',
        icon: 'BadgeCent',
        path: 'payment',
      },
      {
        title: 'Dịch vụ',
        icon: 'Package',
        path: 'service',
      },
      {
        title: 'Giỏ hàng',
        icon: 'ShoppingCart',
        path: 'cart',
      },
      {
        title: 'Mã giảm giá',
        icon: 'Ticket',
        path: 'discount',
      },
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
    ],
  },
};

export const globalSearch = {

};
