<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const stats = ref({ empleosActivos: 0, empresasRegistradas: 0, postulantesRegistrados: 0 })
const usuariosRecientes = ref([])
const empleosRecientes = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [resStats, resUsers, resEmpleos] = await Promise.all([
      api.get('/stats'),
      api.get('/usuarios/all?limite=5'),
      api.get('/empleos?limite=5')
    ])
    stats.value = resStats.data.data
    usuariosRecientes.value = resUsers.data.usuarios || []
    empleosRecientes.value = resEmpleos.data.empleos || []
  } catch {}
  loading.value = false
})
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-extrabold text-slate-800 mb-2" style="font-family: 'Sora', sans-serif;">📊 Dashboard Admin</h1>
    <p class="text-slate-500 text-sm mb-6">Resumen general de la plataforma</p>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else>
      <!-- KPIs -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="bg-white border-2 border-slate-200 rounded-xl p-5 flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl">👥</div>
          <div>
            <h4 class="text-2xl font-extrabold text-blue-600">{{ stats.postulantesRegistrados.toLocaleString() }}</h4>
            <div class="text-slate-500 text-xs">Usuarios registrados</div>
          </div>
        </div>
        <div class="bg-white border-2 border-slate-200 rounded-xl p-5 flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">🏢</div>
          <div>
            <h4 class="text-2xl font-extrabold text-emerald-600">{{ stats.empresasRegistradas.toLocaleString() }}</h4>
            <div class="text-slate-500 text-xs">Empresas</div>
          </div>
        </div>
        <div class="bg-white border-2 border-slate-200 rounded-xl p-5 flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-xl">💼</div>
          <div>
            <h4 class="text-2xl font-extrabold text-amber-600">{{ stats.empleosActivos.toLocaleString() }}</h4>
            <div class="text-slate-500 text-xs">Empleos activos</div>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Usuarios recientes -->
        <div class="bg-white border-2 border-slate-200 rounded-2xl p-5">
          <div class="flex justify-between items-center mb-4">
            <span class="font-bold text-slate-800">Usuarios recientes</span>
            <router-link to="/admin/usuarios" class="text-blue-600 text-sm hover:underline">Ver todos</router-link>
          </div>
          <table class="w-full text-sm">
            <thead>
            <tr class="text-left text-xs text-slate-500 uppercase border-b border-slate-200">
              <th class="pb-2">Usuario</th><th class="pb-2">Rol</th><th class="pb-2">Estado</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="u in usuariosRecientes" :key="u.id" class="border-b border-slate-100">
              <td class="py-2 text-xs">{{ u.nombres }} {{ u.apellidos }}</td>
              <td class="py-2"><span class="text-xs font-semibold px-2 py-0.5 rounded-md" :class="u.rol === 'postulante' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'">{{ u.rol }}</span></td>
              <td class="py-2"><span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="u.estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'">{{ u.estado }}</span></td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Empleos recientes -->
        <div class="bg-white border-2 border-slate-200 rounded-2xl p-5">
          <div class="flex justify-between items-center mb-4">
            <span class="font-bold text-slate-800">Empleos recientes</span>
            <router-link to="/admin/empleos" class="text-blue-600 text-sm hover:underline">Ver todos</router-link>
          </div>
          <div class="space-y-3">
            <div v-for="emp in empleosRecientes" :key="emp.id" class="border-b border-slate-100 pb-3 last:border-0">
              <div class="font-semibold text-sm">{{ emp.titulo }}</div>
              <div class="text-xs text-slate-500">{{ emp.empresa }} · {{ emp.estado }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>