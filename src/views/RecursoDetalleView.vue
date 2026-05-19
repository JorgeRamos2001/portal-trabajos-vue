<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'
import NavbarPublic from '@/components/NavbarPublic.vue'
import FooterPage from '@/components/FooterPage.vue'

const route = useRoute()
const recurso = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get(`/recursos/${route.params.id}`)
    recurso.value = data.data
  } catch {}
  loading.value = false
})

function badgeColor(tipo) {
  const map = { 'guía': 'bg-amber-100 text-amber-800', 'tutorial': 'bg-blue-100 text-blue-800', 'artículo': 'bg-emerald-100 text-emerald-800', 'noticia': 'bg-red-100 text-red-800', 'video': 'bg-purple-100 text-purple-800' }
  return map[tipo] || 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <NavbarPublic />

    <!-- Header -->
    <section class="bg-gradient-to-br from-slate-900 to-blue-900 py-12">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <span :class="`text-sm font-bold px-3 py-1 rounded-full mb-3 inline-block ${badgeColor(recurso?.tipo)}`" style="font-family: 'Sora', sans-serif;">{{ recurso?.tipo }}</span>
        <h1 class="text-2xl font-extrabold text-white mt-2 mb-3" style="font-family: 'Sora', sans-serif;">{{ recurso?.titulo }}</h1>
        <div class="flex justify-center gap-4 text-white/60 text-sm">
          <span v-if="recurso?.autor">Por <strong class="text-white">{{ recurso.autor }}</strong></span>
          <span>🕐 {{ recurso?.fechaPublicacion ? new Date(recurso.fechaPublicacion).toLocaleDateString('es-SV', { day: 'numeric', month: 'long', year: 'numeric' }) : '' }}</span>
        </div>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-8 flex-1">

      <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

      <div v-else-if="recurso" class="grid lg:grid-cols-3 gap-8">

        <!-- Contenido -->
        <div class="lg:col-span-2">
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-8">
            <div class="prose max-w-none text-slate-700 leading-relaxed whitespace-pre-line">{{ recurso.contenido }}</div>
          </div>

          <!-- Autor -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-5 mt-5 flex gap-4 items-center">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-lg" style="font-family: 'Sora', sans-serif;">{{ recurso.autor?.charAt(0) }}</div>
            <div>
              <div class="font-bold text-slate-800">{{ recurso.autor }}</div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-5 sticky top-20">
            <h6 class="font-bold text-slate-800 mb-3" style="font-family: 'Sora', sans-serif;">Información</h6>
            <ul class="text-sm space-y-2 text-slate-600">
              <li>📁 <strong>Tipo:</strong> {{ recurso.tipo }}</li>
              <li>📅 <strong>Publicado:</strong> {{ recurso.fechaPublicacion ? new Date(recurso.fechaPublicacion).toLocaleDateString() : '' }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-slate-400">Recurso no encontrado</div>
    </div>

    <FooterPage />
  </div>
</template>