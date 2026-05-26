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

// Modal perfil candidato
const showModal = ref(false)
const candidatoSeleccionado = ref(null)

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
    { label: 'Revisado',  num: t.filter(p => p.estado === 'revisado').length,  color: '#2563EB' },
    { label: 'Entrevista',num: t.filter(p => p.estado === 'entrevista').length, color: '#10B981' },
    { label: 'Aceptado',  num: t.filter(p => p.estado === 'aceptado').length,  color: '#6b21a8' },
    { label: 'Rechazado', num: t.filter(p => p.estado === 'rechazado').length,  color: '#ef4444' }
  ]
})

function pillClass(estado) {
  return {
    pendiente:  'bg-amber-100 text-amber-800',
    revisado:   'bg-blue-100 text-blue-800',
    entrevista: 'bg-emerald-100 text-emerald-800',
    aceptado:   'bg-purple-100 text-purple-800',
    rechazado:  'bg-red-100 text-red-800'
  }[estado] || ''
}

function colorAvatar(i) {
  const colors = [
    'linear-gradient(135deg,#2563EB,#10B981)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
    'linear-gradient(135deg,#7c3aed,#a855f7)',
    'linear-gradient(135deg,#be185d,#ec4899)'
  ]
  return colors[i % colors.length]
}

async function cambiarEstado(id, nuevoEstado) {
  try {
    await api.put(`/postulaciones/${id}`, { estado: nuevoEstado })
    const p = postulantes.value.find(p => p.id === id)
    if (p) p.estado = nuevoEstado
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

async function cerrarOferta() {
  if (!confirm('¿Cerrar esta oferta?')) return
  try {
    await api.delete(`/empleos/${idEmpleo}`)
    router.push('/mis-empleos')
  } catch {}
}
</script>

<template>
  <div class="p-6">

    <!-- TOPBAR -->
    <div class="flex items-center gap-3 mb-5">
      <button @click="$router.push('/mis-empleos')"
              class="border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition text-sm">
        ← Volver
      </button>
      <div>
        <h5 class="font-bold text-xl text-slate-800">Aplicantes por oferta</h5>
        <div class="text-slate-500 text-sm">{{ empleo?.titulo || 'Cargando...' }}</div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else>
      <!-- INFO OFERTA -->
      <div class="bg-white border border-slate-200 rounded-xl px-6 py-4 mb-5 flex items-center gap-4 flex-wrap">
        <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-slate-800 text-sm">{{ empleo?.titulo }}</div>
          <div class="text-slate-500 text-xs mt-0.5">{{ empleo?.empresa }} · {{ empleo?.ubicacion }} · {{ empleo?.modalidad }}</div>
        </div>
        <span :class="empleo?.estado === 'activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
              class="text-xs font-bold rounded-full px-3 py-1 flex-shrink-0">
          ● {{ empleo?.estado }}
        </span>

        <button @click="cerrarOferta"
                class="border border-red-200 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
          🚫 Cerrar oferta
        </button>
      </div>

      <!-- PIPELINE -->
      <div class="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
        <div v-for="step in pipeline" :key="step.label"
             @click="filtroEstado = filtroEstado === step.label ? 'Todos' : step.label"
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
        <select v-model="filtroEstado" class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none bg-white">
          <option v-for="est in estados" :key="est" :value="est">{{ est === 'Todos' ? 'Todos' : estadosTexto[est] }}</option>
        </select>
        <span class="text-slate-400 text-sm ml-auto">{{ candidatosFiltrados.length }} candidatos</span>
      </div>

      <!-- LISTA -->
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div class="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wide">
          <div class="w-9 flex-shrink-0"></div>
          <div class="flex-1">Candidato</div>
          <div class="w-32 hidden sm:block">Estado</div>
          <div class="w-36 hidden md:block">Cambiar</div>
          <div class="w-28 hidden lg:block">Acciones</div>
          <div class="w-20 text-right hidden sm:block">Fecha</div>
        </div>

        <div v-for="(p, i) in candidatosFiltrados" :key="p.id"
             class="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition">
          <!-- Avatar -->
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
               :style="{ background: colorAvatar(i) }">
            {{ p.nombres?.charAt(0) }}{{ p.apellidos?.charAt(0) }}
          </div>

          <!-- Nombre + email -->
          <div class="flex-1 min-w-0">
            <div class="font-bold text-slate-800 text-sm">{{ p.nombres }} {{ p.apellidos }}</div>
            <div class="text-slate-500 text-xs">{{ p.email }}</div>
          </div>

          <!-- Badge estado -->
          <div class="w-32 hidden sm:block">
            <span class="text-xs font-bold rounded-full px-3 py-1" :class="pillClass(p.estado)">
              {{ estadosTexto[p.estado] || p.estado }}
            </span>
          </div>

          <!-- Select cambiar estado -->
          <div class="w-36 hidden md:block">
            <select @change="cambiarEstado(p.id, $event.target.value)"
                    class="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-500 bg-white">
              <option :value="p.estado" disabled selected>{{ estadosTexto[p.estado] }}</option>
              <option value="revisado">En revisión</option>
              <option value="entrevista">Entrevista</option>
              <option value="aceptado">Oferta enviada</option>
              <option value="rechazado">Descartado</option>
            </select>
          </div>

          <!-- Acciones -->
          <div class="w-28 hidden lg:flex gap-1.5">
            <button @click="verPerfil(p)"
                    class="border border-blue-200 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-50 transition">
              Ver perfil
            </button>
          </div>

          <!-- Fecha -->
          <div class="w-20 text-xs text-slate-400 text-right hidden sm:block">
            {{ new Date(p.fechaPostulacion).toLocaleDateString() }}
          </div>
        </div>

        <div v-if="candidatosFiltrados.length === 0" class="text-center py-8 text-slate-400 text-sm">
          No hay candidatos con ese filtro
        </div>
      </div>
    </div>

    <!-- MODAL PERFIL CANDIDATO -->
    <Teleport to="body">
      <div v-if="showModal && candidatoSeleccionado"
           class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
           @click.self="showModal = false">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">

          <!-- Header modal -->
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

            <!-- Descripción / resumen -->
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
                <iframe :src="urlCV(candidatoSeleccionado.urlCV)"
                        class="w-full rounded-xl border border-slate-200 mb-3"
                        style="height: 320px;"
                        type="application/pdf">
                </iframe>
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

            <!-- Cambiar estado desde modal -->
            <div class="border-t border-slate-200 pt-4">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Cambiar estado de postulación</div>
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