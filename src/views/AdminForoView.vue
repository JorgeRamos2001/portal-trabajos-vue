<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'

const posts = ref([])
const loading = ref(true)
const busqueda = ref('')
const pagina = ref(1)
const limite = 12

onMounted(async () => {
  await cargarPosts()
  loading.value = false
})

async function cargarPosts() {
  try {
    const { data } = await api.get('/foro')
    posts.value = data.data || data.posts || []
  } catch {}
}

const postsFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase()
  return posts.value.filter(p =>
    !q || p.titulo?.toLowerCase().includes(q) || p.autor?.toLowerCase().includes(q)
  )
})

const totalPaginas = computed(() => Math.ceil(postsFiltrados.value.length / limite) || 1)

const postsPagina = computed(() => {
  const start = (pagina.value - 1) * limite
  return postsFiltrados.value.slice(start, start + limite)
})

function buscar() {
  pagina.value = 1
}

async function eliminarPost(id) {
  if (!confirm('¿Eliminar esta publicación del foro?')) return
  try {
    await api.delete(`/foro/${id}`)
    await cargarPosts()
  } catch {}
}

function fechaRelativa(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return `Hace ${diff} días`
}
</script>

<template>
  <div class="p-7">

    <!-- TOPBAR -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h5 class="font-bold text-xl text-slate-800">Gestión de Foro</h5>
        <div class="text-slate-500 text-sm">{{ posts.length }} publicaciones en total</div>
      </div>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
        <div class="font-extrabold text-2xl text-slate-800">{{ posts.length }}</div>
        <div class="text-slate-500 text-xs mt-0.5">Publicaciones activas</div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
        <div class="font-extrabold text-2xl text-blue-500">
          {{ posts.reduce((acc, p) => acc + (p.totalComentarios || 0), 0) }}
        </div>
        <div class="text-slate-500 text-xs mt-0.5">Comentarios totales</div>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl px-5 py-4 text-center">
        <div class="font-extrabold text-2xl text-rose-500">
          {{ posts.reduce((acc, p) => acc + (p.totalLikes || 0), 0) }}
        </div>
        <div class="text-slate-500 text-xs mt-0.5">Likes totales</div>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="bg-white border border-slate-200 rounded-xl px-5 py-3.5 mb-5 flex flex-wrap gap-3 items-center">
      <input v-model="busqueda" @input="buscar" type="text" placeholder="Buscar por título o autor..."
             class="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-72" />
      <span class="text-slate-400 text-sm ml-auto">
        {{ postsFiltrados.length }} de {{ posts.length }} publicaciones
      </span>
    </div>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <!-- TABLA -->
    <div v-else class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Publicación</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Autor</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Actividad</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Fecha</th>
            <th class="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="post in postsPagina" :key="post.id"
              class="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition">
            <td class="px-4 py-3">
              <div class="font-semibold text-slate-800 text-sm max-w-xs truncate">{{ post.titulo }}</div>
              <div class="text-slate-400 text-xs mt-0.5 line-clamp-1">{{ post.contenido?.slice(0, 80) }}...</div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {{ post.autor?.[0]?.toUpperCase() || '?' }}
                </div>
                <span class="text-slate-600 text-sm">{{ post.autor }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3 text-sm">
                <span class="flex items-center gap-1 text-slate-500">
                  <span class="text-base">💬</span> {{ post.totalComentarios || 0 }}
                </span>
                <span class="flex items-center gap-1 text-slate-500">
                  <span class="text-base">❤️</span> {{ post.totalLikes || 0 }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-slate-400 text-sm">{{ fechaRelativa(post.fechaPublicacion) }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-1.5">
                <router-link :to="`/foro/${post.id}`" target="_blank"
                             class="border border-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-50 transition">
                  Ver
                </router-link>
                <button @click="eliminarPost(post.id)"
                        class="border border-red-200 text-red-500 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-red-50 transition">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-if="postsPagina.length === 0" class="text-center py-8 text-slate-400 text-sm">
        No se encontraron publicaciones
      </div>

      <!-- PAGINACIÓN -->
      <div v-if="totalPaginas > 1" class="flex items-center justify-between px-5 py-3 border-t border-slate-200">
        <span class="text-slate-400 text-sm">Página {{ pagina }} de {{ totalPaginas }}</span>
        <div class="flex items-center gap-1">
          <button @click="pagina--" :disabled="pagina === 1"
                  class="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 text-sm hover:bg-slate-50 disabled:opacity-40 transition">‹</button>
          <button v-for="p in totalPaginas" :key="p" @click="pagina = p"
                  :class="pagina === p ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'"
                  class="w-8 h-8 rounded-lg border text-sm font-semibold transition">{{ p }}</button>
          <button @click="pagina++" :disabled="pagina === totalPaginas"
                  class="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition">›</button>
        </div>
      </div>
    </div>

  </div>
</template>
