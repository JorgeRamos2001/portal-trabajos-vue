<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const route = useRoute()
const auth = useAuthStore()

const candidato = ref(null)
const experiencias = ref([])
const loading = ref(true)

const infoPersonal = ref([])

onMounted(async () => {
  console.log('ID del candidato:', route.params.id)
  try {
    // Cargar perfil del candidato
    const { data: perfilData } = await api.get(`/usuarios/publico/candidato/${route.params.id}`)
    candidato.value = perfilData.data

    // Cargar experiencia laboral
    try {
      const { data: expData } = await api.get(`/experiencia/candidato/${route.params.id}`)
      experiencias.value = expData.data || []
    } catch {}

    // Construir info personal
    infoPersonal.value = [
      { icon: 'bi-telephone', label: 'Teléfono', value: candidato.value?.telefono || '—' },
      { icon: 'bi-envelope', label: 'Correo', value: candidato.value?.email || '—' },
      { icon: 'bi-geo-alt', label: 'Ubicación', value: candidato.value?.direccion || '—' },
      { icon: 'bi-linkedin', label: 'LinkedIn', value: candidato.value?.urlLinkedin || '—' },
      { icon: 'bi-github', label: 'GitHub', value: candidato.value?.urlGithub || '—' },
      { icon: 'bi-facebook', label: 'Facebook', value: candidato.value?.urlFacebook || '—' }
    ]
  } catch (error) {
    console.error('Error al cargar perfil:', error)
  } finally {
    loading.value = false
  }
})

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

function urlCompleta(ruta) {
  if (!ruta) return ''
  return ruta.startsWith('http') ? ruta : `http://localhost:3000${ruta}`
}
</script>

<template>
  <div class="p-7">

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-slate-400">Cargando perfil...</div>

    <!-- Contenido del perfil -->
    <div v-else-if="candidato">

      <!-- PROFILE HERO -->
      <div class="rounded-2xl overflow-hidden mb-6 shadow-sm">
        <!-- Cover -->
        <div class="h-28 bg-gradient-to-r from-slate-800 via-blue-600 to-emerald-500/40"></div>
        <!-- Body -->
        <div class="bg-white px-7 pt-0 pb-7">
          <div class="flex items-end gap-6 flex-wrap">
            <!-- Avatar -->
            <div class="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-blue-600 to-emerald-400 flex items-center justify-center text-white font-extrabold text-3xl border-4 border-white -mt-11 shadow-lg flex-shrink-0 overflow-hidden">
              <img v-if="candidato.urlFoto" :src="urlCompleta(candidato.urlFoto)" class="w-full h-full object-cover" />
              <span v-else>{{ candidato.nombres?.charAt(0) }}{{ candidato.apellidos?.charAt(0) }}</span>
            </div>
            <!-- Info -->
            <div class="flex-1 pb-1">
              <h4 class="font-bold text-xl text-slate-800 mb-1">{{ candidato.nombres }} {{ candidato.apellidos }}</h4>
              <div class="text-slate-500 text-sm">
                {{ candidato.profesion || candidato.titulo || 'Sin título profesional' }}
                <span v-if="candidato.añosExperiencia"> · {{ candidato.añosExperiencia }} años de experiencia</span>
              </div>
            </div>
            <!-- CV Download -->
            <div v-if="candidato.urlCV" class="flex-shrink-0">
              <a :href="urlCompleta(candidato.urlCV)" target="_blank"
                 class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2">
                <i class="bi bi-download"></i> Descargar CV
              </a>
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
            <div class="pb-3 border-b border-slate-200 mb-4">
              <h6 class="font-bold text-slate-800">Resumen profesional</h6>
            </div>
            <div class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {{ candidato.descripcion || 'No ha agregado un resumen profesional.' }}
            </div>
          </div>

          <!-- EXPERIENCIA LABORAL -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6">
            <div class="pb-3 border-b border-slate-200 mb-4">
              <h6 class="font-bold text-slate-800">Experiencia laboral</h6>
            </div>

            <div v-if="experiencias.length === 0" class="text-slate-400 text-sm text-center py-4">
              No ha agregado experiencia laboral
            </div>

            <div v-for="(exp, i) in experiencias" :key="exp.id"
                 class="flex gap-4 relative"
                 :class="i < experiencias.length - 1 ? 'pb-6 before:absolute before:left-5 before:top-10 before:bottom-0 before:w-0.5 before:bg-slate-200' : ''">
              <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">🏢</div>
              <div class="flex-1">
                <div class="font-bold text-slate-800 text-sm">{{ exp.puesto }}</div>
                <div class="text-slate-500 text-xs">{{ exp.nombreEmpresa }}</div>
                <div class="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                  <i class="bi bi-calendar3"></i>
                  {{ formatearFecha(exp.fechaInicio) }} – {{ exp.empleoActual ? 'Presente' : formatearFecha(exp.fechaFin) }}
                  · {{ calcularDuracion(exp.fechaInicio, exp.fechaFin, exp.empleoActual) }}
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
            <div class="pb-3 border-b border-slate-200 mb-4">
              <h6 class="font-bold text-slate-800">Información personal</h6>
            </div>

            <div v-for="item in infoPersonal" :key="item.label" class="flex items-start gap-2.5 mb-3.5 last:mb-0">
              <i :class="['bi', item.icon, 'text-blue-600 mt-0.5 flex-shrink-0']"></i>
              <div>
                <div class="text-slate-400 text-xs">{{ item.label }}</div>
                <div class="text-sm font-medium text-slate-800">
                  <a v-if="item.value.startsWith('http')" :href="item.value" target="_blank" class="text-blue-600 hover:underline">
                    {{ item.value }}
                  </a>
                  <span v-else>{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- DUI -->
          <div v-if="candidato.dui" class="bg-white border border-slate-200 rounded-2xl p-6">
            <div class="pb-3 border-b border-slate-200 mb-4">
              <h6 class="font-bold text-slate-800">Documentación</h6>
            </div>
            <div class="flex items-start gap-2.5">
              <i class="bi bi-file-text text-blue-600 mt-0.5 flex-shrink-0"></i>
              <div>
                <div class="text-slate-400 text-xs">DUI</div>
                <div class="text-sm font-medium text-slate-800">{{ candidato.dui }}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="text-center py-12 text-slate-400">
      Perfil no encontrado
    </div>

  </div>
</template>