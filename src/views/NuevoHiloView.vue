<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import FooterPage from '@/components/FooterPage.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const titulo = ref('')
const contenido = ref('')
const enviando = ref(false)
const error = ref('')
const auth = useAuthStore()

async function publicar() {
  if (!titulo.value.trim() || !contenido.value.trim()) {
    error.value = 'El título y el contenido son obligatorios.'
    return
  }
  enviando.value = true
  error.value = ''
  try {
    const { data } = await api.post('/foro', { titulo: titulo.value, contenido: contenido.value, idUsuario: auth.user?.id })
    const id = data.data?.id || data.id
    router.push(id ? `/foro/${id}` : '/foro')
  } catch (e) {
    error.value = e.response?.data?.message || 'Ocurrió un error al publicar.'
  }
  enviando.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">

    <div class="max-w-2xl mx-auto px-4 py-8 flex-1 w-full">

      <!-- Breadcrumb -->
      <nav class="text-sm text-slate-500 mb-6">
        <router-link to="/foro" class="text-blue-600 hover:underline">Foro</router-link> › Nuevo hilo
      </nav>

      <div class="bg-white border-2 border-slate-200 rounded-2xl p-8">
        <h1 class="text-xl font-bold text-slate-800 mb-6" style="font-family: 'Sora', sans-serif;">✏️ Crear nuevo hilo</h1>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-5">
          {{ error }}
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Título</label>
            <input v-model="titulo" type="text" placeholder="¿De qué quieres hablar?"
                   class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Contenido</label>
            <textarea v-model="contenido" rows="8" placeholder="Escribe tu publicación aquí..."
                      class="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"></textarea>
          </div>

          <div class="flex gap-3 justify-end pt-2">
            <router-link to="/foro"
                         class="border border-slate-200 text-slate-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition">
              Cancelar
            </router-link>
            <button @click="publicar" :disabled="enviando"
                    class="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition">
              {{ enviando ? 'Publicando...' : '🚀 Publicar hilo' }}
            </button>
          </div>
        </div>
      </div>

    </div>

    <FooterPage />
  </div>
</template>
