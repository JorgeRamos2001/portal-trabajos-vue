<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/auth'
import FooterPage from '@/components/FooterPage.vue'

const route = useRoute()
const auth = useAuthStore()
const empleo = ref(null)
const loading = ref(true)
const aplicando = ref(false)
const yaPostulado = ref(false)
const mensajeExito = ref('')
const mensajeError = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get(`/empleos/${route.params.id}`)
    empleo.value = data.data
  } catch {}

  // Verificar si ya aplicó
  if (auth.isLoggedIn && auth.user?.rol === 'postulante') {
    try {
      const { data } = await api.get('/postulaciones/mis-aplicaciones')
      const postulaciones = data.postulaciones || data.data || []
      yaPostulado.value = postulaciones.some(p => p.idEmpleo == route.params.id)
    } catch {}
  }

  loading.value = false
})

async function aplicar() {
  if (aplicando.value || yaPostulado.value) return
  aplicando.value = true
  mensajeError.value = ''
  try {
    await api.post('/empleos/postularse', { idEmpleo: empleo.value.id })
    yaPostulado.value = true
    mensajeExito.value = '¡Postulación enviada exitosamente!'
  } catch (e) {
    mensajeError.value = e.response?.data?.message || 'Ocurrió un error al postularse.'
  }
  aplicando.value = false
}

function formatearSalario(min, max) {
  return `$${Number(min).toLocaleString()} – $${Number(max).toLocaleString()}/mes`
}

function formatearFecha(fecha) {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-SV', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">

    <div class="max-w-6xl mx-auto px-4 py-6 flex-1">

      <!-- Breadcrumb -->
      <nav class="text-sm text-slate-500 mb-4">
        <router-link to="/" class="text-blue-600 hover:underline">Inicio</router-link> ›
        <router-link to="/empleos" class="text-blue-600 hover:underline">Empleos</router-link> ›
        <span class="text-slate-700">{{ empleo?.titulo }}</span>
      </nav>

      <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

      <div v-else-if="empleo" class="grid lg:grid-cols-3 gap-6">

        <!-- Contenido principal -->
        <div class="lg:col-span-2 space-y-5">

          <!-- Header -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-6">
            <div class="flex gap-4">
              <div class="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-3xl flex-shrink-0">🏢</div>
              <div class="flex-1">
                <h1 class="text-xl font-bold text-slate-800 mb-1" style="font-family: 'Sora', sans-serif;">{{ empleo.titulo }}</h1>
                <p class="text-blue-600 font-semibold text-sm">{{ empleo.empresa }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span class="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1 text-sm flex items-center gap-1">📍 {{ empleo.ubicacion }}</span>
                  <span class="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1 text-sm">💼 {{ empleo.modalidad }}</span>
                  <span class="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1 text-sm">🕐 Publicado {{ formatearFecha(empleo.fechaPublicacion) }}</span>
                </div>
              </div>
            </div>
            <hr class="my-4 border-slate-200" />
            <div class="flex justify-between items-center flex-wrap gap-3">
              <div>
                <div class="text-slate-500 text-sm mb-0.5">Rango salarial</div>
                <div class="text-2xl font-extrabold text-emerald-600" style="font-family: 'Sora', sans-serif;">{{ formatearSalario(empleo.salarioMin, empleo.salarioMax) }}</div>
              </div>
              <div class="text-right">
                <div class="text-slate-500 text-sm mb-0.5">Cierre de aplicaciones</div>
                <div class="bg-amber-100 text-amber-800 rounded-lg px-3 py-1.5 text-sm font-semibold">📅 {{ formatearFecha(empleo.fechaVencimiento) }}</div>
              </div>
            </div>
          </div>

          <!-- Descripción -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-6">
            <h5 class="font-bold text-slate-800 mb-3 pb-2 border-b" style="font-family: 'Sora', sans-serif;">📄 Descripción del puesto</h5>
            <p class="text-slate-600 whitespace-pre-line">{{ empleo.descripcion }}</p>
          </div>

          <!-- Requisitos -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-6">
            <h5 class="font-bold text-slate-800 mb-3 pb-2 border-b" style="font-family: 'Sora', sans-serif;">✅ Requisitos</h5>
            <p class="text-slate-600 whitespace-pre-line">{{ empleo.requisitos }}</p>
          </div>

          <!-- Funciones -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-6">
            <h5 class="font-bold text-slate-800 mb-3 pb-2 border-b" style="font-family: 'Sora', sans-serif;">📋 Funciones</h5>
            <p class="text-slate-600 whitespace-pre-line">{{ empleo.funciones }}</p>
          </div>

        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-20 space-y-4">

            <!-- Apply card -->
            <div class="bg-white border-2 border-slate-200 rounded-2xl p-6">
              <div class="text-xl font-extrabold text-emerald-600 mb-1" style="font-family: 'Sora', sans-serif;">{{ formatearSalario(empleo.salarioMin, empleo.salarioMax) }}</div>
              <p class="text-slate-500 text-sm mb-4">Salario bruto mensual en USD</p>

              <!-- No logueado -->
              <div v-if="!auth.isLoggedIn" class="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm">
                ℹ️ Debes <router-link to="/login" class="font-bold hover:underline">iniciar sesión</router-link> o
                <router-link to="/register" class="font-bold hover:underline">registrarte</router-link> para aplicar.
              </div>

              <!-- Es empleador o admin -->
              <div v-else-if="auth.user?.rol !== 'postulante'" class="bg-slate-50 border border-slate-200 text-slate-500 rounded-lg px-4 py-3 text-sm text-center">
                Solo los postulantes pueden aplicar a empleos.
              </div>

              <!-- Ya postulado -->
              <div v-else-if="yaPostulado" class="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm text-center font-semibold">
                ✅ Ya te has postulado a este empleo
              </div>

              <!-- Puede aplicar -->
              <div v-else>
                <div v-if="mensajeExito" class="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm mb-3 text-center font-semibold">
                  {{ mensajeExito }}
                </div>
                <div v-if="mensajeError" class="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-3">
                  {{ mensajeError }}
                </div>
                <button @click="aplicar" :disabled="aplicando"
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl py-3 transition text-sm">
                  {{ aplicando ? 'Enviando postulación...' : '🚀 Aplicar ahora' }}
                </button>
              </div>
            </div>

            <!-- Company card -->
            <div class="bg-white border-2 border-slate-200 rounded-2xl p-5">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">🏢</div>
                <div>
                  <div class="font-bold text-slate-800">{{ empleo.empresa }}</div>
                  <div class="text-slate-500 text-sm">{{ empleo.categoria }} · {{ empleo.ubicacion }}</div>
                </div>
              </div>
              <router-link :to="`/empresa/${empleo.idEmpresa}`" class="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-center font-semibold rounded-lg py-2 transition text-sm block">
                Ver perfil de empresa
              </router-link>
            </div>

          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-slate-400">Empleo no encontrado</div>
    </div>

    <FooterPage />
  </div>
</template>