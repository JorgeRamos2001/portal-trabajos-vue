<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const auth = useAuthStore()

// Perfil
const perfil = ref({
  nombres: '',
  apellidos: '',
  email: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  descripcion: '',
  urlWeb: '',
  urlLinkedin: '',
  urlGithub: '',
  urlFacebook: '',
  dui: '',
  urlFoto: '',
  urlCV: ''
})

const mensaje = ref('')
const error = ref('')
const loading = ref(false)

// Experiencia
const experiencias = ref([])
const editandoExperiencia = ref(null) // null = nueva, objeto = editar
const formExperiencia = ref({
  puesto: '',
  nombreEmpresa: '',
  descripcionPuesto: '',
  fechaInicio: '',
  fechaFin: '',
  empleoActual: false
})

// Modales
const showModalResumen = ref(false)
const showModalExperiencia = ref(false)
const showModalInfoPersonal = ref(false)

// Info personal para el sidebar
const infoPersonal = ref([
  { icon: 'bi-telephone', label: 'Teléfono', value: '' },
  { icon: 'bi-envelope', label: 'Correo', value: '' },
  { icon: 'bi-geo-alt', label: 'Ubicación', value: '' },
  { icon: 'bi-linkedin', label: 'LinkedIn', value: '' },
  { icon: 'bi-github', label: 'GitHub', value: '' },
  { icon: 'bi-facebook', label: 'Facebook', value: '' }
])

onMounted(async () => {
  await cargarPerfil()
  await cargarExperiencia()
})

async function cargarPerfil() {
  try {
    const { data } = await api.get('/usuarios/perfil/mi-candidato')
    const u = data.data
    perfil.value = {
      nombres: u.nombres || '',
      apellidos: u.apellidos || '',
      email: u.email || '',
      telefono: u.telefonoCandidato || u.telefono || '',
      direccion: u.direccion || '',
      fechaNacimiento: u.fechaNacimiento?.split('T')[0] || '',
      descripcion: u.descripcion || '',
      urlWeb: u.urlWeb || '',
      urlLinkedin: u.urlLinkedin || '',
      urlGithub: u.urlGithub || '',
      urlFacebook: u.urlFacebook || '',
      dui: u.dui || '',
      urlFoto: u.urlFoto ? `http://localhost:3000${u.urlFoto}` : '',
      urlCV: u.urlCV ? `http://localhost:3000${u.urlCV}` : ''
    }
    actualizarInfoPersonal()
  } catch {}
}

function actualizarInfoPersonal() {
  infoPersonal.value = [
    { icon: 'bi-telephone', label: 'Teléfono', value: perfil.value.telefono || '—' },
    { icon: 'bi-envelope', label: 'Correo', value: perfil.value.email || '—' },
    { icon: 'bi-geo-alt', label: 'Ubicación', value: perfil.value.direccion || '—' },
    { icon: 'bi-linkedin', label: 'LinkedIn', value: perfil.value.urlLinkedin || '—' },
    { icon: 'bi-github', label: 'GitHub', value: perfil.value.urlGithub || '—' },
    { icon: 'bi-facebook', label: 'Facebook', value: perfil.value.urlFacebook || '—' }
  ]
}

async function guardarResumen() {
  loading.value = true
  error.value = ''
  try {
    await api.put('/usuarios/candidato', {
      nombres: perfil.value.nombres,
      apellidos: perfil.value.apellidos,
      direccion: perfil.value.direccion,
      fechaNacimiento: perfil.value.fechaNacimiento,
      telefono: perfil.value.telefono,
      descripcion: perfil.value.descripcion,
      urlWeb: perfil.value.urlWeb,
      urlLinkedin: perfil.value.urlLinkedin,
      urlGithub: perfil.value.urlGithub,
      urlFacebook: perfil.value.urlFacebook
    })
    mensaje.value = 'Resumen actualizado'
    showModalResumen.value = false
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar'
  }
  loading.value = false
}

async function guardarInfoPersonal() {
  loading.value = true
  try {
    await api.put('/usuarios/candidato', {
      nombres: perfil.value.nombres,
      apellidos: perfil.value.apellidos,
      direccion: perfil.value.direccion,
      fechaNacimiento: perfil.value.fechaNacimiento,
      telefono: perfil.value.telefono,
      descripcion: perfil.value.descripcion,
      urlWeb: perfil.value.urlWeb,
      urlLinkedin: perfil.value.urlLinkedin,
      urlGithub: perfil.value.urlGithub,
      urlFacebook: perfil.value.urlFacebook
    })
    actualizarInfoPersonal()
    mensaje.value = 'Información actualizada'
    showModalInfoPersonal.value = false
  } catch (err) {
    error.value = err.response?.data?.message || 'Error'
  }
  loading.value = false
}

// Experiencia laboral
async function cargarExperiencia() {
  try {
    const { data } = await api.get('/experiencia')
    experiencias.value = data.data || []
  } catch {}
}

function abrirModalExperiencia(exp = null) {
  if (exp) {
    editandoExperiencia.value = exp
    formExperiencia.value = {
      puesto: exp.puesto || '',
      nombreEmpresa: exp.nombreEmpresa || '',
      descripcionPuesto: exp.descrepcionPuesto || '',
      fechaInicio: exp.fechaInicio?.split('T')[0] || '',
      fechaFin: exp.fechaFin?.split('T')[0] || '',
      empleoActual: exp.empleoActual || false
    }
  } else {
    editandoExperiencia.value = null
    formExperiencia.value = {
      puesto: '',
      nombreEmpresa: '',
      descripcionPuesto: '',
      fechaInicio: '',
      fechaFin: '',
      empleoActual: false
    }
  }
  showModalExperiencia.value = true
}

async function guardarExperiencia() {
  loading.value = true
  try {
    if (editandoExperiencia.value) {
      await api.put(`/experiencia/${editandoExperiencia.value.id}`, formExperiencia.value)
    } else {
      await api.post('/experiencia', formExperiencia.value)
    }
    showModalExperiencia.value = false
    await cargarExperiencia()
  } catch (err) {
    error.value = err.response?.data?.message || 'Error'
  }
  loading.value = false
}

async function eliminarExperiencia(id) {
  if (!confirm('¿Eliminar esta experiencia?')) return
  try {
    await api.delete(`/experiencia/${id}`)
    await cargarExperiencia()
  } catch {}
}

function formatearFecha(fecha) {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-SV', { month: 'short', year: 'numeric' })
}

function calcularDuracion(inicio, fin, actual) {
  if (!inicio) return ''
  const start = new Date(inicio)
  const end = actual ? new Date() : new Date(fin)
  const años = Math.floor((end - start) / (1000 * 60 * 60 * 24 * 365))
  const meses = Math.floor((end - start) / (1000 * 60 * 60 * 24 * 30)) % 12
  if (años > 0 && meses > 0) return `${años} años, ${meses} meses`
  if (años > 0) return `${años} años`
  return `${meses} meses`
}

const subiendoCV = ref(false)

async function subirCV(e) {
  const file = e.target.files[0]
  if (!file) return
  subiendoCV.value = true
  try {
    const formData = new FormData()  // ✅ Agregar esta línea
    formData.append('cv', file)
    const { data } = await api.put('/usuarios/candidato/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    perfil.value.urlCV = `http://localhost:3000${data.data.urlCV}`
    mensaje.value = 'CV subido exitosamente'
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al subir CV'
  }
  subiendoCV.value = false
}

async function subirFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  try {
    const formData = new FormData()
    formData.append('foto', file)
    const { data } = await api.put('/usuarios/foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    perfil.value.urlFoto = `http://localhost:3000${data.data.urlFoto}` // Usar la URL que devuelve el backend
    mensaje.value = 'Foto actualizada'
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al subir foto'
  }
}
</script>

<template>
  <div class="p-7">

    <!-- PROFILE HERO -->
    <div class="rounded-2xl overflow-hidden mb-6 shadow-sm">
      <!-- Cover -->
      <div class="h-28 bg-gradient-to-r from-slate-800 via-blue-600 to-emerald-500/40"></div>
      <!-- Body -->
      <div class="bg-white px-7 pt-0 pb-7">
        <div class="flex items-end gap-6 flex-wrap">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-blue-600 to-emerald-400 flex items-center justify-center text-white font-extrabold text-3xl border-4 border-white -mt-11 shadow-lg overflow-hidden">
              <img v-if="perfil.urlFoto" :src="perfil.urlFoto" class="w-full h-full object-cover" />
              <span v-else>{{ perfil.nombres?.charAt(0) }}{{ perfil.apellidos?.charAt(0) }}</span>
            </div>
            <label class="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs cursor-pointer hover:bg-blue-700 transition">
              <i class="bi bi-camera-fill"></i>
              <input type="file" accept="image/*" @change="subirFoto" class="hidden" />
            </label>
          </div>
          <!-- Info -->
          <div class="flex-1 pb-1">
            <h4 class="font-bold text-xl text-slate-800 mb-1">{{ perfil.nombres }} {{ perfil.apellidos }}</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- LEFT COLUMN -->
      <div class="lg:col-span-2 flex flex-col gap-5">

        <!-- RESUMEN PROFESIONAL -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <h6 class="font-bold text-slate-800">Resumen profesional</h6>
            <button
                @click="showModalResumen = true"
                class="border border-slate-200 text-slate-500 text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              <i class="bi bi-pencil"></i>
            </button>
          </div>
          <textarea
              v-model="perfil.descripcion"
              class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-600 resize-none focus:outline-none bg-slate-50"
              rows="4"
              readonly
          ></textarea>
        </div>

        <!-- EXPERIENCIA LABORAL -->
        <!-- EXPERIENCIA LABORAL -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <h6 class="font-bold text-slate-800">Experiencia laboral</h6>
            <button @click="abrirModalExperiencia()"
                    class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition">
              + Agregar
            </button>
          </div>

          <div v-if="experiencias.length === 0" class="text-slate-400 text-sm text-center py-4">
            No has agregado experiencia laboral
          </div>

          <div v-for="(exp, i) in experiencias" :key="exp.id" class="flex gap-4 relative"
               :class="i < experiencias.length - 1 ? 'pb-6 before:absolute before:left-5 before:top-10 before:bottom-0 before:w-0.5 before:bg-slate-200' : ''">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">🏢</div>
            <div class="flex-1">
              <div class="flex items-start justify-between flex-wrap">
                <div>
                  <div class="font-bold text-slate-800 text-sm">{{ exp.puesto }}</div>
                  <div class="text-slate-500 text-xs">{{ exp.nombreEmpresa }}</div>
                  <div class="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                    <i class="bi bi-calendar3"></i> {{ formatearFecha(exp.fechaInicio) }} – {{ exp.empleoActual ? 'Presente' : formatearFecha(exp.fechaFin) }} · {{ calcularDuracion(exp.fechaInicio, exp.fechaFin, exp.empleoActual) }}
                  </div>
                </div>
                <div class="flex gap-1 mt-1">
                  <button @click="abrirModalExperiencia(exp)" class="border border-slate-200 text-slate-500 px-2 py-1 rounded-lg text-xs hover:bg-slate-50 transition">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="eliminarExperiencia(exp.id)" class="border border-red-200 text-red-500 px-2 py-1 rounded-lg text-xs hover:bg-red-50 transition">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <p class="mt-2 text-xs text-slate-500 leading-relaxed">{{ exp.descrepcionPuesto }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="flex flex-col gap-5">

        <!-- INFORMACIÓN PERSONAL -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <h6 class="font-bold text-slate-800">Información personal</h6>
            <button
                @click="showModalInfoPersonal = true"
                class="border border-slate-200 text-slate-500 text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              <i class="bi bi-pencil"></i>
            </button>
          </div>

          <div v-for="item in infoPersonal" :key="item.label" class="flex items-start gap-2.5 mb-3.5 last:mb-0">
            <i :class="['bi', item.icon, 'text-blue-600 mt-0.5 flex-shrink-0']"></i>
            <div>
              <div class="text-slate-400 text-xs">{{ item.label }}</div>
              <div class="text-sm font-medium text-slate-800">{{ item.value }}</div>
            </div>
          </div>

          <div class="flex gap-2">
            <span class="text-blue-500">📄</span>
            <div>
              <div class="text-slate-400 text-xs">CV</div>
              <div v-if="perfil.urlCV" class="font-medium text-sm">
                <a :href="perfil.urlCV" target="_blank" class="text-blue-600 hover:underline">Ver CV</a>
              </div>
              <label class="text-blue-600 text-xs cursor-pointer hover:underline mt-1 inline-block">
                {{ subiendoCV ? 'Subiendo...' : perfil.urlCV ? 'Cambiar CV' : 'Subir CV' }}
                <input type="file" accept=".pdf" @change="subirCV" class="hidden" :disabled="subiendoCV" />
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL: Resumen -->
    <Teleport to="body">
      <div v-if="showModalResumen" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <h5 class="font-bold text-slate-800">Editar Resumen Personal</h5>
            <button @click="showModalResumen = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>
          <div class="p-6">
            <label class="block font-bold text-sm text-slate-700 mb-1">Sobre mí</label>
            <p class="text-slate-400 text-xs mb-3">Escribe una breve descripción de tu perfil profesional, tus metas y lo que te hace destacar.</p>
            <textarea
                v-model="perfil.descripcion"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                rows="6"
                placeholder="Ej: Soy un desarrollador apasionado por la tecnología con 2 años de experiencia..."
            ></textarea>
          </div>
          <div class="flex justify-end gap-3 px-6 pb-6">
            <button @click="showModalResumen = false" class="border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition">Cancelar</button>
            <button @click="guardarResumen" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: Experiencia -->
    <Teleport to="body">
      <div v-if="showModalExperiencia" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <h5 class="font-bold text-slate-800">Agregar Experiencia Laboral</h5>
            <button @click="showModalExperiencia = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div>
              <label class="block font-bold text-sm text-slate-700 mb-1">Puesto de trabajo</label>
              <input v-model="formExperiencia.puesto" type="text" placeholder="Ej: Desarrollador Backend" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
            </div>
            <div>
              <label class="block font-bold text-sm text-slate-700 mb-1">Empresa</label>
              <input v-model="formExperiencia.nombreEmpresa" type="text" placeholder="Nombre de la empresa" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-sm text-slate-700 mb-1">Fecha de inicio</label>
                <input v-model="formExperiencia.fechaInicio" type="date" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              </div>
              <div>
                <label class="block font-bold text-sm text-slate-700 mb-1">Fecha de fin</label>
                <input v-model="formExperiencia.fechaFin" type="date" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                <label class="flex items-center gap-2 mt-2 text-sm text-slate-600 cursor-pointer">
                  <input v-model="formExperiencia.empleoActual" type="checkbox" class="rounded" /> Trabajo actualmente aquí
                </label>
              </div>
            </div>
            <div>
              <label class="block font-bold text-sm text-slate-700 mb-1">Descripción</label>
              <textarea v-model="formExperiencia.descripcionPuesto" rows="4" placeholder="Describe tus responsabilidades y logros..." class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"></textarea>
            </div>
          </div>
          <div class="flex justify-end gap-3 px-6 pb-6">
            <button @click="showModalExperiencia = false" class="border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition">Cancelar</button>
            <button @click="guardarExperiencia" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Guardar Experiencia</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- MODAL: Info Personal -->
    <Teleport to="body">
      <div v-if="showModalInfoPersonal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <h5 class="font-bold text-slate-800">Editar Información Personal</h5>
            <button @click="showModalInfoPersonal = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-sm text-slate-700 mb-1"><i class="bi bi-telephone mr-1"></i>Teléfono</label>
                <input v-model="perfil.telefono" type="text" placeholder="+503 0000-0000" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              </div>
              <div>
                <label class="block font-bold text-sm text-slate-700 mb-1"><i class="bi bi-geo-alt mr-1"></i>Ubicación</label>
                <input v-model="perfil.direccion" type="text" placeholder="Ciudad, País" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              </div>
            </div>
            <div>
              <label class="block font-bold text-sm text-slate-700 mb-1"><i class="bi bi-envelope mr-1"></i>Correo Electrónico</label>
              <input v-model="perfil.email" type="email" placeholder="correo@ejemplo.com" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
            </div>
            <hr class="border-slate-200" />
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Redes Sociales y Links</p>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-sm text-slate-700 mb-1"><i class="bi bi-linkedin mr-1"></i>LinkedIn</label>
                <input v-model="perfil.urlLinkedin" type="url" placeholder="https://linkedin.com/in/usuario" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              </div>
              <div>
                <label class="block font-bold text-sm text-slate-700 mb-1"><i class="bi bi-github mr-1"></i>GitHub</label>
                <input v-model="perfil.urlGithub" type="url" placeholder="https://github.com/usuario" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              </div>
            </div>
            <div>
              <label class="block font-bold text-sm text-slate-700 mb-1"><i class="bi bi-facebook mr-1"></i>Facebook</label>
              <input v-model="perfil.urlFacebook" type="url" placeholder="https://facebook.com/usuario" class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
            </div>
          </div>
          <div class="flex justify-end gap-3 px-6 pb-6">
            <button @click="showModalInfoPersonal = false" class="border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition">Cancelar</button>
            <button @click="guardarInfoPersonal" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Guardar Cambios</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>