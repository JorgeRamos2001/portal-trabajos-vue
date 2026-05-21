<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const empleos = ref([])
const loading = ref(true)
const pagina = ref(1)
const totalPaginas = ref(1)

onMounted(async () => {
  await cargarEmpleos()
  loading.value = false
})

async function cargarEmpleos() {
  try {
    const { data } = await api.get('/empleos', { params: { pagina: pagina.value, limite: 10 } })
    empleos.value = data.empleos || []
    totalPaginas.value = data.paginacion?.totalPaginas || 1
  } catch {}
}

async function aprobar(id) {
  try {
    await api.put(`/empleos/${id}/aprobar`)
    cargarEmpleos()
  } catch {}
}

async function rechazar(id) {
  try {
    await api.put(`/empleos/${id}/rechazar`)
    cargarEmpleos()
  } catch {}
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este empleo?')) return
  try {
    await api.delete(`/empleos/admin/${id}`)
    cargarEmpleos()
  } catch {}
}

function cambiarPagina(p) {
  pagina.value = p
  cargarEmpleos()
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-extrabold text-slate-800 mb-6" style="font-family: 'Sora', sans-serif;">💼 Gestionar Empleos</h1>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else class="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
        <tr class="bg-slate-50 text-left text-xs text-slate-500 uppercase border-b border-slate-200">
          <th class="px-4 py-3">Título</th>
          <th class="px-4 py-3">Empresa</th>
          <th class="px-4 py-3">Estado</th>
          <th class="px-4 py-3">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="emp in empleos" :key="emp.id" class="border-b border-slate-100 hover:bg-slate-50">
          <td class="px-4 py-3 font-medium">{{ emp.titulo }}</td>
          <td class="px-4 py-3 text-slate-500">{{ emp.empresa }}</td>
          <td class="px-4 py-3">
              <span :class="emp.estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : emp.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'"
                    class="text-xs font-semibold px-2 py-0.5 rounded-md">{{ emp.estado }}</span>
          </td>
          <td class="px-4 py-3 flex gap-2">
            <button v-if="emp.estado === 'pendiente'" @click="aprobar(emp.id)" class="text-emerald-600 text-xs hover:underline">Aprobar</button>
            <button v-if="emp.estado === 'pendiente'" @click="rechazar(emp.id)" class="text-amber-600 text-xs hover:underline">Rechazar</button>
            <button @click="eliminar(emp.id)" class="text-red-500 text-xs hover:underline">Eliminar</button>
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