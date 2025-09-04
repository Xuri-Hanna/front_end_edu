import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import DashboardLayoutVue from '@/layouts/dashboard.vue';
import AdminDashboardLayoutVue from '@/layouts/AdminLayouts.vue';
import NhanVienDashboardLayoutVue from '@/layouts/StaffLayouts.vue';
import GiaoVienDashboardLayoutVue from '@/layouts/TeacherLayouts.vue';
//import { useAuthStore } from '@/stores/auths'

interface IRouteMeta {
  title: string
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        requiresAuth: true,
        // role: 'CV01',
        title: 'Login',
      } as RouteMeta & IRouteMeta,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardLayoutVue,
      redirect: '/admin/dashboard',
      meta: {
        title: 'Trưởng phòng',
      },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/dashboard/examples/Home.vue'),
          meta: {
            title: 'Trang chủ',
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'tai_khoan',
          name: 'tai_khoan',
          component: () => import('@/views/dashboard/examples/system/Account.vue'),
          meta: {
            title: 'Tài khoản',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'nhan_vien',
          name: 'nhan_vien',
          component: () => import('@/views/dashboard/examples/employee/employee.vue'),
          meta: {
            title: 'Nhân Viên',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'giao_vien',
          name: 'giao_vien',
          component: () => import('@/views/dashboard/examples/employee/teacher.vue'),
          meta: {
            title: 'Giáo Viên',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'don_vi_cong_tac',
          name: 'admin-don_vi_cong_tac',
          component: () => import('@/views/dashboard/examples/system/workplace.vue'),
          meta: {
            title: 'Đơn vị công tác',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'chuc_vu',
          name: 'chuc_vu',
          component: () => import('@/views/dashboard/examples/system/Role.vue'),
          meta: {
            title: 'Chức vụ',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'hoc_sinh',
          name: 'admin-hoc_sinh',
          component: () => import('@/views/dashboard/examples/employee/student.vue'),
          meta: {
            title: 'Học sinh',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'phong_hoc',
          name: 'admin_phong_hoc',
          component: () => import('@/views/dashboard/examples/management/Room.vue'),
          meta: {
            title: 'Phòng học',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'mon_hoc',
          name: 'admin_mon_hoc',
          component: () => import('@/views/dashboard/examples/management/Subject.vue'),
          meta: {
            title: 'Môn học',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'nguoi_thue_phong',
          name: 'admin_nguoi_thue_phong',
          component: () => import('@/views/dashboard/examples/management/RentPeople.vue'),
          meta: {
            title: 'Người thuê phòng',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'lop_hoc',
          name: 'admin_lop_hoc',
          component: () => import('@/views/dashboard/examples/management/Classroom.vue'),
          meta: {
            title: 'Lớp học',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'lich_day',
          name: 'admin_lich_day',
          component: () => import('@/views/dashboard/examples/management/Schedule.vue'),
          meta: {
            title: 'Lịch dạy',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'hoa_don_hoc_phi',
          name: 'admin_hoa_don_hoc_phi',
          component: () => import('@/views/dashboard/examples/management/InvoiceStudent.vue'),
          meta: {
            title: 'Hóa đơn học phí',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'hop_dong_thue_phong',
          name: 'admin_hop_dong_thue_phong',
          component: () => import('@/views/dashboard/examples/management/ContractRent.vue'),
          meta: {
            title: 'Hợp đồng thuê phòng',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'phieu_thue_phong',
          name: 'admin_phieu_thue_phong',
          component: () => import('@/views/dashboard/examples/management/VoucherRental.vue'),
          meta: {
            title: 'Phiếu thuê phòng',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'hoa_don_thue_phong',
          name: 'admin_hoa_don_thue_phong',
          component: () => import('@/views/dashboard/examples/management/RentInvoice.vue'),
          meta: {
            title: 'Hóa đơn thuê phòng',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'thong_ke_thue_phong',
          name: 'admin_thong_ke_thue_phong',
          component: () => import('@/views/dashboard/examples/report/RentRoom.vue'),
          meta: {
            title: 'Thống kê tài chính',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'thong_ke_giao_duc',
          name: 'admin_thong_ke_giao_duc',
          component: () => import('@/views/dashboard/examples/report/Education.vue'),
          meta: {
            title: 'Thống kê tài chính',
          } as RouteMeta & IRouteMeta
        },
      ]
    },
    {
      path: '/staff',
      name: 'staff',
      component: NhanVienDashboardLayoutVue,
      redirect: '/staff/dashboard',
      meta: {
        title: 'Nhân viên',
      },
      children: [
        {
          path: 'dashboard',
          name: 'staff-dashboard',
          component: () => import('@/views/dashboard/examples/Home.vue'),
          meta: {
            title: 'Trang chủ',
          } as RouteMeta & IRouteMeta,
        },
        {
          path: 'hoc_sinh',
          name: 'staff-hoc_sinh',
          component: () => import('@/views/dashboard/examples/employee/student.vue'),
          meta: {
            title: 'Học sinh',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'don_vi_cong_tac',
          name: 'staff-don_vi_cong_tac',
          component: () => import('@/views/dashboard/examples/system/workplace.vue'),
          meta: {
            title: 'Đơn vị công tác',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'phong_hoc',
          name: 'staff_phong_hoc',
          component: () => import('@/views/dashboard/examples/management/Room.vue'),
          meta: {
            title: 'Phòng học',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'mon_hoc',
          name: 'staff_mon_hoc',
          component: () => import('@/views/dashboard/examples/management/Subject.vue'),
          meta: {
            title: 'Môn học',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'nguoi_thue_phong',
          name: 'staff_nguoi_thue_phong',
          component: () => import('@/views/dashboard/examples/management/RentPeople.vue'),
          meta: {
            title: 'Người thuê phòng',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'lop_hoc',
          name: 'staff_lop_hoc',
          component: () => import('@/views/dashboard/examples/management/Classroom.vue'),
          meta: {
            title: 'Lớp học',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'lich_day',
          name: 'staff_lich_day',
          component: () => import('@/views/dashboard/examples/management/Schedule.vue'),
          meta: {
            title: 'Lịch dạy',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'hoa_don_hoc_phi',
          name: 'staff_hoa_don_hoc_phi',
          component: () => import('@/views/dashboard/examples/management/InvoiceStudent.vue'),
          meta: {
            title: 'Hóa đơn học phí',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'hop_dong_thue_phong',
          name: 'staff_hop_dong_thue_phong',
          component: () => import('@/views/dashboard/examples/management/ContractRent.vue'),
          meta: {
            title: 'Hợp đồng thuê phòng',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'phieu_thue_phong',
          name: 'staff_phieu_thue_phong',
          component: () => import('@/views/dashboard/examples/management/VoucherRental.vue'),
          meta: {
            title: 'Phiếu thuê phòng',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'hoa_don_thue_phong',
          name: 'staff_hoa_don_thue_phong',
          component: () => import('@/views/dashboard/examples/management/RentInvoice.vue'),
          meta: {
            title: 'Hóa đơn thuê phòng',
          } as RouteMeta & IRouteMeta
        },
      ]
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: GiaoVienDashboardLayoutVue,
      redirect: '/teacher/dashboard',
      meta: {
        title: 'Giáo Viên',
      },
      children: [
        {
          path: 'dashboard',
          name: 'teacher-dashboard',
          component: () => import('@/views/dashboard/examples/Home.vue'),
          meta: {
            title: 'Trang chủ',
          } as RouteMeta & IRouteMeta,
        },
      ]
    },


    // {
    //   path: '/',
    //   redirect: '/dashboard/home',
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('@/views/Login.vue'),
    //   meta: {
    //     title: 'Login',
    //   } as RouteMeta & IRouteMeta,
    // },
    // {
    //   path: '/dashboard',
    //   component: DashboardLayoutVue,
    //   redirect: '/dashboard/home',
    //   meta: {
    //     title: 'Bảng điều khiển',
    //   },
    //   children: [
    //     {
    //       path: 'home',
    //       name: 'home',
    //       component: () => import('@/views/dashboard/examples/Home.vue'),
    //       meta: {
    //         title: 'Trang chủ',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'user',
    //       name: 'user',
    //       component: () => import('@/views/dashboard/examples/system/Employee.vue'),
    //       meta: {
    //         title: 'Người dùng',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'role',
    //       name: 'role',
    //       component: () => import('@/views/dashboard/examples/system/Role.vue'),
    //       meta: {
    //         title: 'Quyền',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'authorize',
    //       name: 'authorize',
    //       component: () => import('@/views/dashboard/examples/system/Authorize.vue'),
    //       meta: {
    //         title: 'Phân quyền',
    //       } as RouteMeta & IRouteMeta
    //     },

    //     {
    //       path: 'discount',
    //       name: 'discount',
    //       component: () => import('@/views/dashboard/examples/management/Discount.vue'),
    //       meta: {
    //         title: 'Mã giảm giá',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'vps',
    //       name: 'vps',
    //       component: () => import('@/views/dashboard/examples/service/Vps.vue'),
    //       meta: {
    //         title: 'VPS',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'domain',
    //       name: 'domain',
    //       component: () => import('@/views/dashboard/examples/service/Domain.vue'),
    //       meta: {
    //         title: 'Miền',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'hosting',
    //       name: 'hosting',
    //       component: () => import('@/views/dashboard/examples/service/Hosting.vue'),
    //       meta: {
    //         title: 'Hosting',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'account-vps',
    //       name: 'accountVps',
    //       component: () => import('@/views/dashboard/examples/account/VpsAccount.vue'),
    //       meta: {
    //         title: 'Tài khoản VPS',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'account-domain',
    //       name: 'accountDomain',
    //       component: () => import('@/views/dashboard/examples/account/DomainAccount.vue'),
    //       meta: {
    //         title: 'Tài khoản Domain',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'account-hosting',
    //       name: 'accountHosting',
    //       component: () => import('@/views/dashboard/examples/account/HostingAccount.vue'),
    //       meta: {
    //         title: 'Tài khoản Hosting',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'customer',
    //       name: 'Customer',
    //       component: () => import('@/views/dashboard/examples/management/User.vue'),
    //       meta: {
    //         title: 'Khách hàng',
    //       } as RouteMeta & IRouteMeta
    //     },
    //    {
    //       path: 'invoice',
    //       name: 'invoice',
    //       component: () => import('@/views/dashboard/examples/management/Invoice.vue'),
    //       meta: {
    //         title: 'Hóa đơn',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'order',
    //       name: 'order',
    //       component: () => import('@/views/dashboard/examples/management/Order.vue'),
    //       meta: {
    //         title: 'Đơn hàng',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'contract',
    //       name: 'contract',
    //       component: () => import('@/views/dashboard/examples/management/Contract.vue'),
    //       meta: {
    //         title: 'Hợp đồng',
    //       } as RouteMeta & IRouteMeta
    //     },
    //     {
    //       path: 'settings',
    //       name: 'settings_index',
    //       component: () => import('@/views/dashboard/examples/settings/Index.vue'),
    //       meta: {
    //         title: 'Settings',
    //       } as RouteMeta & IRouteMeta
    //     },
    //   ],
    // },
    {
      path: '/:pathMatch(.*)',
      name: 'not-found',
      component: () => import('@/views/404.vue'),
      meta: {
        title: 'Page Not Found',
      } as RouteMeta & IRouteMeta,
    },
  ]
});

router.beforeEach((to, from) => {
  document.title = to.meta.title as string;
})

//Guard: restore auth store first, then check


// router.beforeEach((to, from, next) => {
//   const auth = useAuthStore()
//   // restore from localStorage if needed
//   if (!auth.user) auth.loadFromStorage()

//   // if route requires auth and not logged in -> go to login
//   if (to.meta.requiresAuth && !auth.isLoggedIn) {
//     return next({ name: 'login' })
//   }

//   // if logged in but role mismatch -> redirect to their dashboard
//   if (to.meta.requiresAuth && auth.isLoggedIn) {
//     const requiredRole = to.meta.role as string | undefined
//     if (requiredRole && auth.role !== requiredRole) {
//       // redirect based on actual role
//       switch (auth.role) {
//         case 'CV01': return next({ name: 'admin-dashboard' })
//         case 'CV02': return next({ name: 'staff-dashboard' })
//         case 'CV03': return next({ name: 'teacher-dashboard' })
//         default: return next({ name: 'login' })
//       }
//     }
//   }
//   return next()
// })

export default router
