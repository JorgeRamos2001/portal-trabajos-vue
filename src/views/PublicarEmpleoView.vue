<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()

const categorias = ref([])
const mensaje = ref('')
const error = ref('')
const loading = ref(false)

const form = ref({
  titulo: '',
  idCategoria: '',
  tipoContrato: 'Tiempo completo',
  modalidad: 'Remoto',
  ubicacion: '',
  salarioMinimo: '',
  salarioMaximo: '',
  vacantes: 1,
  fechaVencimiento: '',
  descripcion: '',
  requisitos: '',
  funciones: ''
})

onMounted(async () => {
  try {
    const { data } = await api.get('/categorias')
    categorias.value = data.data
  } catch {}
})

async function publicar() {
  error.value = ''
  mensaje.value = ''
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
  <div class="p-7">

    <!-- Mensajes -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{{ error }}</div>

    <!-- TOPBAR -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="$router.push('/mis-empleos')" class="border border-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition text-sm">
        <i class="bi bi-arrow-left"></i>
      </button>
      <div>
        <h5 class="font-bold text-xl text-slate-800">Crear nueva oferta</h5>
        <div class="text-slate-500 text-sm">Completa todos los campos para publicar</div>
      </div>
    </div>

    <!-- INFORMACIÓN BÁSICA -->
    <div class="bg-white border border-slate-200 rounded-2xl p-7 mb-5">
      <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Información básica</h6>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div class="md:col-span-2">
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Título del puesto *</label>
          <input type="text" v-model="form.titulo" placeholder="Ej: Desarrollador Full Stack Senior"
                 class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
        </div>

        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Categoría *</label>
          <select v-model="form.idCategoria" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white">
            <option value="">Seleccionar</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
          </select>
        </div>

        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Tipo de contrato *</label>
          <select v-model="form.tipoContrato" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white">
            <option>Tiempo completo</option>
            <option>Medio tiempo</option>
            <option>Freelance</option>
            <option>Prácticas</option>
          </select>
        </div>

        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Modalidad de trabajo *</label>
          <select v-model="form.modalidad" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white">
            <option>Presencial</option>
            <option>Remoto</option>
            <option>Híbrido</option>
          </select>
        </div>

        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Ubicación</label>
          <input type="text" v-model="form.ubicacion" placeholder="Ciudad, País"
                 class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
        </div>

        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Salario mínimo (USD)</label>
          <input type="number" v-model="form.salarioMinimo" placeholder="0"
                 class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
        </div>

        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Salario máximo (USD)</label>
          <input type="number" v-model="form.salarioMaximo" placeholder="0"
                 class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
        </div>

        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Vacantes *</label>
          <input type="number" v-model="form.vacantes" min="1" placeholder="1"
                 class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
        </div>

        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Fecha de cierre</label>
          <input type="date" v-model="form.fechaVencimiento"
                 class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
        </div>

      </div>
    </div>

    <!-- DESCRIPCIÓN -->
    <div class="bg-white border border-slate-200 rounded-2xl p-7 mb-5">
      <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Descripción del puesto</h6>
      <label class="block font-medium text-sm text-slate-700 mb-1.5">Descripción general *</label>
      <textarea v-model="form.descripcion" rows="6" placeholder="Describe el rol, responsabilidades y el equipo..."
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 min-h-[140px]"></textarea>
      <div class="text-slate-400 text-xs mt-1">Mínimo 200 caracteres.</div>
    </div>

    <!-- REQUISITOS -->
    <div class="bg-white border border-slate-200 rounded-2xl p-7 mb-5">
      <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Requisitos</h6>
      <label class="block font-medium text-sm text-slate-700 mb-1.5">Requisitos *</label>
      <textarea v-model="form.requisitos" rows="6" placeholder="Lista los requisitos del candidato ideal..."
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 min-h-[140px]"></textarea>
      <div class="text-slate-400 text-xs mt-1">Mínimo 200 caracteres.</div>
    </div>

    <!-- FUNCIONES -->
    <div class="bg-white border border-slate-200 rounded-2xl p-7 mb-5">
      <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Funciones</h6>
      <label class="block font-medium text-sm text-slate-700 mb-1.5">Funciones *</label>
      <textarea v-model="form.funciones" rows="6" placeholder="Describe las funciones y responsabilidades del puesto..."
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 min-h-[140px]"></textarea>
      <div class="text-slate-400 text-xs mt-1">Mínimo 200 caracteres.</div>
    </div>

    <!-- ACTIONS -->
    <div class="flex items-center justify-between">
      <button @click="$router.push('/mis-empleos')" class="border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5">
        <i class="bi bi-arrow-left"></i> Cancelar
      </button>
      <button @click="publicar" :disabled="loading" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50">
        <i class="bi bi-send"></i> {{ loading ? 'Publicando...' : 'Publicar oferta' }}
      </button>
    </div>

  </div>
</template>