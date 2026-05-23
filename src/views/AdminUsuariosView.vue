<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const usuarios = ref([])
const loading = ref(true)
const filtroRol = ref('')
const busqueda = ref('')
const pagina = ref(1)
const totalPaginas = ref(1)
const total = ref(0)

const stats = ref({ total: 0, postulantes: 0, empleadores: 0, inactivos: 0 })

// Modal detalle
const showModal = ref(false)
const usuarioDetalle = ref(null)
const loadingDetalle = ref(false)

onMounted(async () => {
  await cargarStats()
  await cargarUsuarios()
  loading.value = false
})

async function cargarStats() {
  try {
    const [resAll, resPost, resEmp] = await Promise.all([
      api.get('/usuarios/all', { params: { limite: 1 } }),
      api.get('/usuarios/all', { params: { rol: 'postulante', limite: 1 } }),
      api.get('/usuarios/all', { params: { rol: 'empleador', limite: 1 } })
    ])
    stats.value.total = resAll.data.paginacion?.total || 0
    stats.value.postulantes = resPost.data.paginacion?.total || 0
    stats.value.empleadores = resEmp.data.paginacion?.total || 0
  } catch {}
}

async function cargarUsuarios() {
  try {
    const params = { pagina: pagina.value, limite: 12 }
    if (filtroRol.value) params.rol = filtroRol.value
    const { data } = await api.get('/usuarios/all', { params })
    let lista = data.usuarios || []
    if (busqueda.value) {
      const q = busqueda.value.toLowerCase()
      lista = lista.filter(u =>
        `${u.nombres} ${u.apellidos}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
    }
    usuarios.value = lista
    total.value = data.paginacion?.total || 0
    totalPaginas.value = data.paginacion?.totalPaginas || 1
  } catch {}
}

function cambiarFiltro(rol) {
  filtroRol.value = rol
  pagina.value = 1
  cargarUsuarios()
}

function cambiarPagina(p) {
  pagina.value = p
  cargarUsuarios()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function verDetalle(id) {
  showModal.value = true
  loadingDetalle.value = true
  usuarioDetalle.value = null
  try {
    const { data } = await api.get(`/usuarios/${id}`)
    usuarioDetalle.value = data.data
  } catch {}
  loadingDetalle.value = false
}

async function desactivarUsuario(id) {
  if (!confirm('¿Desactivar este usuario?')) return
  try {
    await api.delete(`/usuarios/${id}`)
    await cargarUsuarios()
    await cargarStats()
    if (showModal.value && usuarioDetalle.value?.id === id) {
      usuarioDetalle.value.estado = 'inactivo'
    }
  } catch {}
}

function rolClass(rol) {
  return {
    postulante: 'bg-blue-100 text-blue-700',
    empleador: 'bg-emerald-100 text-emerald-700',
    admin: 'bg-red-100 text-red-700'
  }[rol] || 'bg-slate-100 text-slate-600'
}

function estadoClass(estado) {
  return estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
}

function iniciales(u) {
  return ((u.nombres?.[0] || '') + (u.apellidos?.[0] || '')).toUpperCase() || '?'
}

function avatarGradient(rol) {
  return {
    postulante: 'from-blue-500 to-blue-700',
    empleador: 'from-emerald-500 to-emerald-700',
    admin: 'from-red-500 to-red-700'
  }[rol] || 'from-slate-400 to-slate-600'
}

function formatFecha(f) {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-SV', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="p-7">

    <!-- TOPBAR -->
    <div class="mb-6">
      <h5 class="font-bold text-xl text-slate-800">Gestión de Usuarios</h5>
      <div class="text-slate-500 text-sm">{{ total.toLocaleString() }} usuarios en la plataforma</div>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
        <div class="font-extrabold text-2xl text-slate-800">{{ stats.total.toLocaleString() }}</div>
        <div class="text-slate-500 text-xs mt-0.5">Total usuarios</div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
        <div class="font-extrabold text-2xl text-blue-500">{{ stats.postulantes.toLocaleString() }}</div>
        <div class="text-slate-500 text-xs mt-0.5">Postulantes</div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
        <div class="font-extrabold text-2xl text-emerald-500">{{ stats.empleadores.toLocaleString() }}</div>
        <div class="text-slate-500 text-xs mt-0.5">Empleadores</div>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="bg-white border border-slate-200 rounded-xl px-5 py-3.5 mb-5 flex flex-wrap gap-3 items-center">
      <input v-model="busqueda" @keyup.enter="cargarUsuarios" type="text" placeholder="Buscar por nombre o email..."
             class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-64" />
      <div class="flex gap-2">
        <button @click="cambiarFiltro('')" :class="filtroRol === '' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
                class="rounded-lg px-4 py-1.5 text-sm font-medium transition">Todos</button>
        <button @click="cambiarFiltro('postulante')" :class="filtroRol === 'postulante' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
                class="rounded-lg px-4 py-1.5 text-sm font-medium transition">Postulantes</button>
        <button @click="cambiarFiltro('empleador')" :class="filtroRol === 'empleador' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
                class="rounded-lg px-4 py-1.5 text-sm font-medium transition">Empleadores</button>
      </div>
      <span class="text-slate-400 text-sm ml-auto">{{ usuarios.length }} mostrados</span>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <!-- TABLA -->
    <div v-else class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Usuario</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Email</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Rol</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Registro</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Estado</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="u in usuarios" :key="u.id" class="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-gradient-to-br"
                     :class="avatarGradient(u.rol)">
                  {{ iniciales(u) }}
                </div>
                <div>
                  <div class="font-semibold text-slate-800 text-sm">{{ u.nombres }} {{ u.apellidos }}</div>
                  <div class="text-slate-400 text-xs">#{{ u.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-slate-500 text-sm">{{ u.email }}</td>
            <td class="px-4 py-3">
              <span class="text-xs font-semibold px-2.5 py-1 rounded-md" :class="rolClass(u.rol)">{{ u.rol }}</span>
            </td>
            <td class="px-4 py-3 text-slate-400 text-sm">{{ formatFecha(u.fechaRegistro) }}</td>
            <td class="px-4 py-3">
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="estadoClass(u.estado)">{{ u.estado }}</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-1.5">
                <button @click="verDetalle(u.id)"
                        class="border border-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-50 transition">
                  Ver
                </button>
                <button v-if="u.estado === 'activo' && u.rol !== 'admin'" @click="desactivarUsuario(u.id)"
                        class="border border-red-200 text-red-500 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-red-50 transition">
                  Desactivar
                </button>
                <span v-else-if="u.estado !== 'activo'" class="text-xs text-slate-400 px-1 py-1">Inactivo</span>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-if="usuarios.length === 0" class="text-center py-8 text-slate-400 text-sm">No se encontraron usuarios</div>

      <!-- PAGINACIÓN -->
      <div v-if="totalPaginas > 1" class="flex items-center justify-between px-5 py-3 border-t border-slate-200">
        <span class="text-slate-400 text-sm">Página {{ pagina }} de {{ totalPaginas }}</span>
        <div class="flex items-center gap-1">
          <button @click="cambiarPagina(pagina - 1)" :disabled="pagina === 1"
                  class="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 text-sm hover:bg-slate-50 disabled:opacity-40 transition">‹</button>
          <button v-for="p in totalPaginas" :key="p" @click="cambiarPagina(p)"
                  :class="pagina === p ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
                  class="w-8 h-8 rounded-lg border text-sm font-semibold transition">{{ p }}</button>
          <button @click="cambiarPagina(pagina + 1)" :disabled="pagina === totalPaginas"
                  class="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition">›</button>
        </div>
      </div>
    </div>

    <!-- MODAL DETALLE USUARIO -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showModal = false">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-xl">
          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <h5 class="font-bold text-slate-800">Detalle de Usuario</h5>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>

          <div v-if="loadingDetalle" class="text-center py-12 text-slate-400">Cargando...</div>

          <div v-else-if="usuarioDetalle" class="p-6">
            <!-- Avatar + nombre -->
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br flex-shrink-0"
                   :class="avatarGradient(usuarioDetalle.rol)">
                {{ iniciales(usuarioDetalle) }}
              </div>
              <div>
                <div class="font-bold text-lg text-slate-800">{{ usuarioDetalle.nombres }} {{ usuarioDetalle.apellidos }}</div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs font-semibold px-2.5 py-1 rounded-md" :class="rolClass(usuarioDetalle.rol)">{{ usuarioDetalle.rol }}</span>
                  <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="estadoClass(usuarioDetalle.estado)">{{ usuarioDetalle.estado }}</span>
                </div>
              </div>
            </div>

            <!-- Datos -->
            <div class="bg-slate-50 rounded-xl p-4 space-y-2.5">
              <div class="flex items-center gap-3 text-sm">
                <span class="text-slate-500 w-24 flex-shrink-0">Email</span>
                <span class="text-slate-800 font-medium">{{ usuarioDetalle.email }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-slate-500 w-24 flex-shrink-0">Registro</span>
                <span class="text-slate-800 font-medium">{{ formatFecha(usuarioDetalle.fechaRegistro) }}</span>
              </div>
              <template v-if="usuarioDetalle.rol === 'postulante'">
                <div v-if="usuarioDetalle.telefonoCandidato" class="flex items-center gap-3 text-sm">
                  <span class="text-slate-500 w-24 flex-shrink-0">Teléfono</span>
                  <span class="text-slate-800 font-medium">{{ usuarioDetalle.telefonoCandidato }}</span>
                </div>
                <div v-if="usuarioDetalle.dui" class="flex items-center gap-3 text-sm">
                  <span class="text-slate-500 w-24 flex-shrink-0">DUI</span>
                  <span class="text-slate-800 font-medium">{{ usuarioDetalle.dui }}</span>
                </div>
                <div v-if="usuarioDetalle.direccion" class="flex items-center gap-3 text-sm">
                  <span class="text-slate-500 w-24 flex-shrink-0">Dirección</span>
                  <span class="text-slate-800 font-medium">{{ usuarioDetalle.direccion }}</span>
                </div>
              </template>
              <template v-else-if="usuarioDetalle.rol === 'empleador'">
                <div v-if="usuarioDetalle.nombreComercial" class="flex items-center gap-3 text-sm">
                  <span class="text-slate-500 w-24 flex-shrink-0">Empresa</span>
                  <span class="text-slate-800 font-medium">{{ usuarioDetalle.nombreComercial }}</span>
                </div>
                <div v-if="usuarioDetalle.sector" class="flex items-center gap-3 text-sm">
                  <span class="text-slate-500 w-24 flex-shrink-0">Sector</span>
                  <span class="text-slate-800 font-medium">{{ usuarioDetalle.sector }}</span>
                </div>
                <div v-if="usuarioDetalle.ubicacion" class="flex items-center gap-3 text-sm">
                  <span class="text-slate-500 w-24 flex-shrink-0">Ubicación</span>
                  <span class="text-slate-800 font-medium">{{ usuarioDetalle.ubicacion }}</span>
                </div>
              </template>
            </div>

            <!-- Acciones -->
            <div class="flex justify-end gap-3 mt-5" v-if="usuarioDetalle.rol !== 'admin'">
              <button @click="showModal = false"
                      class="border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition">
                Cerrar
              </button>
              <button v-if="usuarioDetalle.estado === 'activo'" @click="desactivarUsuario(usuarioDetalle.id)"
                      class="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                Desactivar usuario
              </button>
            </div>
            <div v-else class="flex justify-end mt-5">
              <button @click="showModal = false"
                      class="border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
