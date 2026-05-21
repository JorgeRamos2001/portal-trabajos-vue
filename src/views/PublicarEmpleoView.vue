<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()

const categorias = ref([])
const form = ref({
  titulo: '',
  descripcion: '',
  requisitos: '',
  funciones: '',
  idCategoria: '',
  modalidad: 'Remoto',
  ubicacion: '',
  salarioMinimo: '',
  salarioMaximo: '',
  vacantes: 1,
  fechaVencimiento: ''
})

const loading = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/categorias')
    categorias.value = data.data
  } catch {}
})

async function publicar() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/empleos', form.value)
    router.push('/mis-empleos')
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al publicar'
  }
  loading.value = false
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
    <h1 class="text-2xl font-extrabold text-slate-800 mb-6" style="font-family: 'Sora', sans-serif;">➕ Publicar Empleo</h1>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{{ error }}</div>

    <div class="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4">

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Título del puesto</label>
        <input v-model="form.titulo" type="text" required placeholder="Desarrollador Full Stack" class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
        <textarea v-model="form.descripcion" rows="5" required placeholder="Describe el puesto..." class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Requisitos</label>
        <textarea v-model="form.requisitos" rows="5" required placeholder="- Experiencia en...&#10;- Conocimientos en..." class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Funciones</label>
        <textarea v-model="form.funciones" rows="4" required placeholder="- Desarrollar...&#10;- Mantener..." class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
          <select v-model="form.idCategoria" required class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white">
            <option value="">Seleccionar</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Modalidad</label>
          <select v-model="form.modalidad" class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none bg-white">
            <option>Remoto</option>
            <option>Presencial</option>
            <option>Híbrido</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
        <input v-model="form.ubicacion" type="text" required placeholder="San Salvador" class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Salario mínimo ($)</label>
          <input v-model="form.salarioMinimo" type="number" min="0" class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Salario máximo ($)</label>
          <input v-model="form.salarioMaximo" type="number" min="0" class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Vacantes</label>
          <input v-model="form.vacantes" type="number" min="1" class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-1">Fecha de vencimiento</label>
        <input v-model="form.fechaVencimiento" type="date" required class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none" />
      </div>

      <button @click="publicar" :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-50" style="font-family: 'Sora', sans-serif;">
        {{ loading ? 'Publicando...' : 'Publicar empleo' }}
      </button>
      <p class="text-xs text-slate-400 text-center">La publicación quedará pendiente de aprobación por un administrador.</p>
    </div>
  </div>
</template>