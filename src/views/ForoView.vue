<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import NavbarPublic from '@/components/NavbarPublic.vue'
import FooterPage from '@/components/FooterPage.vue'
import ForoPostCard from "@/components/ForoPostCard.vue";

const posts = ref([])
const loading = ref(true)
const pagina = ref(1)
const totalPaginas = ref(1)
const total = ref(0)

onMounted(async () => {
  await cargarPosts()
  loading.value = false
})

async function cargarPosts() {
  try {
    const { data } = await api.get('/foro', { params: { pagina: pagina.value, limite: 10 } })
    posts.value = data.posts || data.data || []
  } catch {}
}

function tiempoRelativo(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  if (diff < 30) return `Hace ${diff} días`
  if (diff < 60) return 'Hace 1 mes'
  return `Hace ${Math.floor(diff / 30)} meses`
}

function cambiarPagina(p) {
  pagina.value = p
  cargarPosts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">

    <!-- Header -->
    <section class="bg-gradient-to-br from-slate-900 to-blue-900 py-12">
      <div class="max-w-5xl mx-auto px-4 flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 class="text-3xl font-extrabold text-white mb-1" style="font-family: 'Sora', sans-serif;">Foro de la Comunidad</h1>
          <p class="text-slate-300">Conecta, aprende y crece con miles de profesionales</p>
        </div>
        <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition" style="font-family: 'Sora', sans-serif;">
          ✏️ Nuevo hilo
        </router-link>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 py-8 flex-1">

      <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

      <div v-else class="space-y-4">
        <ForoPostCard v-for="post in posts" :key="post.id" :post="post" />

        <div v-if="posts.length === 0" class="text-center py-12 text-slate-400">
          No hay publicaciones aún
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