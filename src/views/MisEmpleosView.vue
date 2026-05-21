<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import EmpleoCard from '@/components/EmpleoCard.vue'

const empleos = ref([])
const loading = ref(true)

onMounted(async () => {
  await cargarEmpleos()
  loading.value = false
})

async function cargarEmpleos() {
  try {
    const { data } = await api.get('/empleos/mis-empleos')
    empleos.value = data.data || []
  } catch {}
}

async function eliminarEmpleo(id) {
  if (!confirm('¿Cerrar esta oferta?')) return
  try {
    await api.delete(`/empleos/${id}`)
    empleos.value = empleos.value.filter(e => e.id !== id)
  } catch {}
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-extrabold text-slate-800" style="font-family: 'Sora', sans-serif;">📝 Mis Ofertas</h1>
      <router-link to="/publicar-empleo" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition" style="font-family: 'Sora', sans-serif;">
        ➕ Publicar empleo
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else-if="empleos.length > 0" class="space-y-4">
      <div v-for="emp in empleos" :key="emp.id" class="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h6 class="font-bold text-slate-800">{{ emp.titulo }}</h6>
              <span :class="emp.estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : emp.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' : emp.estado === 'rechazado' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'"
                    class="text-xs font-semibold px-2 py-0.5 rounded-md">{{ emp.estado }}</span>
            </div>
            <div class="flex gap-3 text-sm text-slate-500">
              <span>📍 {{ emp.ubicacion }}</span>
              <span>💼 {{ emp.modalidad }}</span>
              <span>👥 {{ emp.totalPostulantes || 0 }} postulantes</span>
            </div>
          </div>
          <div class="flex gap-2">
            <router-link :to="`/mis-empleos/${emp.id}/postulantes`" class="text-blue-600 text-sm font-semibold hover:underline">Ver postulantes</router-link>
            <button @click="eliminarEmpleo(emp.id)" class="text-red-500 text-sm hover:underline">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white border-2 border-slate-200 rounded-2xl p-6 text-center text-slate-400">
      No tienes ofertas publicadas
    </div>
  </div>
</template>