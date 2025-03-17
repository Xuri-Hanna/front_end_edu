import { createRouter, createWebHistory, type RouteMeta } from 'vue-router'
import DashboardLayoutVue from '@/layouts/dashboard.vue';

interface IRouteMeta {
  title: string
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard/home',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: 'Login',
      } as RouteMeta & IRouteMeta,
    },
    {
      path: '/dashboard',
      component: DashboardLayoutVue,
      redirect: '/dashboard/home',
      meta: {
        title: 'Dashboard',
      },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/dashboard/examples/Home.vue'),
          meta: {
            title: 'Home',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'task',
          name: 'tasks_index',
          component: () => import('@/views/dashboard/examples/tasks/Index.vue'),
          meta: {
            title: 'Tasks',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/dashboard/examples/system/User.vue'),
          meta: {
            title: 'User',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('@/views/dashboard/examples/system/Role.vue'),
          meta: {
            title: 'Role',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'authorize',
          name: 'authorize',
          component: () => import('@/views/dashboard/examples/system/Authorize.vue'),
          meta: {
            title: 'Authorize',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'customer_type',
          name: 'customerType',
          component: () => import('@/views/dashboard/examples/category/CustomerType.vue'),
          meta: {
            title: 'Customer Type',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'service_type',
          name: 'serviceType',
          component: () => import('@/views/dashboard/examples/category/ServiceType.vue'),
          meta: {
            title: 'Service Type',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'discount',
          name: 'discount',
          component: () => import('@/views/dashboard/examples/customer/Discount.vue'),
          meta: {
            title: 'Discount',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'vps',
          name: 'vps',
          component: () => import('@/views/dashboard/examples/customer/VPS.vue'),
          meta: {
            title: 'VPS',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'domain',
          name: 'domain',
          component: () => import('@/views/dashboard/examples/customer/Domain.vue'),
          meta: {
            title: 'Domain',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'hosting',
          name: 'hosting',
          component: () => import('@/views/dashboard/examples/customer/Hosting.vue'),
          meta: {
            title: 'Hosting',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'customer',
          name: 'Customer',
          component: () => import('@/views/dashboard/examples/customer/Customer.vue'),
          meta: {
            title: 'Customer',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'receipt',
          name: 'Receipt',
          component: () => import('@/views/dashboard/examples/customer/Receipt.vue'),
          meta: {
            title: 'Receipt',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'response',
          name: 'Response',
          component: () => import('@/views/dashboard/examples/customer/Response.vue'),
          meta: {
            title: 'Response',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'payment',
          name: 'Payment',
          component: () => import('@/views/dashboard/examples/customer/Payment.vue'),
          meta: {
            title: 'Payment',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'cart',
          name: 'Cart',
          component: () => import('@/views/dashboard/examples/customer/Cart.vue'),
          meta: {
            title: 'Cart',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'cart/:id',
          name: 'CartDetail',
          component: () => import('@/views/dashboard/examples/customer/CartDetail.vue'),
          meta: {
            title: 'CartDetail',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'service',
          name: 'service',
          component: () => import('@/views/dashboard/examples/customer/Service.vue'),
          meta: {
            title: 'Service',
          } as RouteMeta & IRouteMeta
        },
        {
          path: 'settings',
          name: 'settings_index',
          component: () => import('@/views/dashboard/examples/settings/Index.vue'),
          meta: {
            title: 'Settings',
          } as RouteMeta & IRouteMeta
        },
      ],
    },
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

router.beforeEach((to,from) => {
  document.title = to.meta.title as string;
})

export default router
