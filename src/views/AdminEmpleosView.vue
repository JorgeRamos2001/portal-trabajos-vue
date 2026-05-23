<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const empleos = ref([])
const loading = ref(true)
const pagina = ref(1)
const totalPaginas = ref(1)
const total = ref(0)

const busqueda = ref('')
const filtroEstado = ref('pendiente')
const filtroCategoria = ref('Todas las categorías')
const categorias = ref([])

const stats = ref({ empleosActivos: 0, empleosTotales: 0, pendientes: 0 })

onMounted(async () => {
  try {
    const { data } = await api.get('/stats')
    stats.value = {
      empleosActivos: data.data.empleosActivos || 0,
      empleosTotales: data.data.empleosTotales || 0,
      pendientes: data.data.empleosPendientes || 0
    }
  } catch {}

  // Categorías
  try {
    const { data } = await api.get('/categorias')
    categorias.value = data.data
  } catch {}

  await cargarEmpleos()
  loading.value = false
})

async function cargarEmpleos() {
  try {
    const params = { pagina: pagina.value, limite: 10 }
    if (filtroEstado.value !== 'Todos los estados') {
      params.estado = filtroEstado.value
    } else {
      params.estado = ''
    }
    if (busqueda.value) params.busqueda = busqueda.value
    if (filtroCategoria.value !== 'Todas las categorías') {
      const cat = categorias.value.find(c => c.nombre === filtroCategoria.value)
      if (cat) params.categoria = cat.id
    }

    const { data } = await api.get('/empleos', { params })
    empleos.value = data.empleos || []
    total.value = data.paginacion?.total || 0
    totalPaginas.value = data.paginacion?.totalPaginas || 1

    console.log('Params enviados:', params)
    console.log('filtroEstado:', filtroEstado.value)
  } catch {}
}

async function aprobar(id) {
  try {
    await api.put(`/empleos/${id}/aprobar`)
    await cargarEmpleos()
  } catch {}
}

async function rechazar(id) {
  try {
    await api.put(`/empleos/${id}/rechazar`)
    await cargarEmpleos()
  } catch {}
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este empleo?')) return
  try {
    await api.delete(`/empleos/admin/${id}`)
    await cargarEmpleos()
  } catch {}
}

function cambiarPagina(p) {
  pagina.value = p
  cargarEmpleos()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function aplicarFiltros() {
  pagina.value = 1
  cargarEmpleos()
}

function estadoClass(estado) {
  const map = {
    'activo': 'bg-emerald-100 text-emerald-800',
    'pendiente': 'bg-amber-100 text-amber-800',
    'rechazado': 'bg-red-100 text-red-800',
    'eliminada': 'bg-slate-100 text-slate-600',
    'cerrada': 'bg-slate-100 text-slate-600'
  }
  return map[estado] || 'bg-slate-100 text-slate-600'
}

function fechaRelativa(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return `Hace ${diff} días`
}
</script>

<template>
  <div class="p-7">

    <!-- TOPBAR -->
    <div class="mb-6">
      <h5 class="font-bold text-xl text-slate-800">Gestión de Empleos</h5>
      <div class="text-slate-500 text-sm">{{ stats.empleosTotales.toLocaleString() }} empleos en la plataforma</div>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
        <div class="font-extrabold text-2xl text-emerald-500">{{ stats.empleosActivos.toLocaleString() }}</div>
        <div class="text-slate-500 text-xs mt-0.5">Total empleos activos</div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
        <div class="font-extrabold text-2xl text-amber-500">{{ stats.pendientes }}</div>
        <div class="text-slate-500 text-xs mt-0.5">Pendientes</div>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="bg-white border border-slate-200 rounded-xl px-5 py-3.5 mb-5 flex flex-wrap gap-3 items-center">
      <input v-model="busqueda" @keyup.enter="aplicarFiltros" type="text" placeholder="Buscar empleo o empresa..."
             class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-56" />
      <select v-model="filtroEstado" @change="aplicarFiltros" class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white">
        <option value="Todos los estados">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="pendiente">Pendiente</option>
        <option value="rechazado">Rechazado</option>
        <option value="cerrada">Cerrada</option>
      </select>
      <select v-model="filtroCategoria" @change="aplicarFiltros" class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white">
        <option>Todas las categorías</option>
        <option v-for="cat in categorias" :key="cat.id" :value="cat.nombre">{{ cat.nombre }}</option>
      </select>
      <span class="text-slate-400 text-sm ml-auto">Mostrando {{ empleos.length }} de {{ total.toLocaleString() }} empleos</span>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <!-- TABLA -->
    <div v-else class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Oferta</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Empresa</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Categoría</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Publicada</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Estado</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="empleo in empleos" :key="empleo.id" class="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition">
            <td class="px-4 py-3">
              <div class="font-bold text-slate-800 text-sm">{{ empleo.titulo }}</div>
              <div class="text-slate-400 text-xs">{{ empleo.ubicacion }}</div>
            </td>
            <td class="px-4 py-3 text-slate-500 text-sm">{{ empleo.empresa }}</td>
            <td class="px-4 py-3">
              <span class="bg-blue-50 text-blue-600 text-xs font-semibold rounded-md px-2.5 py-1">{{ empleo.categoria || 'General' }}</span>
            </td>
            <td class="px-4 py-3 text-slate-400 text-sm">{{ fechaRelativa(empleo.fechaPublicacion) }}</td>
            <td class="px-4 py-3">
              <span class="text-xs font-bold rounded-full px-3 py-1" :class="estadoClass(empleo.estado)">{{ empleo.estado }}</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-1">
                <button v-if="empleo.estado === 'pendiente'" @click="aprobar(empleo.id)" class="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-200 transition">Aprobar</button>
                <button v-if="empleo.estado === 'pendiente'" @click="rechazar(empleo.id)" class="bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-red-200 transition">Rechazar</button>
                <button @click="eliminar(empleo.id)" class="border border-red-200 text-red-500 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-red-50 transition">🗑️</button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-if="empleos.length === 0" class="text-center py-8 text-slate-400 text-sm">No se encontraron empleos</div>

      <!-- PAGINACIÓN -->
      <div v-if="totalPaginas > 1" class="flex items-center justify-between px-5 py-3 border-t border-slate-200">
        <span class="text-slate-400 text-sm">Mostrando página {{ pagina }} de {{ totalPaginas }}</span>
        <div class="flex items-center gap-1">
          <button @click="cambiarPagina(pagina - 1)" :disabled="pagina === 1" class="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 text-sm hover:bg-slate-50 disabled:opacity-40 transition">‹</button>
          <button v-for="p in totalPaginas" :key="p" @click="cambiarPagina(p)"
                  :class="pagina === p ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
                  class="w-8 h-8 rounded-lg border text-sm font-semibold transition">{{ p }}</button>
          <button @click="cambiarPagina(pagina + 1)" :disabled="pagina === totalPaginas" class="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition">›</button>
        </div>
      </div>
    </div>

  </div>
</template>