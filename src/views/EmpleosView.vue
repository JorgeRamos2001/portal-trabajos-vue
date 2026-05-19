<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import NavbarPublic from '@/components/NavbarPublic.vue'
import FooterPage from '@/components/FooterPage.vue'

const route = useRoute()
const router = useRouter()

const empleos = ref([])
const categorias = ref([])
const loading = ref(false)
const totalGeneral = ref(0)
const total = ref(0)
const pagina = ref(1)
const totalPaginas = ref(1)

const filtros = ref({
  busqueda: '',
  categoria: '',
  modalidad: '',
  orden: 'recientes'
})

onMounted(async () => {
  // Cargar categorías para el select
  try {
    const { data } = await api.get('/categorias')
    categorias.value = data.data
  } catch {}

  try {
    const { data: statsData } = await api.get('/stats')
    totalGeneral.value = statsData.data.empleosActivos
  } catch {}

  // Tomar filtros de la URL
  if (route.query.categoria) {
    filtros.value.categoria = route.query.categoria
    await cargarEmpleos()
  }
  if (route.query.busqueda) filtros.value.busqueda = route.query.busqueda

  await cargarEmpleos()
})

async function cargarEmpleos() {
  loading.value = true
  try {
    const params = {
      pagina: pagina.value,
      limite: 10
    }
    if (filtros.value.categoria) params.categoria = filtros.value.categoria
    if (filtros.value.busqueda) params.busqueda = filtros.value.busqueda
    if (filtros.value.modalidad) params.modalidad = filtros.value.modalidad

    const { data } = await api.get('/empleos', { params })
    empleos.value = data.empleos || []
    total.value = data.paginacion?.total || 0
    totalPaginas.value = data.paginacion?.totalPaginas || 1
  } catch {}
  loading.value = false
}

function buscar() {
  pagina.value = 1
  router.push({ query: { ...filtros.value } })
  cargarEmpleos()
}

function limpiarFiltros() {
  filtros.value = { busqueda: '', categoria: '', modalidad: '', orden: 'recientes' }
  pagina.value = 1
  router.push({ query: {} })
  cargarEmpleos()
}

function cambiarPagina(p) {
  pagina.value = p
  cargarEmpleos()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function formatearSalario(min, max) {
  return `$${Number(min).toLocaleString()} – $${Number(max).toLocaleString()}/mes`
}

function tiempoRelativo(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Hace 1 día'
  return `Hace ${diff} días`
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <NavbarPublic />

    <!-- Header -->
    <section class="bg-gradient-to-br from-slate-900 to-blue-900 py-12">
      <div class="max-w-6xl mx-auto px-4">
        <h1 class="text-3xl font-extrabold text-white mb-1" style="font-family: 'Sora', sans-serif;">Explorar Empleos</h1>
        <p class="text-slate-300 mb-4">Encuentra entre más de {{ totalGeneral.toLocaleString() }} ofertas activas</p>
        <div class="flex flex-col sm:flex-row gap-2 bg-white rounded-xl p-2 shadow-lg">
          <div class="flex items-center gap-2 flex-1 px-2">
            <span class="text-slate-400">🔍</span>
            <input v-model="filtros.busqueda" @keyup.enter="buscar" type="text" placeholder="Cargo, habilidad o empresa..." class="w-full border-none outline-none py-1 text-slate-700" />
          </div>
          <button @click="buscar" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition" style="font-family: 'Sora', sans-serif;">Buscar</button>
        </div>
      </div>
    </section>

    <!-- Contenido -->
    <section class="flex-1 py-8">
      <div class="max-w-6xl mx-auto px-4 grid lg:grid-cols-4 gap-6">

        <!-- Sidebar filtros -->
        <aside class="lg:col-span-1">
          <div class="bg-white border-2 border-slate-200 rounded-2xl p-6 sticky top-20">
            <div class="flex justify-between items-center mb-4">
              <span class="font-bold text-slate-800" style="font-family: 'Sora', sans-serif;">Filtros</span>
              <button @click="limpiarFiltros" class="text-red-500 text-sm hover:underline">Limpiar</button>
            </div>

            <!-- Categorías -->
            <h6 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Categoría</h6>
            <label v-for="cat in categorias" :key="cat.id" class="flex items-center gap-2 mb-2 text-sm cursor-pointer">
              <input v-model="filtros.categoria" :value="cat.id.toString()" type="radio" name="categoria" class="text-blue-600" />
              {{ cat.nombre }}
            </label>
            <label class="flex items-center gap-2 mb-2 text-sm cursor-pointer">
              <input v-model="filtros.categoria" value="" type="radio" name="categoria" class="text-blue-600" />
              Todas
            </label>

            <hr class="my-4 border-slate-200" />

            <!-- Modalidad -->
            <h6 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Modalidad</h6>
            <label class="flex items-center gap-2 mb-2 text-sm cursor-pointer">
              <input v-model="filtros.modalidad" value="Remoto" type="radio" name="modalidad" class="text-blue-600" />
              Remoto
            </label>
            <label class="flex items-center gap-2 mb-2 text-sm cursor-pointer">
              <input v-model="filtros.modalidad" value="Presencial" type="radio" name="modalidad" class="text-blue-600" />
              Presencial
            </label>
            <label class="flex items-center gap-2 mb-2 text-sm cursor-pointer">
              <input v-model="filtros.modalidad" value="Híbrido" type="radio" name="modalidad" class="text-blue-600" />
              Híbrido
            </label>
            <label class="flex items-center gap-2 mb-2 text-sm cursor-pointer">
              <input v-model="filtros.modalidad" value="" type="radio" name="modalidad" class="text-blue-600" />
              Todas
            </label>

            <hr class="my-4 border-slate-200" />
            <button @click="buscar" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 text-sm transition" style="font-family: 'Sora', sans-serif;">Aplicar filtros</button>
          </div>
        </aside>

        <!-- Lista de empleos -->
        <div class="lg:col-span-3">
          <!-- Results bar -->
          <div class="bg-white border-2 border-slate-200 rounded-xl px-4 py-3 mb-4 flex justify-between items-center flex-wrap gap-2">
            <span class="text-sm text-slate-500"><strong class="text-slate-800">{{ total }} empleos</strong> encontrados</span>
            <select v-model="filtros.orden" class="border-2 border-slate-200 rounded-lg text-sm px-3 py-1.5 text-slate-700 outline-none focus:border-blue-500">
              <option value="recientes">Más recientes</option>
              <option value="salario">Mayor salario</option>
            </select>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="text-center py-12 text-slate-400">Cargando empleos...</div>

          <!-- Lista -->
          <div v-else class="space-y-4">
            <router-link v-for="emp in empleos" :key="emp.id" :to="`/empleos/${emp.id}`"
                         class="block bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-lg transition duration-200">
              <div class="flex gap-4">
                <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between gap-2">
                    <div>
                      <h6 class="font-bold text-slate-800 mb-0.5">{{ emp.titulo }}</h6>
                      <span class="text-slate-500 text-sm">{{ emp.empresa }} · {{ emp.ubicacion }}</span>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <div class="text-emerald-600 font-bold text-sm" style="font-family: 'Sora', sans-serif;">{{ formatearSalario(emp.salarioMin, emp.salarioMax) }}</div>
                      <span class="text-xs text-slate-400">{{ tiempoRelativo(emp.fechaPublicacion) }}</span>
                    </div>
                  </div>
                  <div class="flex gap-2 mt-2">
                    <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">{{ emp.modalidad }}</span>
                    <span class="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded-md">{{ emp.categoria || 'General' }}</span>
                  </div>
                </div>
              </div>
            </router-link>

            <div v-if="empleos.length === 0" class="text-center py-12 text-slate-400">
              No se encontraron empleos con esos filtros
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="totalPaginas > 1" class="flex justify-center mt-6 gap-1">
            <button @click="cambiarPagina(pagina - 1)" :disabled="pagina === 1" class="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-30 hover:bg-slate-100 transition">‹</button>
            <button v-for="p in totalPaginas" :key="p" @click="cambiarPagina(p)"
                    :class="p === pagina ? 'bg-blue-600 text-white' : 'border hover:bg-slate-100'"
                    class="px-3 py-1.5 rounded-lg text-sm transition">{{ p }}</button>
            <button @click="cambiarPagina(pagina + 1)" :disabled="pagina === totalPaginas" class="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-30 hover:bg-slate-100 transition">›</button>
          </div>
        </div>
      </div>
    </section>

    <FooterPage />
  </div>
</template>