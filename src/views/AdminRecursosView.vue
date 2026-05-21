<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const recursos = ref([])
const loading = ref(true)

onMounted(async () => {
  await cargarRecursos()
  loading.value = false
})

async function cargarRecursos() {
  try {
    const { data } = await api.get('/recursos')
    recursos.value = data.recursos || []
  } catch {}
}

async function eliminarRecurso(id) {
  if (!confirm('¿Eliminar este recurso?')) return
  try {
    await api.delete(`/recursos/${id}`)
    cargarRecursos()
  } catch {}
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-extrabold text-slate-800 mb-6" style="font-family: 'Sora', sans-serif;">📚 Gestionar Recursos</h1>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else class="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
        <tr class="bg-slate-50 text-left text-xs text-slate-500 uppercase border-b border-slate-200">
          <th class="px-4 py-3">Título</th>
          <th class="px-4 py-3">Tipo</th>
          <th class="px-4 py-3">Autor</th>
          <th class="px-4 py-3">Fecha</th>
          <th class="px-4 py-3">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="rec in recursos" :key="rec.id" class="border-b border-slate-100 hover:bg-slate-50">
          <td class="px-4 py-3 font-medium">{{ rec.titulo }}</td>
          <td class="px-4 py-3">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{{ rec.tipo }}</span>
          </td>
          <td class="px-4 py-3 text-slate-500">{{ rec.autor }}</td>
          <td class="px-4 py-3 text-slate-500 text-xs">{{ rec.fechaPublicacion ? new Date(rec.fechaPublicacion).toLocaleDateString() : '' }}</td>
          <td class="px-4 py-3">
            <button @click="eliminarRecurso(rec.id)" class="text-red-500 text-xs hover:underline">Eliminar</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>