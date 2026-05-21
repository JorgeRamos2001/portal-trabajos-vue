<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const usuarios = ref([])
const loading = ref(true)
const filtroRol = ref('')
const pagina = ref(1)
const totalPaginas = ref(1)

onMounted(async () => {
  await cargarUsuarios()
  loading.value = false
})

async function cargarUsuarios() {
  try {
    const params = { pagina: pagina.value, limite: 10 }
    if (filtroRol.value) params.rol = filtroRol.value
    const { data } = await api.get('/usuarios/all', { params })
    usuarios.value = data.usuarios || []
    totalPaginas.value = data.paginacion?.totalPaginas || 1
  } catch {}
}

function cambiarPagina(p) {
  pagina.value = p
  cargarUsuarios()
}

async function desactivarUsuario(id) {
  if (!confirm('¿Desactivar este usuario?')) return
  try {
    await api.delete(`/usuarios/${id}`)
    cargarUsuarios()
  } catch {}
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-extrabold text-slate-800 mb-6" style="font-family: 'Sora', sans-serif;">👥 Gestionar Usuarios</h1>

    <div class="flex gap-2 mb-4">
      <button @click="filtroRol = ''; cargarUsuarios()" :class="filtroRol === '' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border-slate-200'"
              class="border-2 rounded-lg px-4 py-1.5 text-sm font-medium transition">Todos</button>
      <button @click="filtroRol = 'postulante'; cargarUsuarios()" :class="filtroRol === 'postulante' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border-slate-200'"
              class="border-2 rounded-lg px-4 py-1.5 text-sm font-medium transition">Postulantes</button>
      <button @click="filtroRol = 'empleador'; cargarUsuarios()" :class="filtroRol === 'empleador' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border-slate-200'"
              class="border-2 rounded-lg px-4 py-1.5 text-sm font-medium transition">Empleadores</button>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else class="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
        <tr class="bg-slate-50 text-left text-xs text-slate-500 uppercase border-b border-slate-200">
          <th class="px-4 py-3">Usuario</th>
          <th class="px-4 py-3">Email</th>
          <th class="px-4 py-3">Rol</th>
          <th class="px-4 py-3">Estado</th>
          <th class="px-4 py-3">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="u in usuarios" :key="u.id" class="border-b border-slate-100 hover:bg-slate-50">
          <td class="px-4 py-3 font-medium">{{ u.nombres }} {{ u.apellidos }}</td>
          <td class="px-4 py-3 text-slate-500">{{ u.email }}</td>
          <td class="px-4 py-3">
              <span :class="u.rol === 'postulante' ? 'bg-blue-100 text-blue-700' : u.rol === 'empleador' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                    class="text-xs font-semibold px-2 py-0.5 rounded-md">{{ u.rol }}</span>
          </td>
          <td class="px-4 py-3">
              <span :class="u.estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                    class="text-xs font-semibold px-2 py-0.5 rounded-full">{{ u.estado }}</span>
          </td>
          <td class="px-4 py-3">
            <button v-if="u.estado === 'activo'" @click="desactivarUsuario(u.id)" class="text-red-500 text-xs hover:underline">Desactivar</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPaginas > 1" class="flex justify-center mt-4 gap-1">
      <button @click="cambiarPagina(pagina - 1)" :disabled="pagina === 1" class="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-30">‹</button>
      <button v-for="p in totalPaginas" :key="p" @click="cambiarPagina(p)"
              :class="p === pagina ? 'bg-blue-600 text-white' : 'border hover:bg-slate-100'" class="px-3 py-1.5 rounded-lg text-sm">{{ p }}</button>
      <button @click="cambiarPagina(pagina + 1)" :disabled="pagina === totalPaginas" class="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-30">›</button>
    </div>
  </div>
</template>