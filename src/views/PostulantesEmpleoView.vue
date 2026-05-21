<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'

const route = useRoute()
const postulantes = ref([])
const loading = ref(true)
const tituloEmpleo = ref('')

const estadosPermitidos = ['pendiente', 'revisado', 'entrevista', 'aceptado', 'rechazado']

onMounted(async () => {
  try {
    const { data } = await api.get(`/postulaciones/empleo/${route.params.id}`)
    postulantes.value = data.data || []
  } catch {}
  loading.value = false
})

async function cambiarEstado(idPostulacion, nuevoEstado) {
  try {
    await api.put(`/postulaciones/${idPostulacion}`, { estado: nuevoEstado })
    const p = postulantes.value.find(p => p.id === idPostulacion)
    if (p) p.estado = nuevoEstado
  } catch {}
}

const estadosColor = {
  pendiente: 'bg-amber-100 text-amber-800',
  revisado: 'bg-blue-100 text-blue-800',
  entrevista: 'bg-purple-100 text-purple-800',
  aceptado: 'bg-emerald-100 text-emerald-800',
  rechazado: 'bg-red-100 text-red-800'
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <router-link to="/mis-empleos" class="text-blue-600 text-sm hover:underline mb-4 inline-block">← Volver a mis ofertas</router-link>
    <h1 class="text-2xl font-extrabold text-slate-800 mb-6" style="font-family: 'Sora', sans-serif;">👥 Postulantes</h1>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else-if="postulantes.length > 0" class="space-y-4">
      <div v-for="p in postulantes" :key="p.id" class="bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div class="flex justify-between items-start">
          <div>
            <h6 class="font-bold text-slate-800">{{ p.nombres }} {{ p.apellidos }}</h6>
            <p class="text-slate-500 text-sm">{{ p.email }}</p>
            <p class="text-slate-400 text-xs mt-1">{{ p.dui ? 'DUI: ' + p.dui : '' }} {{ p.telefono ? '· 📞 ' + p.telefono : '' }}</p>
          </div>
          <div class="text-right">
            <span :class="`text-xs font-semibold px-2.5 py-0.5 rounded-md ${estadosColor[p.estado] || ''}`">{{ p.estado }}</span>
            <select @change="cambiarEstado(p.id, $event.target.value)" class="block mt-2 text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white">
              <option value="">Cambiar estado</option>
              <option v-for="est in estadosPermitidos" :key="est" :value="est">{{ est }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white border-2 border-slate-200 rounded-2xl p-6 text-center text-slate-400">
      No hay postulantes aún
    </div>
  </div>
</template>