<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import FooterPage from '@/components/FooterPage.vue'
import ComentarioCard from '@/components/ComentarioCard.vue'

const route = useRoute()
const auth = useAuthStore()

const post = ref(null)
const comentarios = ref([])
const loading = ref(true)
const nuevoComentario = ref('')
const enviando = ref(false)
const errorComentario = ref('')

onMounted(async () => {
  try {
    const [resPost, resComentarios] = await Promise.all([
      api.get(`/foro/${route.params.id}`),
      api.get(`/foro/${route.params.id}/comentarios`)  // ruta correcta
    ])
    post.value = resPost.data.data
    comentarios.value = resComentarios.data.data || []
  } catch {}
  loading.value = false
})

async function publicarComentario() {
  if (!nuevoComentario.value.trim()) return
  enviando.value = true
  errorComentario.value = ''
  try {
    await api.post('/foro/comentario', {
      idPublicacion: post.value.id,   // campo correcto según la API
      contenido: nuevoComentario.value
    })
    nuevoComentario.value = ''
    const { data } = await api.get(`/foro/${route.params.id}/comentarios`)
    comentarios.value = data.data || []
    if (post.value) post.value.totalComentarios = comentarios.value.length
  } catch (e) {
    errorComentario.value = e.response?.data?.message || 'Error al publicar el comentario.'
  }
  enviando.value = false
}

async function darLike() {
  if (!auth.isLoggedIn) return
  try {
    await api.post(`/foro/${post.value.id}/like`)
    post.value.totalLikes = (post.value.totalLikes || 0) + 1
  } catch {}
}

function tiempoRelativo(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  if (diff < 7) return `Hace ${diff} días`
  return new Date(fecha).toLocaleDateString('es-SV')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">

    <div class="max-w-4xl mx-auto px-4 py-6 flex-1">

      <nav class="text-sm text-slate-500 mb-4">
        <router-link to="/foro" class="text-blue-600 hover:underline">Foro</router-link> ›
        <span class="text-slate-400">{{ post?.titulo }}</span>
      </nav>

      <div v-if="loading" class="text-center py-12 text-slate-400">Cargando...</div>

      <div v-else-if="post" class="grid lg:grid-cols-3 gap-6">

        <div class="lg:col-span-2 space-y-4">

          <!-- Header -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-6">
            <h1 class="text-xl font-bold text-slate-800 mb-3" style="font-family: 'Sora', sans-serif;">{{ post.titulo }}</h1>
            <div class="flex gap-3 text-sm text-slate-500">
              <span>💬 {{ post.totalComentarios || comentarios.length }} respuestas</span>
              <span>👍 {{ post.totalLikes || 0 }} likes</span>
              <span>🕐 {{ tiempoRelativo(post.fechaPublicacion) }}</span>
            </div>
          </div>

          <!-- Post original -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-5">
            <div class="flex gap-3">
              <div class="text-center flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold mx-auto"
                     style="font-family: 'Sora', sans-serif;">{{ post.autor?.charAt(0) }}</div>
                <div class="text-xs font-semibold mt-1">{{ post.autor }}</div>
              </div>
              <div class="flex-1">
                <p class="text-slate-600 leading-relaxed whitespace-pre-line">{{ post.contenido }}</p>
                <div class="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button @click="darLike"
                          :class="auth.isLoggedIn ? 'hover:text-blue-600 cursor-pointer' : 'cursor-default'"
                          class="text-sm text-slate-400 transition">
                    👍 {{ post.totalLikes || 0 }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Comentarios -->
          <ComentarioCard v-for="com in comentarios" :key="com.id" :comentario="com" />

          <!-- Caja de respuesta -->
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-6">
            <h6 class="font-bold text-slate-800 mb-3" style="font-family: 'Sora', sans-serif;">Tu respuesta</h6>

            <!-- No logueado -->
            <div v-if="!auth.isLoggedIn" class="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm">
              ℹ️ Debes <router-link to="/login" class="font-bold hover:underline">iniciar sesión</router-link>
              o <router-link to="/register" class="font-bold hover:underline">registrarte</router-link> para participar en el foro.
            </div>

            <!-- Logueado -->
            <div v-else>
              <div v-if="errorComentario" class="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-3">
                {{ errorComentario }}
              </div>
              <textarea v-model="nuevoComentario" rows="4" placeholder="Escribe tu respuesta..."
                        class="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition mb-3 resize-none"></textarea>
              <button @click="publicarComentario" :disabled="enviando || !nuevoComentario.trim()"
                      class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition">
                {{ enviando ? 'Publicando...' : 'Publicar respuesta' }}
              </button>
            </div>
          </div>

        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-5 text-center sticky top-20">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-2"
                 style="font-family: 'Sora', sans-serif;">{{ post.autor?.charAt(0) }}</div>
            <div class="font-bold text-slate-800">{{ post.autor }}</div>
            <p class="text-slate-400 text-xs mt-2">Autor del hilo</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-slate-400">Publicación no encontrada</div>
    </div>

    <FooterPage />
  </div>
</template>