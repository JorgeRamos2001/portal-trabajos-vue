<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/api/axios'

const ofertas = ref([])
const loading = ref(true)
const stats = ref({ activas: 0, total: 0 })

onMounted(async () => {
  await cargarOfertas()
  loading.value = false
})

async function cargarOfertas() {
  try {
    const { data } = await api.get('/empleos/mis-empleos')
    ofertas.value = data.data || []
    stats.value.total = ofertas.value.length
    stats.value.activas = ofertas.value.filter(o => o.estado === 'activo').length
  } catch {}
}

function pillClass(estado) {
  const map = {
    'activo': 'bg-emerald-100 text-emerald-800',
    'pendiente': 'bg-amber-100 text-amber-800',
    'rechazado': 'bg-red-100 text-red-800',
    'cerrada': 'bg-slate-100 text-slate-600'
  }
  return map[estado] || 'bg-slate-100 text-slate-600'
}

function fechaRelativa(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Publicado hoy'
  if (diff === 1) return 'Hace 1 día'
  return `Hace ${diff} días`
}
</script>

<template>
  <div class="p-7">

    <!-- TOPBAR -->
    <div class="mb-6">
      <h5 class="font-bold text-xl text-slate-800">Gestión de Ofertas</h5>
      <div class="text-slate-500 text-sm">{{ stats.total }} ofertas publicadas · {{ stats.activas }} activas</div>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <!-- OFFER CARDS -->
    <div v-else class="flex flex-col gap-3">
      <div
          v-for="oferta in ofertas"
          :key="oferta.id"
          class="bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md rounded-2xl p-6 transition-all"
          :class="{ 'opacity-75': oferta.estado === 'cerrada' }"
      >
        <div class="flex items-center justify-between gap-4 flex-wrap">

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="text-xs font-bold rounded-full px-3 py-1 flex items-center gap-1" :class="pillClass(oferta.estado)">
                <i class="bi bi-circle-fill" style="font-size:.45rem;"></i>
                {{ oferta.estado }}
              </span>
              <span class="text-slate-400 text-xs">{{ fechaRelativa(oferta.fechaPublicacion) }}</span>
            </div>

            <h6 class="font-bold text-slate-800 mb-1 text-base">
              <RouterLink :to="`/empleos/${oferta.id}`" class="hover:text-blue-600 transition-colors">
                {{ oferta.titulo }}
              </RouterLink>
            </h6>

            <div class="flex items-center gap-4 text-slate-500 text-xs flex-wrap">
              <span class="flex items-center gap-1"><i class="bi bi-geo-alt"></i> {{ oferta.ubicacion }}</span>
              <span class="flex items-center gap-1"><i class="bi bi-clock"></i> {{ oferta.modalidad }}</span>
              <span v-if="oferta.tipoContrato" class="flex items-center gap-1">📋 {{ oferta.tipoContrato }}</span>
            </div>
          </div>

          <!-- Action -->
          <div class="flex-shrink-0">
            <RouterLink
                :to="`/mis-empleos/${oferta.id}/postulantes`"
                class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Ver aplicantes ({{ oferta.totalPostulantes || 0 }})
            </RouterLink>
          </div>

        </div>
      </div>

      <div v-if="ofertas.length === 0" class="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400">
        No tienes ofertas publicadas
      </div>
    </div>

  </div>
</template>