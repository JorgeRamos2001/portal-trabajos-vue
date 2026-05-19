import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/empleos',
      name: 'empleos',
      component: () => import('@/views/EmpleosView.vue')
    },
    {
      path: '/empleos/:id',
      name: 'empleo-detalle',
      component: () => import('@/views/EmpleoDetallesView.vue')
    },
    {
      path: '/empresa/:id',
      name: 'perfil-empresa',
      component: () => import('@/views/PerfilEmpresaView.vue')
    },
    {
      path: '/recursos',
      name: 'recursos',
      component: () => import('@/views/RecursosView.vue')
    },
    {
      path: '/recursos/:id',
      name: 'recurso-detalle',
      component: () => import('@/views/RecursoDetalleView.vue')
    },
    {
      path: '/foro',
      name: 'foro',
      component: () => import('@/views/ForoView.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  // Importar dinámicamente para asegurar el estado fresco
  const { useAuthStore } = await import('@/stores/auth')
  const auth = useAuthStore()

  // Verificar sesión antes de decidir
  if (!auth.isLoggedIn && !auth.user) {
    await auth.checkSession()
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return '/'
  }
})

export default router