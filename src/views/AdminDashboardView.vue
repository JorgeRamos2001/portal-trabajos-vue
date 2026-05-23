<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const stats = ref({
  empleosActivos: 0,
  empleosTotales: 0,
  empleosPendientes: 0,
  empresasRegistradas: 0,
  postulantesRegistrados: 0,
  recursosTotal: 0
})
const usuariosRecientes = ref([])
const empleosRecientes = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [resStats, resUsers, resEmpleos] = await Promise.all([
      api.get('/stats'),
      api.get('/usuarios/all?limite=6'),
      api.get('/empleos?limite=5')
    ])
    stats.value = {
      ...stats.value,
      ...resStats.data.data,
      recursosTotal: resStats.data.data.recursosTotal || 0
    }
    usuariosRecientes.value = resUsers.data.usuarios || []
    empleosRecientes.value = resEmpleos.data.empleos || []
  } catch {}
  loading.value = false
})

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

function empleoEstadoClass(estado) {
  return {
    activo: 'bg-emerald-100 text-emerald-700',
    pendiente: 'bg-amber-100 text-amber-700',
    rechazado: 'bg-red-100 text-red-700',
    cerrada: 'bg-slate-100 text-slate-600'
  }[estado] || 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <div class="p-7">
    <div class="mb-6">
      <h5 class="font-bold text-xl text-slate-800">Dashboard Admin</h5>
      <div class="text-slate-500 text-sm">Resumen general de la plataforma</div>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else>
      <!-- KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-8">
        <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg flex-shrink-0">👥</div>
          <div>
            <h4 class="text-xl font-extrabold text-blue-600">{{ stats.postulantesRegistrados.toLocaleString() }}</h4>
            <div class="text-slate-500 text-xs">Postulantes</div>
          </div>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg flex-shrink-0">🏢</div>
          <div>
            <h4 class="text-xl font-extrabold text-emerald-600">{{ stats.empresasRegistradas.toLocaleString() }}</h4>
            <div class="text-slate-500 text-xs">Empresas</div>
          </div>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-lg flex-shrink-0">💼</div>
          <div>
            <h4 class="text-xl font-extrabold text-amber-600">{{ stats.empleosActivos.toLocaleString() }}</h4>
            <div class="text-slate-500 text-xs">Empleos activos</div>
          </div>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-lg flex-shrink-0">⏳</div>
          <div>
            <h4 class="text-xl font-extrabold text-orange-600">{{ stats.empleosPendientes.toLocaleString() }}</h4>
            <div class="text-slate-500 text-xs">Pendientes</div>
          </div>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg flex-shrink-0">📚</div>
          <div>
            <h4 class="text-xl font-extrabold text-purple-600">{{ stats.recursosTotal.toLocaleString() }}</h4>
            <div class="text-slate-500 text-xs">Recursos</div>
          </div>
        </div>
      </div>

      <!-- Alerta si hay pendientes -->
      <div v-if="stats.empleosPendientes > 0"
           class="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2 text-amber-700 text-sm font-medium">
          <span>⚠️</span>
          Hay <strong>{{ stats.empleosPendientes }}</strong> empleo(s) pendientes de revisión
        </div>
        <router-link to="/admin/empleos" class="text-amber-700 text-sm font-semibold hover:underline">
          Revisar ahora →
        </router-link>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Usuarios recientes -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5">
          <div class="flex justify-between items-center mb-4">
            <span class="font-bold text-slate-800">Usuarios recientes</span>
            <router-link to="/admin/usuarios" class="text-blue-600 text-sm hover:underline">Ver todos</router-link>
          </div>
          <table class="w-full text-sm">
            <thead>
            <tr class="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
              <th class="pb-2">Usuario</th><th class="pb-2">Rol</th><th class="pb-2">Estado</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="u in usuariosRecientes" :key="u.id" class="border-b border-slate-50 last:border-none">
              <td class="py-2.5 text-sm font-medium text-slate-800">{{ u.nombres }} {{ u.apellidos }}</td>
              <td class="py-2.5">
                <span class="text-xs font-semibold px-2 py-0.5 rounded-md" :class="rolClass(u.rol)">{{ u.rol }}</span>
              </td>
              <td class="py-2.5">
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="estadoClass(u.estado)">{{ u.estado }}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Empleos recientes -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5">
          <div class="flex justify-between items-center mb-4">
            <span class="font-bold text-slate-800">Empleos recientes</span>
            <router-link to="/admin/empleos" class="text-blue-600 text-sm hover:underline">Ver todos</router-link>
          </div>
          <div class="space-y-3">
            <div v-for="emp in empleosRecientes" :key="emp.id" class="flex items-start justify-between border-b border-slate-50 pb-3 last:border-none last:pb-0">
              <div>
                <div class="font-semibold text-sm text-slate-800">{{ emp.titulo }}</div>
                <div class="text-xs text-slate-500 mt-0.5">{{ emp.empresa }}</div>
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ml-3" :class="empleoEstadoClass(emp.estado)">
                {{ emp.estado }}
              </span>
            </div>
          </div>
        </div>

        <!-- Accesos rápidos -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 lg:col-span-2">
          <span class="font-bold text-slate-800 block mb-4">Accesos rápidos</span>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <router-link to="/admin/usuarios"
                         class="flex flex-col items-center gap-2 border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50/30 transition text-center no-underline">
              <span class="text-2xl">👥</span>
              <span class="text-sm font-semibold text-slate-700">Usuarios</span>
            </router-link>
            <router-link to="/admin/empleos"
                         class="flex flex-col items-center gap-2 border border-slate-200 rounded-xl p-4 hover:border-amber-400 hover:bg-amber-50/30 transition text-center no-underline">
              <span class="text-2xl">💼</span>
              <span class="text-sm font-semibold text-slate-700">Empleos</span>
              <span v-if="stats.empleosPendientes > 0" class="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full -mt-1">
                {{ stats.empleosPendientes }}
              </span>
            </router-link>
            <router-link to="/admin/recursos"
                         class="flex flex-col items-center gap-2 border border-slate-200 rounded-xl p-4 hover:border-purple-400 hover:bg-purple-50/30 transition text-center no-underline">
              <span class="text-2xl">📚</span>
              <span class="text-sm font-semibold text-slate-700">Recursos</span>
            </router-link>
            <router-link to="/admin/foro"
                         class="flex flex-col items-center gap-2 border border-slate-200 rounded-xl p-4 hover:border-emerald-400 hover:bg-emerald-50/30 transition text-center no-underline">
              <span class="text-2xl">💬</span>
              <span class="text-sm font-semibold text-slate-700">Foro</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
