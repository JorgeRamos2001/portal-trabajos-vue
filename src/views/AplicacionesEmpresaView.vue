<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const aplicaciones = ref([])
const loading = ref(true)
const filtroEstado = ref('Todos')
const busqueda = ref('')

const estados = ['Todos', 'pendiente', 'revisado', 'entrevista', 'aceptado', 'rechazado']
const estadosTexto = {
  pendiente: 'Pendiente',
  revisado: 'En revisión',
  entrevista: 'Entrevista',
  aceptado: 'Oferta enviada',
  rechazado: 'Descartado'
}

onMounted(async () => {
  try {
    const { data } = await api.get('/postulaciones/aplicaciones-empresa')
    aplicaciones.value = data.data || []
  } catch {}
  loading.value = false
})

const filtradas = computed(() => {
  let lista = aplicaciones.value
  if (filtroEstado.value !== 'Todos') {
    lista = lista.filter(a => a.estado === filtroEstado.value)
  }
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(a => a.tituloEmpleo?.toLowerCase().includes(q) || a.nombres?.toLowerCase().includes(q))
  }
  return lista
})

const stats = computed(() => {
  const t = aplicaciones.value
  return {
    total: t.length,
    nuevas: t.filter(a => a.estado === 'pendiente').length,
    proceso: t.filter(a => a.estado === 'revisado' || a.estado === 'entrevista').length,
    finalizadas: t.filter(a => a.estado === 'aceptado' || a.estado === 'rechazado').length
  }
})

function pillClass(estado) {
  const map = {
    'pendiente': 'bg-amber-100 text-amber-800',
    'revisado': 'bg-blue-100 text-blue-800',
    'entrevista': 'bg-emerald-100 text-emerald-800',
    'aceptado': 'bg-purple-100 text-purple-800',
    'rechazado': 'bg-red-100 text-red-800'
  }
  return map[estado] || ''
}

async function cambiarEstado(id, nuevoEstado) {
  try {
    await api.put(`/postulaciones/${id}`, { estado: nuevoEstado })
    const app = aplicaciones.value.find(a => a.id === id)
    if (app) app.estado = nuevoEstado
  } catch {}
}
</script>

<template>
  <div class="p-7">

    <!-- TOPBAR -->
    <div class="mb-6">
      <h5 class="font-bold text-xl text-slate-800">Aplicaciones Recibidas</h5>
      <div class="text-slate-500 text-sm">Todas las postulaciones a tus ofertas</div>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white border border-slate-200 rounded-xl p-4 text-center">
        <h4 class="text-xl font-extrabold text-slate-800">{{ stats.total }}</h4>
        <div class="text-slate-500 text-xs">Total</div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-amber-400" @click="filtroEstado = 'pendiente'">
        <h4 class="text-xl font-extrabold text-amber-600">{{ stats.nuevas }}</h4>
        <div class="text-slate-500 text-xs">Nuevas</div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400" @click="filtroEstado = 'Todos'">
        <h4 class="text-xl font-extrabold text-blue-600">{{ stats.proceso }}</h4>
        <div class="text-slate-500 text-xs">En proceso</div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-4 text-center">
        <h4 class="text-xl font-extrabold text-slate-500">{{ stats.finalizadas }}</h4>
        <div class="text-slate-500 text-xs">Finalizadas</div>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-5 flex flex-wrap gap-3 items-center">
      <input v-model="busqueda" type="text" placeholder="Buscar por candidato o empleo..."
             class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-60" />
      <select v-model="filtroEstado" class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white">
        <option v-for="est in estados" :key="est" :value="est">{{ est === 'Todos' ? 'Todos los estados' : estadosTexto[est] }}</option>
      </select>
      <span class="text-slate-400 text-sm ml-auto">{{ filtradas.length }} aplicaciones</span>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <!-- LISTA -->
    <div v-else class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div class="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-200">
        <div class="flex-1 text-xs font-bold text-slate-400 uppercase tracking-wide">Candidato / Oferta</div>
        <div class="w-36 text-xs font-bold text-slate-400 uppercase tracking-wide hidden sm:block">Estado</div>
        <div class="w-28 text-xs font-bold text-slate-400 uppercase tracking-wide text-right hidden sm:block">Fecha</div>
      </div>

      <div v-for="a in filtradas" :key="a.id"
           class="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 last:border-none hover:bg-slate-50 transition">
        <div class="flex-1 min-w-0">
          <div class="font-bold text-slate-800 text-sm">{{ a.nombres }} {{ a.apellidos || '' }}</div>
          <div class="text-slate-500 text-xs">para: {{ a.tituloEmpleo }}</div>
        </div>
        <div class="w-36 hidden sm:block">
          <span class="text-xs font-bold rounded-full px-3 py-1" :class="pillClass(a.estado)">{{ estadosTexto[a.estado] || a.estado }}</span>
        </div>
        <div class="w-28 text-xs text-slate-400 text-right hidden sm:block">{{ new Date(a.fechaPostulacion).toLocaleDateString() }}</div>
      </div>

      <div v-if="filtradas.length === 0" class="text-center py-8 text-slate-400 text-sm">
        No hay aplicaciones
      </div>
    </div>
  </div>
</template>