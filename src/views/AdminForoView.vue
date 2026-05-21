<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const posts = ref([])
const loading = ref(true)

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

async function eliminarPost(id) {
  if (!confirm('¿Eliminar esta publicación?')) return
  try {
    await api.delete(`/foro/${id}`)
    cargarPosts()
  } catch {}
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-extrabold text-slate-800 mb-6" style="font-family: 'Sora', sans-serif;">💬 Gestionar Foro</h1>

    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

    <div v-else class="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
        <tr class="bg-slate-50 text-left text-xs text-slate-500 uppercase border-b border-slate-200">
          <th class="px-4 py-3">Título</th>
          <th class="px-4 py-3">Autor</th>
          <th class="px-4 py-3">Comentarios</th>
          <th class="px-4 py-3">Likes</th>
          <th class="px-4 py-3">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="post in posts" :key="post.id" class="border-b border-slate-100 hover:bg-slate-50">
          <td class="px-4 py-3 font-medium">{{ post.titulo }}</td>
          <td class="px-4 py-3 text-slate-500">{{ post.autor }}</td>
          <td class="px-4 py-3">{{ post.totalComentarios || 0 }}</td>
          <td class="px-4 py-3">{{ post.totalLikes || 0 }}</td>
          <td class="px-4 py-3">
            <button @click="eliminarPost(post.id)" class="text-red-500 text-xs hover:underline">Eliminar</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>