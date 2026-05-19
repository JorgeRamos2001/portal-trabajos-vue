<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const router = useRouter()
const auth = useAuthStore()

const stats = ref({
  empleosActivos: 0,
  empresasRegistradas: 0,
  postulantesRegistrados: 0
})

onMounted(async () => {
  try {
    const { data } = await api.get('/stats')
    stats.value = data.data
  } catch {
    // Si falla, muestra los valores por defecto (0)
  }
})

const form = ref({
  correo: '',
  password: ''
})

const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await auth.login(form.value.correo, form.value.password)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <!-- Navbar simple -->
    <nav class="bg-white border-b border-slate-200">
      <div class="container mx-auto px-4 h-16 flex items-center">
        <router-link to="/" class="text-xl font-extrabold text-blue-600" style="font-family: 'Sora', sans-serif;">
          Portal<span class="text-emerald-500">Trabajos</span>
        </router-link>
      </div>
    </nav>

    <!-- Contenido principal -->
    <div class="flex-1 flex">
      <!-- Lado izquierdo (solo desktop) -->
      <div class="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 relative overflow-hidden items-center justify-center p-16">        <div class="absolute w-80 h-80 bg-blue-500/20 rounded-full -bottom-20 -left-20 blur-3xl"></div>

        <div class="relative z-10 w-full">
          <h1 class="text-4xl font-extrabold text-white mb-3 leading-tight" style="font-family: 'Sora', sans-serif;">
            Bienvenido de<br/>vuelta
          </h1>
          <p class="text-white/60 text-lg mb-10">Tu próxima oportunidad te está esperando</p>

          <div class="space-y-4">
            <div class="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm">
              <span class="text-2xl">💼</span>
              <div>
                <div class="text-white font-bold text-lg" style="font-family: 'Sora', sans-serif;">{{ stats.empleosActivos.toLocaleString() }}+</div>
                <div class="text-white/60 text-sm">Empleos activos ahora mismo</div>
              </div>
            </div>
            <div class="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm">
              <span class="text-2xl">🏢</span>
              <div>
                <div class="text-white font-bold text-lg" style="font-family: 'Sora', sans-serif;">{{ stats.empresasRegistradas.toLocaleString() }}+</div>
                <div class="text-white/60 text-sm">Empresas buscando talento</div>
              </div>
            </div>
            <div class="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm">
              <span class="text-2xl">👤</span>
              <div>
                <div class="text-white font-bold text-lg" style="font-family: 'Sora', sans-serif;">{{ stats.postulantesRegistrados.toLocaleString() }}+</div>
                <div class="text-white/60 text-sm">Postulantes registrados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lado derecho (formulario) -->
      <div class="w-full lg:w-[480px] flex items-center justify-center p-8 bg-white">
        <div class="w-full max-w-[400px]">
          <!-- Logo y título -->
          <div class="text-center mb-6">
            <div class="text-2xl font-extrabold text-blue-600 mb-2" style="font-family: 'Sora', sans-serif;">
              Portal<span class="text-emerald-500">Trabajos</span>
            </div>
            <h2 class="text-xl font-bold text-slate-800 mb-1">Iniciar sesión</h2>
            <p class="text-slate-500 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          <!-- Mensaje de error -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {{ error }}
          </div>

          <!-- Formulario -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
              <input
                  v-model="form.correo"
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  class="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="text-sm font-medium text-slate-700">Contraseña</label>
                <a href="#" class="text-xs text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div class="relative">
                <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="••••••••"
                    class="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                />
                <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>

            <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style="font-family: 'Sora', sans-serif;"
            >
              <i class="bi bi-box-arrow-in-right me-2"></i>
              {{ loading ? 'Iniciando...' : 'Iniciar sesión' }}
            </button>
          </form>

          <p class="text-center text-slate-500 text-sm mt-6">
            ¿No tienes cuenta?
            <router-link to="/register" class="text-blue-600 font-semibold hover:underline">
              Regístrate gratis
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>