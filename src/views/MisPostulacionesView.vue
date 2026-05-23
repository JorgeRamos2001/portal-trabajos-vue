<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const postulaciones = ref([])
const loading = ref(true)
const filtroEstado = ref('Todas')
const busqueda = ref('')

const estadosTabs = ['Todas', 'Pendiente', 'En revisión', 'En proceso', 'Cerradas']

const estadosColor = {
  pendiente: 'bg-amber-100 text-amber-800',
  revisado: 'bg-blue-100 text-blue-800',
  entrevista: 'bg-emerald-100 text-emerald-800',
  aceptado: 'bg-purple-100 text-purple-800',
  rechazado: 'bg-red-100 text-red-800',
  cancelado: 'bg-slate-100 text-slate-600'
}

const estadosTexto = {
  pendiente: 'Pendiente',
  revisado: 'En revisión',
  entrevista: 'Entrevista agendada',
  aceptado: 'Oferta recibida',
  rechazado: 'Rechazado',
  cancelado: 'Cancelado'
}

onMounted(async () => {
  try {
    const { data } = await api.get('/postulaciones/mis-aplicaciones')
    postulaciones.value = data.data || []
  } catch {}
  loading.value = false
})

const postulacionesFiltradas = computed(() => {
  let lista = postulaciones.value
  if (filtroEstado.value !== 'Todas') {
    const mapa = { 'Pendiente': 'pendiente', 'En revisión': 'revisado', 'En proceso': 'entrevista', 'Cerradas': 'rechazado' }
    lista = lista.filter(p => p.estado === mapa[filtroEstado.value])
  }
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(p => p.tituloEmpleo?.toLowerCase().includes(q) || p.empresa?.toLowerCase().includes(q))
  }
  return lista
})

const stats = computed(() => {
  const t = postulaciones.value
  return {
    total: t.length,
    revision: t.filter(p => p.estado === 'revisado' || p.estado === 'pendiente').length,
    proceso: t.filter(p => p.estado === 'entrevista' || p.estado === 'aceptado').length,
    cerradas: t.filter(p => p.estado === 'rechazado' || p.estado === 'cancelado').length
  }
})

async function cancelar(id) {
  if (!confirm('¿Cancelar esta postulación?')) return
  try {
    await api.delete(`/postulaciones/${id}`)
    postulaciones.value = postulaciones.value.filter(p => p.id !== id)
  } catch {}
}
</script>

<template>
  <div class="p-8">

    <!-- Topbar -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-800" style="font-family: 'Sora', sans-serif;">Mis Aplicaciones</h1>
        <p class="text-slate-500 text-sm">Seguimiento de tus postulaciones</p>
      </div>
      <router-link to="/empleos" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition" style="font-family: 'Sora', sans-serif;">
        🔍 Buscar empleos
      </router-link>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white border-2 border-slate-200 rounded-xl p-4 text-center">
        <h4 class="text-xl font-extrabold text-slate-800">{{ stats.total }}</h4>
        <div class="text-slate-500 text-xs">Total</div>
      </div>
      <div class="bg-white border-2 border-slate-200 rounded-xl p-4 text-center">
        <h4 class="text-xl font-extrabold text-amber-600">{{ stats.revision }}</h4>
        <div class="text-slate-500 text-xs">En revisión</div>
      </div>
      <div class="bg-white border-2 border-slate-200 rounded-xl p-4 text-center">
        <h4 class="text-xl font-extrabold text-emerald-600">{{ stats.proceso }}</h4>
        <div class="text-slate-500 text-xs">En proceso</div>
      </div>
      <div class="bg-white border-2 border-slate-200 rounded-xl p-4 text-center">
        <h4 class="text-xl font-extrabold text-red-500">{{ stats.cerradas }}</h4>
        <div class="text-slate-500 text-xs">Cerradas</div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex justify-between items-center gap-3 mb-4 flex-wrap">
      <div class="flex gap-1 bg-white border-2 border-slate-200 rounded-xl p-1">
        <button v-for="tab in estadosTabs" :key="tab" @click="filtroEstado = tab"
                :class="filtroEstado === tab ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'"
                class="px-4 py-1.5 rounded-lg text-sm font-medium transition">{{ tab }}</button>
      </div>
      <div class="bg-white border-2 border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 w-60">
        <span class="text-slate-400">🔍</span>
        <input v-model="busqueda" type="text" placeholder="Buscar empresa o cargo..." class="border-none outline-none text-sm w-full" />
      </div>
    </div>

    <!-- Lista -->
    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else class="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
      <div v-for="p in postulacionesFiltradas" :key="p.id" class="flex items-center gap-4 px-5 py-4 border-b border-slate-100 hover:bg-slate-50">
        <div class="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">🏢</div>
        <div class="flex-1 min-w-0">
          <router-link :to="`/empleos/${p.idEmpleo}`" class="font-bold text-sm text-slate-800 hover:text-blue-600 block truncate">{{ p.tituloEmpleo }}</router-link>
          <div class="text-xs text-slate-500">{{ p.empresa }}</div>
        </div>
        <span :class="`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${estadosColor[p.estado] || ''}`">{{ estadosTexto[p.estado] || p.estado }}</span>
        <span class="text-xs text-slate-400 flex-shrink-0 w-20 text-right">{{ new Date(p.fechaPostulacion).toLocaleDateString() }}</span>
        <button v-if="p.estado === 'pendiente'" @click="cancelar(p.id)" class="text-red-400 hover:text-red-600 text-lg flex-shrink-0" title="Cancelar">✕</button>
      </div>
      <div v-if="postulacionesFiltradas.length === 0" class="text-center py-8 text-slate-400 text-sm">
        No se encontraron postulaciones
      </div>
    </div>
  </div>
</template>