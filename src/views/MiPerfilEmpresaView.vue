<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const auth = useAuthStore()
const router = useRouter()

const perfil = ref({
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

const editando = ref(false)
const mensaje = ref('')
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    const { data } = await api.get('/usuarios/perfil/mi-empresa')
    const u = data.data
    perfil.value = {
      nombreComercial: u.nombreComercial || '',
      razonSocial: u.razonSocial || '',
      nit: u.nit || '',
      ubicacion: u.ubicacion || '',
      telefono: u.telefono || '',
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
  try {
    await api.put('/usuarios/empresa', {
      nombres: auth.user.nombres,
      apellidos: auth.user.apellidos,
      nombreComercial: perfil.value.nombreComercial,
      descripcion: perfil.value.descripcion,
      ubicacion: perfil.value.ubicacion,
      telefono: perfil.value.telefono,
      sector: perfil.value.sector,
      tipoEmpresa: perfil.value.tipoEmpresa,
      urlWeb: perfil.value.urlWeb,
      tamanioEmpresa: perfil.value.tamanioEmpresa,
      anioFundacion: perfil.value.anioFundacion
    })
    mensaje.value = 'Perfil actualizado exitosamente'
    editando.value = false
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
    <div class="flex justify-between items-center mb-6">
      <div>
        <h5 class="font-bold text-xl text-slate-800">Perfil de Empresa</h5>
        <div class="text-slate-500 text-sm">Así te ven los candidatos en PortalEmpleos</div>
      </div>
      <div class="flex gap-2">
        <button @click="verPerfilPublico" class="border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition">
          👁️ Ver perfil público
        </button>
        <button @click="editando = !editando" :class="editando ? 'bg-slate-200 text-slate-700' : 'bg-blue-600 text-white hover:bg-blue-700'"
                class="text-sm font-semibold px-4 py-2 rounded-lg transition">
          ✏️ {{ editando ? 'Cancelar' : 'Editar perfil' }}
        </button>
      </div>
    </div>

    <!-- IDENTIDAD VISUAL -->
    <div class="bg-white border border-slate-200 rounded-2xl p-7 mb-5">
      <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Identidad visual</h6>
      <div class="relative mb-14">
        <div class="h-36 bg-gradient-to-br from-slate-900 to-blue-600 rounded-xl"></div>
        <div class="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl">
          🏢
        </div>
      </div>
    </div>

    <!-- INFORMACIÓN (modo lectura) -->
    <div v-if="!editando" class="space-y-5">
      <div class="bg-white border border-slate-200 rounded-2xl p-7">
        <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Información general</h6>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="text-slate-400 text-xs">Nombre comercial</div>
            <div class="font-medium">{{ perfil.nombreComercial || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-xs">Razón social</div>
            <div class="font-medium">{{ perfil.razonSocial || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-xs">NIT</div>
            <div class="font-medium">{{ perfil.nit || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-xs">Sitio web</div>
            <div class="font-medium">{{ perfil.urlWeb || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-xs">Teléfono</div>
            <div class="font-medium">{{ perfil.telefono || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-xs">Correo</div>
            <div class="font-medium">{{ perfil.correoContacto || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-xs">Sector</div>
            <div class="font-medium">{{ perfil.sector || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-xs">Tipo</div>
            <div class="font-medium">{{ perfil.tipoEmpresa || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-xs">Ubicación</div>
            <div class="font-medium">{{ perfil.ubicacion || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-xs">Tamaño</div>
            <div class="font-medium">{{ perfil.tamanioEmpresa || '—' }}</div>
          </div>
          <div>
            <div class="text-slate-400 text-xs">Año de fundación</div>
            <div class="font-medium">{{ perfil.anioFundacion || '—' }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-7">
        <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Descripción</h6>
        <p class="text-slate-600 text-sm whitespace-pre-line">{{ perfil.descripcion || 'Sin descripción.' }}</p>
      </div>
    </div>

    <!-- FORMULARIO (modo edición) -->
    <div v-else class="space-y-5">
      <div class="bg-white border border-slate-200 rounded-2xl p-7">
        <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Información general</h6>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-medium text-sm text-slate-700 mb-1.5">Nombre de la empresa *</label>
            <input v-model="perfil.nombreComercial" type="text" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          </div>
          <div>
            <label class="block font-medium text-sm text-slate-700 mb-1.5">Sitio web</label>
            <input v-model="perfil.urlWeb" type="url" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="https://..." />
          </div>
          <div>
            <label class="block font-medium text-sm text-slate-700 mb-1.5">Razón Social *</label>
            <input v-model="perfil.razonSocial" type="text" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          </div>
          <div>
            <label class="block font-medium text-sm text-slate-700 mb-1.5">NIT</label>
            <input v-model="perfil.nit" type="text" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          </div>
          <div>
            <label class="block font-medium text-sm text-slate-700 mb-1.5">Teléfono</label>
            <input v-model="perfil.telefono" type="text" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          </div>
          <div>
            <label class="block font-medium text-sm text-slate-700 mb-1.5">Correo Comercial</label>
            <input v-model="perfil.correoContacto" type="email" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          </div>
          <div>
            <label class="block font-medium text-sm text-slate-700 mb-1.5">Sector</label>
            <select v-model="perfil.sector" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white">
              <option value="">Seleccionar</option>
              <option>Tecnología</option>
              <option>Marketing</option>
              <option>Finanzas</option>
              <option>Salud</option>
              <option>Educación</option>
              <option>Legal</option>
              <option>Ingeniería</option>
              <option>Comercio</option>
              <option>Construcción</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label class="block font-medium text-sm text-slate-700 mb-1.5">Tipo de Empresa</label>
            <select v-model="perfil.tipoEmpresa" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white">
              <option value="">Seleccionar</option>
              <option>Privada</option>
              <option>Pública</option>
              <option>ONG</option>
              <option>Otra</option>
            </select>
          </div>
          <div>
            <label class="block font-medium text-sm text-slate-700 mb-1.5">Tamaño</label>
            <select v-model="perfil.tamanioEmpresa" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 bg-white">
              <option>1 – 10 empleados</option>
              <option>11 – 50 empleados</option>
              <option>51 – 200 empleados</option>
              <option>201 – 500 empleados</option>
              <option>500+ empleados</option>
            </select>
          </div>
          <div>
            <label class="block font-medium text-sm text-slate-700 mb-1.5">Año de fundación</label>
            <input v-model="perfil.anioFundacion" type="number" min="1900" max="2025" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          </div>
          <div class="md:col-span-2">
            <label class="block font-medium text-sm text-slate-700 mb-1.5">Ubicación</label>
            <input v-model="perfil.ubicacion" type="text" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl p-7">
        <h6 class="font-bold text-slate-800 pb-3 border-b border-slate-200 mb-5">Descripción</h6>
        <textarea v-model="perfil.descripcion" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 min-h-[120px]" placeholder="Describe tu empresa..."></textarea>
      </div>

      <div class="flex justify-end">
        <button @click="guardarCambios" :disabled="loading" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50">
          {{ loading ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </div>

  </div>
</template>