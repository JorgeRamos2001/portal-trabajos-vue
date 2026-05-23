<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const recursos = ref([])
const loading = ref(true)

const busqueda = ref('')
const filtroTipo = ref('Todos los tipos')

const showModal = ref(false)
const guardando = ref(false)
const nuevoRecurso = ref({
  titulo: '',
  tipo: 'artículo',
  contenido: ''
})

const stats = ref({ total: 0 })

onMounted(async () => {
  try {
    const { data: statsData } = await api.get('/stats')
    stats.value.total = statsData.data.recursosTotal || 0
  } catch {}
  await cargarRecursos()
  loading.value = false
})

async function cargarRecursos() {
  try {
    const params = {}
    if (filtroTipo.value !== 'Todos los tipos') params.tipo = filtroTipo.value.toLowerCase()
    if (busqueda.value) params.busqueda = busqueda.value

    const { data } = await api.get('/recursos', { params })
    recursos.value = data.recursos || []
  } catch {}
}

const recursosFiltrados = computed(() => recursos.value)

const tipoClass = (tipo) => ({
  'tutorial': 'bg-blue-100 text-blue-700',
  'noticia': 'bg-red-100 text-red-700',
  'artículo': 'bg-emerald-100 text-emerald-700',
  'guía': 'bg-amber-100 text-amber-700',
  'video': 'bg-purple-100 text-purple-700'
}[tipo] ?? 'bg-slate-100 text-slate-600')

function estadoClass(estado) {
  return estado === 'publicado' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
}

function fechaRelativa(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return `Hace ${diff} días`
}

async function crearRecurso() {
  guardando.value = true
  try {
    await api.post('/recursos', nuevoRecurso.value)
    showModal.value = false
    nuevoRecurso.value = { titulo: '', tipo: 'artículo', contenido: '' }
    await cargarRecursos()
  } catch {}
  guardando.value = false
}

async function eliminarRecurso(id) {
  if (!confirm('¿Eliminar este recurso?')) return
  try {
    await api.delete(`/recursos/${id}`)
    await cargarRecursos()
  } catch {}
}
</script>

<template>
  <div class="p-7">

    <!-- TOPBAR -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h5 class="font-bold text-xl text-slate-800">Gestión de Recursos</h5>
        <div class="text-slate-500 text-sm">{{ stats.total }} recursos publicados</div>
      </div>
      <button @click="showModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5">
        <i class="bi bi-plus-lg"></i> Crear recurso
      </button>
    </div>

    <!-- FILTROS -->
    <div class="bg-white border border-slate-200 rounded-xl px-5 py-3.5 mb-5 flex flex-wrap gap-3 items-center">
      <input v-model="busqueda" @keyup.enter="cargarRecursos" type="text" placeholder="Buscar recurso..."
             class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-52" />
      <select v-model="filtroTipo" @change="cargarRecursos" class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white">
        <option>Todos los tipos</option>
        <option>artículo</option>
        <option>guía</option>
        <option>tutorial</option>
        <option>noticia</option>
        <option>video</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <!-- LISTA -->
    <div v-else class="flex flex-col gap-3">
      <div v-for="rec in recursos" :key="rec.id"
           class="bg-white border border-slate-200 hover:border-blue-400 rounded-xl px-5 py-4 flex items-center gap-4 transition-all">

        <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
             style="background: linear-gradient(135deg, #1e3a5f, #2563EB)">📄</div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="font-bold text-slate-800 text-sm">{{ rec.titulo }}</span>
            <span class="text-xs font-bold rounded-md px-2 py-0.5" :class="tipoClass(rec.tipo)">{{ rec.tipo }}</span>
          </div>
          <div class="text-slate-400 text-xs">
            Por {{ rec.autor || 'Admin' }} · {{ fechaRelativa(rec.fechaPublicacion) }}
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-xs font-bold rounded-full px-3 py-1" :class="estadoClass(rec.estado)">{{ rec.estado }}</span>
          <router-link :to="`/recursos/${rec.id}`" class="border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">Ver</router-link>
          <button @click="eliminarRecurso(rec.id)" class="border border-red-200 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition">🗑️</button>
        </div>
      </div>

      <div v-if="recursos.length === 0" class="text-center py-8 text-slate-400 text-sm">No se encontraron recursos</div>
    </div>

    <!-- MODAL -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <h5 class="font-bold text-slate-800">Crear nuevo recurso</h5>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div>
              <label class="block font-medium text-sm text-slate-700 mb-1.5">Título *</label>
              <input v-model="nuevoRecurso.titulo" type="text" placeholder="Título del recurso..."
                     class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block font-medium text-sm text-slate-700 mb-1.5">Tipo *</label>
              <select v-model="nuevoRecurso.tipo" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white">
                <option>artículo</option>
                <option>guía</option>
                <option>tutorial</option>
                <option>noticia</option>
                <option>video</option>
              </select>
            </div>
            <div>
              <label class="block font-medium text-sm text-slate-700 mb-1.5">Contenido *</label>
              <textarea v-model="nuevoRecurso.contenido" rows="6" placeholder="Escribe el contenido..."
                        class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 min-h-[140px]"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-3 px-6 pb-6">
            <button @click="showModal = false" class="border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition">Cancelar</button>
            <button @click="crearRecurso" :disabled="guardando" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition disabled:opacity-50">
              {{ guardando ? 'Guardando...' : 'Guardar recurso' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>