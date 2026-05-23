<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import NavbarPublic from '@/components/NavbarPublic.vue'
import FooterPage from '@/components/FooterPage.vue'
import EmpleoCard from "@/components/EmpleoCard.vue";

const route = useRoute()
const auth = useAuthStore()

const empresa = ref(null)
const empleos = ref([])
const totalEmpleos = ref(0)
const valoraciones = ref([])
const estadisticas = ref({ totalValoraciones: 0, promedio: 0 })
const loading = ref(true)
const tabActivo = ref('sobre')

// Valoración
const mostrarFormValoracion = ref(false)
const nuevaValoracion = ref({ puntuacion: 5, comentario: '' })
const enviandoValoracion = ref(false)
const errorValoracion = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get(`/usuarios/publico/empresa/${route.params.id}`)
    empresa.value = data.data
  } catch {}

  await Promise.all([
    cargarEmpleos(),
    cargarValoraciones()
  ])

  loading.value = false
})

async function cargarEmpleos() {
  try {
    const { data } = await api.get('/empleos', { params: { empresa: route.params.id, limite: 10 } })
    empleos.value = data.empleos || []
    totalEmpleos.value = data.paginacion?.total || 0
  } catch {}
}

async function cargarValoraciones() {
  try {
    const { data } = await api.get(`/valoraciones/empresa/${route.params.id}`)
    valoraciones.value = data.data.valoraciones || []
    estadisticas.value = data.data.estadisticas || { totalValoraciones: 0, promedio: 0 }
  } catch {}
}

async function enviarValoracion() {
  errorValoracion.value = ''
  enviandoValoracion.value = true
  try {
    await api.post(`/valoraciones/empresa/${route.params.id}`, nuevaValoracion.value)
    mostrarFormValoracion.value = false
    nuevaValoracion.value = { puntuacion: 5, comentario: '' }
    await cargarValoraciones()
  } catch (err) {
    errorValoracion.value = err.response?.data?.message || 'Error al enviar valoración'
  }
  enviandoValoracion.value = false
}

function estrellas(n) {
  return '⭐'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))
}

function formatearSalario(min, max) {
  return `$${Number(min).toLocaleString()} – $${Number(max).toLocaleString()}/mes`
}

function tiempoRelativo(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Hace 1 día'
  return `Hace ${diff} días`
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">

    <!-- Cover -->
    <div class="h-48 bg-gradient-to-br from-slate-900 to-blue-600"></div>

    <div class="max-w-5xl mx-auto px-4 -mt-10">

      <!-- Header -->
      <div class="bg-white border-2 border-slate-200 rounded-b-2xl px-6 pb-6 pt-4 mb-6">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="flex items-end gap-4">
            <div class="w-24 h-24 rounded-2xl bg-white shadow-lg border-4 border-white flex items-center justify-center text-5xl -mt-16">🏢</div>
            <div class="pb-1">
              <h1 class="text-2xl font-extrabold text-slate-800" style="font-family: 'Sora', sans-serif;">{{ empresa?.nombreComercial }}</h1>
              <p class="text-slate-500 text-sm">{{ empresa?.sector }} · {{ empresa?.tipoEmpresa }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="bg-white border-2 border-slate-200 rounded-xl p-5 text-center">
          <h4 class="text-xl font-extrabold text-blue-600">{{ totalEmpleos }}</h4>
          <div class="text-slate-500 text-xs">Empleos activos</div>
        </div>
        <div class="bg-white border-2 border-slate-200 rounded-xl p-5 text-center">
          <h4 class="text-xl font-extrabold text-blue-600">{{ empresa?.ubicacion?.split(',')[0] || '—' }}</h4>
          <div class="text-slate-500 text-xs">Ubicación</div>
        </div>
        <div class="bg-white border-2 border-slate-200 rounded-xl p-5 text-center">
          <h4 class="text-xl font-extrabold text-amber-500">{{ estadisticas.promedio || '—' }}</h4>
          <div class="text-slate-500 text-xs">{{ estrellas(estadisticas.promedio || 0) }}</div>
        </div>
        <div class="bg-white border-2 border-slate-200 rounded-xl p-5 text-center">
          <h4 class="text-xl font-extrabold text-blue-600">{{ estadisticas.totalValoraciones }}</h4>
          <div class="text-slate-500 text-xs">Valoraciones</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-slate-200 bg-white rounded-t-xl px-2 mb-6">
        <button @click="tabActivo = 'sobre'" :class="tabActivo === 'sobre' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
                class="px-5 py-3 text-sm font-semibold border-b-2 transition" style="font-family: 'Sora', sans-serif;">Sobre nosotros</button>
        <button @click="tabActivo = 'empleos'" :class="tabActivo === 'empleos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
                class="px-5 py-3 text-sm font-semibold border-b-2 transition" style="font-family: 'Sora', sans-serif;">Empleos ({{ totalEmpleos }})</button>
        <button @click="tabActivo = 'valoraciones'" :class="tabActivo === 'valoraciones' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'"
                class="px-5 py-3 text-sm font-semibold border-b-2 transition" style="font-family: 'Sora', sans-serif;">Valoraciones ({{ estadisticas.totalValoraciones }})</button>
      </div>

      <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

      <div v-else-if="empresa" class="grid lg:grid-cols-3 gap-6">

        <!-- Contenido principal -->
        <div class="lg:col-span-2 mb-5">

          <!-- Sobre nosotros -->
          <div v-if="tabActivo === 'sobre'" class="bg-white border-2 border-slate-200 rounded-2xl p-6">
            <h5 class="font-bold text-slate-800 mb-4 pb-3 border-b" style="font-family: 'Sora', sans-serif;">🏢 Sobre {{ empresa.nombreComercial }}</h5>
            <p class="text-slate-600 whitespace-pre-line">{{ empresa.descripcion || 'Sin descripción disponible.' }}</p>
            <div class="mt-4">
              <span class="text-slate-500 text-sm">📞 {{ empresa.telefono }}</span>
              <span class="text-slate-500 text-sm ml-4">✉️ {{ empresa.correoContacto }}</span>
            </div>
          </div>

          <!-- Empleos -->
          <div v-if="tabActivo === 'empleos'">
            <div v-if="empleos.length > 0" class="space-y-4">
              <EmpleoCard v-for="emp in empleos" :key="emp.id" :empleo="emp" />
            </div>
            <div v-else class="bg-white border-2 border-slate-200 rounded-2xl p-6 text-center text-slate-400">
              No hay empleos activos por ahora
            </div>
          </div>

          <!-- Valoraciones -->
          <div v-if="tabActivo === 'valoraciones'">
            <!-- Botón valorar -->
            <div class="mb-4">
              <button v-if="auth.isLoggedIn && auth.user?.rol === 'postulante' && !mostrarFormValoracion"
                      @click="mostrarFormValoracion = true"
                      class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition" style="font-family: 'Sora', sans-serif;">
                ⭐ Valorar empresa
              </button>
            </div>

            <!-- Formulario -->
            <div v-if="mostrarFormValoracion" class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div v-if="errorValoracion" class="bg-red-100 border border-red-300 text-red-700 rounded-lg px-3 py-2 mb-3 text-sm">{{ errorValoracion }}</div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Puntuación</label>
              <div class="flex gap-1 mb-3">
                <button v-for="n in 5" :key="n" @click="nuevaValoracion.puntuacion = n"
                        :class="n <= nuevaValoracion.puntuacion ? 'text-amber-400' : 'text-slate-300'"
                        class="text-2xl hover:scale-110 transition">⭐</button>
              </div>
              <textarea v-model="nuevaValoracion.comentario" rows="3" placeholder="Comparte tu experiencia (opcional)..."
                        class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none mb-3"></textarea>
              <div class="flex gap-2">
                <button @click="enviarValoracion" :disabled="enviandoValoracion"
                        class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition">
                  {{ enviandoValoracion ? 'Enviando...' : 'Enviar' }}
                </button>
                <button @click="mostrarFormValoracion = false"
                        class="border-2 border-slate-200 text-slate-600 text-sm font-semibold px-4 py-1.5 rounded-lg transition">Cancelar</button>
              </div>
            </div>

            <!-- Lista -->
            <div v-if="valoraciones.length > 0" class="space-y-3">
              <div v-for="v in valoraciones" :key="v.id" class="bg-white border-2 border-slate-200 rounded-xl p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="font-semibold text-slate-800 text-sm">{{ v.nombres }} {{ v.apellidos }}</span>
                    <span class="text-amber-400 text-sm ml-2">{{ estrellas(v.puntuacion) }}</span>
                  </div>
                  <span class="text-xs text-slate-400">{{ new Date(v.fechaValoracion).toLocaleDateString() }}</span>
                </div>
                <p v-if="v.comentario" class="text-slate-600 text-sm mt-1">{{ v.comentario }}</p>
              </div>
            </div>
            <div v-else class="bg-white border-2 border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">
              Aún no hay valoraciones
            </div>
          </div>

        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 mb-5">
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-6 sticky top-20">
            <h5 class="font-bold text-slate-800 mb-4" style="font-family: 'Sora', sans-serif;">Información</h5>
            <ul class="space-y-3 text-sm">
              <li class="flex gap-2">
                <span class="text-blue-500">📍</span>
                <div>
                  <div class="text-slate-400 text-xs">Ubicación</div>
                  <span class="text-slate-700">{{ empresa.ubicacion }}</span>
                </div>
              </li>
              <li class="flex gap-2">
                <span class="text-blue-500">🏢</span>
                <div>
                  <div class="text-slate-400 text-xs">Sector</div>
                  <span class="text-slate-700">{{ empresa.sector }} · {{ empresa.tipoEmpresa }}</span>
                </div>
              </li>
              <li class="flex gap-2">
                <span class="text-blue-500">📞</span>
                <div>
                  <div class="text-slate-400 text-xs">Teléfono</div>
                  <span class="text-slate-700">{{ empresa.telefono }}</span>
                </div>
              </li>
              <li class="flex gap-2">
                <span class="text-blue-500">✉️</span>
                <div>
                  <div class="text-slate-400 text-xs">Correo</div>
                  <span class="text-slate-700">{{ empresa.correoContacto }}</span>
                </div>
              </li>
              <li class="flex gap-2">
                <span class="text-blue-500">📄</span>
                <div>
                  <div class="text-slate-400 text-xs">NIT</div>
                  <span class="text-slate-700">{{ empresa.nit }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <div v-else class="text-center py-12 text-slate-400">Empresa no encontrada</div>
    </div>

    <FooterPage />
  </div>
</template>