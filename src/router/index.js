import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Públicas
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
    },
    {
      path: '/foro/nuevo',
      name: 'foro-nuevo',
      component: () => import('@/views/NuevoHiloView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/foro/:id',
      name: 'foro-detalle',
      component: () => import('@/views/ForoDetalleView.vue')
    },

    // Postulante
    {
      path: '/mi-perfil',
      name: 'mi-perfil',
      component: () => import('@/views/MiPerfilView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mis-postulaciones',
      name: 'mis-postulaciones',
      component: () => import('@/views/MisPostulacionesView.vue'),
      meta: { requiresAuth: true }
    },

    // Empleador
    {
      path: '/mi-perfil-empresa',
      name: 'mi-perfil-empresa',
      component: () => import('@/views/MiPerfilEmpresaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mis-empleos',
      name: 'mis-empleos',
      component: () => import('@/views/MisEmpleosView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/publicar-empleo',
      name: 'publicar-empleo',
      component: () => import('@/views/PublicarEmpleoView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mis-empleos/:id/postulantes',
      name: 'postulantes-empleo',
      component: () => import('@/views/PostulantesEmpleoView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/aplicaciones',
      name: 'aplicaciones-empresa',
      component: () => import('@/views/AplicacionesEmpresaView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/candidato/:id',
      name: 'perfil-candidato',
      component: () => import('@/views/PerfilPublicoPostulante.vue')
    },

    // Admin
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/usuarios',
      name: 'admin-usuarios',
      component: () => import('@/views/AdminUsuariosView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/empleos',
      name: 'admin-empleos',
      component: () => import('@/views/AdminEmpleosView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/foro',
      name: 'admin-foro',
      component: () => import('@/views/AdminForoView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/recursos',
      name: 'admin-recursos',
      component: () => import('@/views/AdminRecursosView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Guard de navegación
router.beforeEach(async (to) => {
  const { useAuthStore } = await import('@/stores/auth')
  const auth = useAuthStore()

  if (!auth.isLoggedIn && !auth.user) {
    await auth.checkSession()
  }

  // Redirigir login/register si ya está autenticado
  if (to.meta.guestOnly && auth.isLoggedIn) return '/'

  // Redirigir a login si requiere autenticación
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
})

export default router