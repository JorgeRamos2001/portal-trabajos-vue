<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'

const route = useRoute()
const idEmpleo = route.params.id

const empleo = ref(null)
const postulantes = ref([])
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
    const [resEmp, resPost] = await Promise.all([
      api.get(`/empleos/${idEmpleo}`),
      api.get(`/postulaciones/empleo/${idEmpleo}`)
    ])
    empleo.value = resEmp.data.data
    postulantes.value = resPost.data.data || []
  } catch {}
  loading.value = false
})

const candidatosFiltrados = computed(() => {
  let lista = postulantes.value
  if (filtroEstado.value !== 'Todos') {
    lista = lista.filter(p => p.estado === filtroEstado.value)
  }
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(p => p.nombres?.toLowerCase().includes(q) || p.apellidos?.toLowerCase().includes(q))
  }
  return lista
})

const pipeline = computed(() => {
  const t = postulantes.value
  return [
    { label: 'Pendiente', num: t.filter(p => p.estado === 'pendiente').length, color: '#d97706' },
    { label: 'Revisado', num: t.filter(p => p.estado === 'revisado').length, color: '#2563EB' },
    { label: 'Entrevista', num: t.filter(p => p.estado === 'entrevista').length, color: '#10B981' },
    { label: 'Aceptado', num: t.filter(p => p.estado === 'aceptado').length, color: '#6b21a8' },
    { label: 'Rechazado', num: t.filter(p => p.estado === 'rechazado').length, color: '#ef4444' }
  ]
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

function colorAvatar(i) {
  const colors = ['linear-gradient(135deg, #2563EB, #10B981)', 'linear-gradient(135deg, #f59e0b, #d97706)', 'linear-gradient(135deg, #7c3aed, #a855f7)', 'linear-gradient(135deg, #be185d, #ec4899)']
  return colors[i % colors.length]
}

async function cambiarEstado(id, nuevoEstado) {
  try {
    await api.put(`/postulaciones/${id}`, { estado: nuevoEstado })
  } catch {}
}
</script>

<template>
  <div class="p-6">

    <!-- TOPBAR -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-3">
        <button @click="$router.push('/mis-empleos')" class="border border-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition text-sm">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h5 class="font-bold text-xl text-slate-800">Aplicantes por oferta</h5>
          <div class="text-slate-500 text-sm">{{ empleo?.titulo || 'Cargando...' }}</div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else>
      <!-- INFO DE LA OFERTA -->
      <div class="bg-white border border-slate-200 rounded-xl px-6 py-4 mb-5 flex items-center gap-4 flex-wrap">
        <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-slate-800 text-sm">{{ empleo?.titulo }}</div>
          <div class="text-slate-500 text-xs mt-0.5">{{ empleo?.empresa }} · {{ empleo?.ubicacion }} · {{ empleo?.modalidad }}</div>
        </div>
        <span :class="empleo?.estado === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
              class="text-xs font-bold rounded-full px-3 py-1 flex items-center gap-1 flex-shrink-0">
          <i class="bi bi-circle-fill" style="font-size:.45rem;"></i> {{ empleo?.estado }}
        </span>
      </div>

      <!-- PIPELINE -->
      <div class="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
        <div v-for="step in pipeline" :key="step.label" @click="filtroEstado = step.label === filtroEstado ? 'Todos' : step.label"
             class="bg-white border rounded-xl px-3 py-2.5 text-center cursor-pointer transition-all"
             :class="filtroEstado === step.label ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400'">
          <div class="font-extrabold text-xl" :style="{ color: step.color }">{{ step.num }}</div>
          <div class="text-slate-500 text-xs">{{ step.label }}</div>
        </div>
      </div>

      <!-- FILTROS -->
      <div class="bg-white border border-slate-200 rounded-xl px-4 py-3 mb-5 flex flex-wrap gap-3 items-center">
        <input v-model="busqueda" type="text" placeholder="Buscar candidato..."
               class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-52" />
        <select v-model="filtroEstado" class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white">
          <option v-for="est in estados" :key="est" :value="est">{{ est === 'Todos' ? 'Todos' : estadosTexto[est] }}</option>
        </select>
        <span class="text-slate-400 text-sm ml-auto">{{ candidatosFiltrados.length }} candidatos</span>
      </div>

      <!-- LISTA -->
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div class="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-200">
          <div class="w-9 flex-shrink-0"></div>
          <div class="flex-1 text-xs font-bold text-slate-400 uppercase tracking-wide">Candidato</div>
          <div class="w-36 text-xs font-bold text-slate-400 uppercase tracking-wide hidden sm:block">Estado</div>
          <div class="w-36 text-xs font-bold text-slate-400 uppercase tracking-wide hidden md:block">Cambiar</div>
          <div class="w-20 text-xs font-bold text-slate-400 uppercase tracking-wide text-right hidden sm:block">Fecha</div>
        </div>

        <div v-for="(p, i) in candidatosFiltrados" :key="p.id"
             class="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 last:border-none hover:bg-slate-50 transition">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" :style="{ background: colorAvatar(i) }">
            {{ p.nombres?.charAt(0) }}{{ p.apellidos?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-slate-800 text-sm">{{ p.nombres }} {{ p.apellidos }}</div>
            <div class="text-slate-500 text-xs">{{ p.email }}</div>
          </div>
          <div class="w-36 hidden sm:block">
            <span class="text-xs font-bold rounded-full px-3 py-1" :class="pillClass(p.estado)">{{ estadosTexto[p.estado] || p.estado }}</span>
          </div>
          <div class="w-36 hidden md:block">
            <select @change="cambiarEstado(p.id, $event.target.value)" class="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500 bg-white">
              <option :value="p.estado" disabled selected>{{ estadosTexto[p.estado] }}</option>
              <option value="revisado">En revisión</option>
              <option value="entrevista">Entrevista</option>
              <option value="aceptado">Oferta enviada</option>
              <option value="rechazado">Descartado</option>
            </select>
          </div>
          <div class="w-20 text-xs text-slate-400 text-right hidden sm:block">{{ new Date(p.fechaPostulacion).toLocaleDateString() }}</div>
        </div>

        <div v-if="candidatosFiltrados.length === 0" class="text-center py-8 text-slate-400 text-sm">
          No hay candidatos con ese filtro
        </div>
      </div>
    </div>
  </div>
</template>