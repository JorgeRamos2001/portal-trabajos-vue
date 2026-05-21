<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import NavbarPublic from '@/components/NavbarPublic.vue'
import FooterPage from '@/components/FooterPage.vue'
import RecursoCard from "@/components/RecursoCard.vue";

const route = useRoute()
const router = useRouter()

const recursos = ref([])
const loading = ref(false)
const total = ref(0)
const pagina = ref(1)
const totalPaginas = ref(1)
const tipoActivo = ref('')

const tipos = [
  { valor: '', label: 'Todos' },
  { valor: 'guía', label: '📚 Guías' },
  { valor: 'tutorial', label: '🎓 Tutoriales' },
  { valor: 'artículo', label: '📄 Artículos' },
  { valor: 'noticia', label: '📰 Noticias' },
  { valor: 'video', label: '🎬 Videos' }
]

onMounted(async () => {
  if (route.query.tipo) tipoActivo.value = route.query.tipo
  await cargarRecursos()
})

async function cargarRecursos() {
  loading.value = true
  try {
    const params = { pagina: pagina.value, limite: 9 }
    if (tipoActivo.value) params.tipo = tipoActivo.value

    const { data } = await api.get('/recursos', { params })
    recursos.value = data.recursos || []
    total.value = data.paginacion?.total || 0
    totalPaginas.value = data.paginacion?.totalPaginas || 1
  } catch {}
  loading.value = false
}

function filtrarPorTipo(tipo) {
  tipoActivo.value = tipo
  pagina.value = 1
  router.push({ query: tipo ? { tipo } : {} })
  cargarRecursos()
}

function cambiarPagina(p) {
  pagina.value = p
  cargarRecursos()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function tiempoRelativo(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  if (diff < 7) return `Hace ${diff} días`
  if (diff < 14) return 'Hace 1 semana'
  return `Hace ${Math.floor(diff / 7)} semanas`
}

function colorFondo(tipo) {
  const map = { 'guía': 'from-purple-600 to-purple-400', 'tutorial': 'from-blue-600 to-cyan-400', 'artículo': 'from-pink-600 to-pink-400', 'noticia': 'from-amber-600 to-amber-400', 'video': 'from-red-600 to-red-400' }
  return map[tipo] || 'from-slate-700 to-slate-500'
}

function badgeColor(tipo) {
  const map = { 'guía': 'bg-amber-100 text-amber-800', 'tutorial': 'bg-blue-100 text-blue-800', 'artículo': 'bg-emerald-100 text-emerald-800', 'noticia': 'bg-red-100 text-red-800', 'video': 'bg-purple-100 text-purple-800' }
  return map[tipo] || 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">

    <!-- Header -->
    <section class="bg-gradient-to-br from-slate-900 to-blue-900 py-14">
      <div class="max-w-5xl mx-auto px-4">
        <h1 class="text-3xl font-extrabold text-white mb-2" style="font-family: 'Sora', sans-serif;">Centro de Recursos</h1>
        <p class="text-slate-300 mb-4">Noticias, tutoriales y guías para potenciar tu carrera profesional</p>
        <div class="relative max-w-md">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input type="text" placeholder="Buscar recursos..." class="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 outline-none focus:bg-white/20" />
        </div>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 py-8 flex-1">

      <!-- Filtros -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button v-for="t in tipos" :key="t.valor" @click="filtrarPorTipo(t.valor)"
                :class="tipoActivo === t.valor ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'"
                class="border-2 rounded-full px-4 py-1.5 text-sm font-medium transition cursor-pointer">{{ t.label }}</button>
      </div>

      <!-- Grid -->
      <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecursoCard v-for="rec in recursos" :key="rec.id" :recurso="rec" />

        <div v-if="recursos.length === 0" class="col-span-full text-center py-12 text-slate-400">
          No se encontraron recursos
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalPaginas > 1" class="flex justify-center mt-8 gap-1">
        <button @click="cambiarPagina(pagina - 1)" :disabled="pagina === 1" class="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-30 hover:bg-slate-100 transition">‹</button>
        <button v-for="p in totalPaginas" :key="p" @click="cambiarPagina(p)"
                :class="p === pagina ? 'bg-blue-600 text-white' : 'border hover:bg-slate-100'"
                class="px-3 py-1.5 rounded-lg text-sm transition">{{ p }}</button>
        <button @click="cambiarPagina(pagina + 1)" :disabled="pagina === totalPaginas" class="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-30 hover:bg-slate-100 transition">›</button>
      </div>
    </div>

    <FooterPage />
  </div>
</template>