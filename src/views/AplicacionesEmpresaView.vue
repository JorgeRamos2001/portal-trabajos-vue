<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const aplicaciones = ref([])
const loading = ref(true)
const filtroEstado = ref('Todos')
const busqueda = ref('')

// Modal
const showModal = ref(false)
const candidatoSeleccionado = ref(null)

const estados = ['Todos', 'pendiente', 'revisado', 'entrevista', 'aceptado', 'rechazado']
const estadosTexto = {
  pendiente:  'Pendiente',
  revisado:   'En revisión',
  entrevista: 'Entrevista',
  aceptado:   'Oferta enviada',
  rechazado:  'Descartado'
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
  if (filtroEstado.value !== 'Todos') lista = lista.filter(a => a.estado === filtroEstado.value)
  if (busqueda.value) {
    const q = busqueda.value.toLowerCase()
    lista = lista.filter(a =>
      a.tituloEmpleo?.toLowerCase().includes(q) ||
      a.nombres?.toLowerCase().includes(q) ||
      a.apellidos?.toLowerCase().includes(q)
    )
  }
  return lista
})

const stats = computed(() => {
  const t = aplicaciones.value
  return {
    total:      t.length,
    nuevas:     t.filter(a => a.estado === 'pendiente').length,
    proceso:    t.filter(a => ['revisado','entrevista'].includes(a.estado)).length,
    finalizadas:t.filter(a => ['aceptado','rechazado'].includes(a.estado)).length
  }
})

function pillClass(estado) {
  return {
    pendiente:  'bg-amber-100 text-amber-800',
    revisado:   'bg-blue-100 text-blue-800',
    entrevista: 'bg-emerald-100 text-emerald-800',
    aceptado:   'bg-purple-100 text-purple-800',
    rechazado:  'bg-red-100 text-red-800'
  }[estado] || 'bg-slate-100 text-slate-600'
}

async function cambiarEstado(id, nuevoEstado) {
  try {
    await api.put(`/postulaciones/${id}`, { estado: nuevoEstado })
    const a = aplicaciones.value.find(a => a.id === id)
    if (a) a.estado = nuevoEstado
    if (candidatoSeleccionado.value?.id === id) candidatoSeleccionado.value.estado = nuevoEstado
  } catch {}
}

function verPerfil(candidato) {
  candidatoSeleccionado.value = candidato
  showModal.value = true
}

function urlCV(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  // Quitar slash inicial si existe para evitar doble slash
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `http://localhost:3000/${clean}`
}
</script>

<template>
  <div class="p-7">

    <div class="mb-6">
      <h5 class="font-bold text-xl text-slate-800">Aplicaciones Recibidas</h5>
      <div class="text-slate-500 text-sm">Todas las postulaciones a tus ofertas</div>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div class="bg-white border border-slate-200 rounded-xl p-4 text-center">
        <h4 class="text-xl font-extrabold text-slate-800">{{ stats.total }}</h4>
        <div class="text-slate-500 text-xs">Total</div>
      </div>
      <div @click="filtroEstado = 'pendiente'" class="bg-white border border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-amber-400 transition">
        <h4 class="text-xl font-extrabold text-amber-600">{{ stats.nuevas }}</h4>
        <div class="text-slate-500 text-xs">Nuevas</div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-4 text-center">
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
             class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64" />
      <select v-model="filtroEstado" class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none bg-white">
        <option v-for="est in estados" :key="est" :value="est">{{ est === 'Todos' ? 'Todos los estados' : estadosTexto[est] }}</option>
      </select>
      <span class="text-slate-400 text-sm ml-auto">{{ filtradas.length }} aplicaciones</span>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <!-- LISTA -->
    <div v-else class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div class="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wide">
        <div class="flex-1">Candidato / Oferta</div>
        <div class="w-32 hidden sm:block">Estado</div>
        <div class="w-40 hidden md:block">Cambiar</div>
        <div class="w-24 hidden lg:block">Perfil</div>
        <div class="w-24 text-right hidden sm:block">Fecha</div>
      </div>

      <div v-for="a in filtradas" :key="a.id"
           class="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition">
        <!-- Info candidato -->
        <div class="flex-1 min-w-0">
          <div class="font-bold text-slate-800 text-sm">{{ a.nombres }} {{ a.apellidos || '' }}</div>
          <div class="text-slate-500 text-xs">para: {{ a.tituloEmpleo }}</div>
        </div>

        <!-- Badge estado -->
        <div class="w-32 hidden sm:block">
          <span class="text-xs font-bold rounded-full px-3 py-1" :class="pillClass(a.estado)">
            {{ estadosTexto[a.estado] || a.estado }}
          </span>
        </div>

        <!-- Select cambiar estado -->
        <div class="w-40 hidden md:block">
          <select @change="cambiarEstado(a.id, $event.target.value)"
                  class="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500 bg-white">
            <option :value="a.estado" disabled selected>{{ estadosTexto[a.estado] || a.estado }}</option>
            <option value="revisado">En revisión</option>
            <option value="entrevista">Entrevista</option>
            <option value="aceptado">Oferta enviada</option>
            <option value="rechazado">Descartado</option>
          </select>
        </div>

        <!-- Ver perfil -->
        <div class="w-24 hidden lg:block">
          <RouterLink :to="`/candidato/${a.idCandidato}`"  class="border border-blue-200 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-50 transition w-full">Ver perfil</RouterLink>
        </div>

        <!-- Fecha -->
        <div class="w-24 text-xs text-slate-400 text-right hidden sm:block">
          {{ new Date(a.fechaPostulacion).toLocaleDateString() }}
        </div>
      </div>

      <div v-if="filtradas.length === 0" class="text-center py-8 text-slate-400 text-sm">
        No hay aplicaciones
      </div>
    </div>

    <!-- MODAL PERFIL CANDIDATO -->
    <Teleport to="body">
      <div v-if="showModal && candidatoSeleccionado"
           class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
           @click.self="showModal = false">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">

          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <h5 class="font-bold text-slate-800">Perfil del Candidato</h5>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>

          <div class="p-6 space-y-5">

            <!-- Avatar + nombre -->
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                   style="background: linear-gradient(135deg,#2563EB,#10B981)">
                {{ candidatoSeleccionado.nombres?.charAt(0) }}{{ candidatoSeleccionado.apellidos?.charAt(0) }}
              </div>
              <div>
                <div class="font-bold text-lg text-slate-800">{{ candidatoSeleccionado.nombres }} {{ candidatoSeleccionado.apellidos }}</div>
                <div class="text-slate-500 text-sm">{{ candidatoSeleccionado.email }}</div>
                <div class="text-slate-400 text-xs mt-0.5">para: {{ candidatoSeleccionado.tituloEmpleo }}</div>
                <span class="text-xs font-bold rounded-full px-2.5 py-0.5 mt-1 inline-block" :class="pillClass(candidatoSeleccionado.estado)">
                  {{ estadosTexto[candidatoSeleccionado.estado] }}
                </span>
              </div>
            </div>

            <!-- Info personal -->
            <div class="bg-slate-50 rounded-xl p-4 space-y-2.5">
              <div v-if="candidatoSeleccionado.telefono" class="flex items-center gap-3 text-sm">
                <span class="text-slate-500 w-24 flex-shrink-0">📞 Teléfono</span>
                <span class="text-slate-800 font-medium">{{ candidatoSeleccionado.telefono }}</span>
              </div>
              <div v-if="candidatoSeleccionado.dui" class="flex items-center gap-3 text-sm">
                <span class="text-slate-500 w-24 flex-shrink-0">🪪 DUI</span>
                <span class="text-slate-800 font-medium">{{ candidatoSeleccionado.dui }}</span>
              </div>
              <div v-if="candidatoSeleccionado.direccion" class="flex items-center gap-3 text-sm">
                <span class="text-slate-500 w-24 flex-shrink-0">📍 Dirección</span>
                <span class="text-slate-800 font-medium">{{ candidatoSeleccionado.direccion }}</span>
              </div>
            </div>

            <!-- Descripción -->
            <div v-if="candidatoSeleccionado.descripcion">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Sobre el candidato</div>
              <p class="text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-xl p-4">
                {{ candidatoSeleccionado.descripcion }}
              </p>
            </div>

            <!-- Links -->
            <div v-if="candidatoSeleccionado.urlLinkedin || candidatoSeleccionado.urlGithub" class="flex gap-2 flex-wrap">
              <a v-if="candidatoSeleccionado.urlLinkedin" :href="candidatoSeleccionado.urlLinkedin" target="_blank"
                 class="border border-blue-200 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition no-underline">
                🔗 LinkedIn
              </a>
              <a v-if="candidatoSeleccionado.urlGithub" :href="candidatoSeleccionado.urlGithub" target="_blank"
                 class="border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition no-underline">
                💻 GitHub
              </a>
            </div>

            <!-- CV -->
            <div class="border-t border-slate-200 pt-4">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Currículum</div>
              <div v-if="candidatoSeleccionado.urlCV">
                <!-- Preview iframe -->
                <iframe :src="urlCV(candidatoSeleccionado.urlCV)"
                        class="w-full rounded-xl border border-slate-200 mb-3"
                        style="height: 320px;"
                        type="application/pdf">
                </iframe>
                <!-- Botones fallback -->
                <div class="flex gap-2">
                  <a :href="urlCV(candidatoSeleccionado.urlCV)" target="_blank"
                     class="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition no-underline">
                    👁️ Ver CV
                  </a>
                  <a :href="urlCV(candidatoSeleccionado.urlCV)" download
                     class="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4 py-2.5 rounded-xl transition no-underline">
                    ⬇️ Descargar
                  </a>
                </div>
              </div>
              <div v-else class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-400 text-sm text-center">
                El candidato no ha subido su CV aún
              </div>
            </div>

            <!-- Cambiar estado -->
            <div class="border-t border-slate-200 pt-4">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Cambiar estado</div>
              <div class="flex flex-wrap gap-2">
                <button v-for="est in ['revisado','entrevista','aceptado','rechazado']" :key="est"
                        @click="cambiarEstado(candidatoSeleccionado.id, est)"
                        :class="candidatoSeleccionado.estado === est
                          ? pillClass(est) + ' ring-2 ring-offset-1 ring-current'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
                        class="text-xs font-semibold px-3 py-1.5 rounded-lg transition">
                  {{ estadosTexto[est] }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>