<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const auth = useAuthStore()
const router = useRouter()

const form = ref({
  nombreComercial: '',
  razonSocial: '',
  nit: '',
  ubicacion: '',
  telefono: '',
  correoContacto: '',
  sector: '',
  tipoEmpresa: '',
  tamanioEmpresa: '',
  anioFundacion: '',
  descripcion: '',
  urlWeb: ''
})

const mensaje = ref('')
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    const { data } = await api.get('/usuarios/perfil/mi-empresa')
    const u = data.data
    form.value = {
      nombreComercial: u.nombreComercial || '',
      razonSocial: u.razonSocial || '',
      nit: u.nit || '',
      ubicacion: u.ubicacion || '',
      telefono: u.telefonoEmpresa || u.telefono || '',
      correoContacto: u.correoContacto || '',
      sector: u.sector || '',
      tipoEmpresa: u.tipoEmpresa || '',
      tamanioEmpresa: u.tamanioEmpresa || '51 – 200 empleados',
      anioFundacion: u.anioFundacion || '',
      descripcion: u.descripcion || '',
      urlWeb: u.urlWeb || ''
    }
  } catch {}
})

async function guardarCambios() {
  loading.value = true
  error.value = ''
  mensaje.value = ''
  try {
    await api.put('/usuarios/empresa', {
      nombres: auth.user.nombres,
      apellidos: auth.user.apellidos,
      nombreComercial: form.value.nombreComercial,
      descripcion: form.value.descripcion,
      ubicacion: form.value.ubicacion,
      telefono: form.value.telefono,
      sector: form.value.sector,
      tipoEmpresa: form.value.tipoEmpresa
    })
    mensaje.value = 'Perfil actualizado exitosamente'
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar'
  }
  loading.value = false
}

function verPerfilPublico() {
  router.push(`/empresa/${auth.user.idEmpresa}`)
}
</script>

<template>
  <div class="p-7">

    <!-- Mensajes -->
    <div v-if="mensaje" class="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 mb-4 text-sm">{{ mensaje }}</div>
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{{ error }}</div>

    <!-- TOPBAR -->
    <div class="mb-6">
      <h5 class="font-bold text-xl text-slate-800">Perfil de Empresa</h5>
      <div class="text-slate-500 text-sm">Así te ven los candidatos en PortalEmpleos</div>
    </div>

    <!-- IDENTIDAD VISUAL -->
    <div class="bg-white border border-slate-200 rounded-2xl p-7 mb-5">
      <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Identidad visual</h6>

      <!-- Cover + Logo -->
      <div class="relative mb-14">
        <!-- Cover -->
        <div class="h-36 bg-gradient-to-br from-slate-900 to-blue-600 rounded-xl flex items-center justify-center cursor-pointer group overflow-hidden">
          <div class="flex items-center gap-2 text-white/40 group-hover:opacity-0 transition">
            <i class="bi bi-camera text-3xl"></i>
            <span class="text-sm">Haz clic para cambiar la portada</span>
          </div>
          <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white font-semibold text-sm rounded-xl">
            Cambiar portada
          </div>
        </div>
        <!-- Logo -->
        <div class="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl cursor-pointer hover:shadow-blue-200 transition-shadow">
          🏢
        </div>
      </div>

      <!-- Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Nombre de la empresa *</label>
          <input v-model="form.nombreComercial" type="text" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
        </div>
        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Sitio web</label>
          <input v-model="form.urlWeb" type="url" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="https://techcorp.sv" />
        </div>
        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Razón Social *</label>
          <input v-model="form.razonSocial" type="text" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
        </div>
        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">NIT</label>
          <input v-model="form.nit" type="text" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="Ej: 0614-123456-001-0" />
        </div>
      </div>
    </div>

    <!-- INFORMACIÓN GENERAL -->
    <div class="bg-white border border-slate-200 rounded-2xl p-7 mb-5">
      <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Información general</h6>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Número de Teléfono</label>
          <input v-model="form.telefono" type="text" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="+503 0000-0000" />
        </div>
        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Correo Comercial</label>
          <input v-model="form.correoContacto" type="email" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="contacto@empresa.com" />
        </div>
        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Industria *</label>
          <select v-model="form.sector" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white">
            <option value="">Seleccionar</option>
            <option>Tecnología · Software</option>
            <option>Marketing Digital</option>
            <option>Finanzas</option>
            <option>Salud</option>
            <option>Educación</option>
            <option>Legal</option>
            <option>Ingeniería</option>
            <option>Otro</option>
          </select>
        </div>
        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Tipo de Empresa</label>
          <select v-model="form.tipoEmpresa" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white">
            <option value="">Seleccionar</option>
            <option>Privada</option>
            <option>Pública</option>
            <option>ONG</option>
            <option>Otra</option>
          </select>
        </div>
        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Tamaño de la empresa</label>
          <select v-model="form.tamanioEmpresa" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white">
            <option>1 – 10 empleados</option>
            <option>11 – 50 empleados</option>
            <option>51 – 200 empleados</option>
            <option>201 – 500 empleados</option>
            <option>500+ empleados</option>
          </select>
        </div>
        <div>
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Año de fundación</label>
          <input v-model="form.anioFundacion" type="number" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" min="1900" max="2025" />
        </div>
        <div class="md:col-span-2">
          <label class="block font-medium text-sm text-slate-700 mb-1.5">Ubicación</label>
          <input v-model="form.ubicacion" type="text" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
        </div>
      </div>
    </div>

    <!-- DESCRIPCIÓN -->
    <div class="bg-white border border-slate-200 rounded-2xl p-7 mb-5">
      <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Descripción de la empresa</h6>
      <div>
        <label class="block font-medium text-sm text-slate-700 mb-1.5">Sobre nosotros *</label>
        <textarea
            v-model="form.descripcion"
            class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 min-h-[120px]"
            placeholder="Describe tu empresa..."
        ></textarea>
        <div class="text-slate-400 text-xs mt-1">{{ form.descripcion.length }} / 500 caracteres recomendados</div>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="flex justify-end gap-3">
      <button @click="verPerfilPublico" class="border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition">
        Ver perfil público
      </button>
      <button @click="guardarCambios" :disabled="loading" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50">
        <i class="bi bi-check-lg"></i> {{ loading ? 'Guardando...' : 'Guardar cambios' }}
      </button>
    </div>

  </div>
</template>