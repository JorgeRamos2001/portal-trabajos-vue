<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import NavbarPublic from "@/components/NavbarPublic.vue";
import FooterPage from "@/components/FooterPage.vue";

const stats = ref({
  empleosActivos: 0,
  empresasRegistradas: 0,
  postulantesRegistrados: 0,
  empresasDestacadas: []
})
const empleos = ref([])
const categorias = ref([])

const iconosCategoria = {
  'Tecnología': '💻',
  'Marketing': '📊',
  'Finanzas': '💰',
  'Diseño': '🎨',
  'Salud': '🏥',
  'Legal': '⚖️',
  'Educación': '🎓',
  'Ingeniería': '🔧'
}

function getIcono(nombre) {
  return iconosCategoria[nombre] || '📌'
}

const busqueda = ref('')
const area = ref('Todas las áreas')

onMounted(async () => {
  try {
    const [resEmpleos, resStats, resCategorias] = await Promise.all([
      api.get('/empleos?limite=3'),
      api.get('/stats'),
      api.get('/categorias')
    ])
    empleos.value = resEmpleos.data.empleos || []
    stats.value = resStats.data.data
    categorias.value = resCategorias.data.data
  } catch {
    empleos.value = []
  }
})


function buscar() {
  // Implementar búsqueda
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">

    <!-- NAVBAR -->
    <navbar-public></navbar-public>

    <!-- HERO -->
    <section class="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 relative overflow-hidden py-24 lg:py-28">
      <div class="absolute w-[600px] h-[600px] bg-emerald-500/10 rounded-full -top-32 -right-32 blur-3xl"></div>
      <div class="absolute w-[400px] h-[400px] bg-blue-500/20 rounded-full -bottom-20 -left-20 blur-3xl"></div>

      <div class="max-w-6xl mx-auto px-4 relative z-10">
        <div class="grid lg:grid-cols-2 gap-10 items-center">

          <!-- Texto -->
          <div>
            <h1 class="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4" style="font-family: 'Sora', sans-serif;">
              Encuentra el empleo que <span class="text-emerald-400">mereces</span>
            </h1>
            <p class="text-slate-300 text-lg mb-6 max-w-xl">
              Conectamos talento con oportunidades reales. Miles de empresas confían en PortalTrabajos para encontrar a sus próximos colaboradores.
            </p>

            <!-- Search Box -->
            <div class="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2 shadow-lg shadow-black/20 mb-6">
              <div class="flex items-center gap-2 flex-1 px-2">
                <span class="text-slate-400">🔍</span>
                <input v-model="busqueda" type="text" placeholder="Cargo, habilidad o empresa..." class="w-full border-none outline-none text-slate-700 py-1" />
              </div>
              <select v-model="area" class="border-none outline-none text-slate-500 bg-transparent py-1 sm:border-l sm:border-slate-200 sm:pl-3">
                <option>Todas las áreas</option>
                <option>Tecnología</option>
                <option>Marketing</option>
                <option>Finanzas</option>
              </select>
              <button @click="buscar" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition" style="font-family: 'Sora', sans-serif;">
                Buscar
              </button>
            </div>

            <div class="flex gap-6 text-white text-sm">
              <div><strong class="text-lg">{{ stats.empleosActivos.toLocaleString() }}+</strong> <span class="text-slate-400">Empleos activos</span></div>
              <div><strong class="text-lg">{{ stats.empresasRegistradas.toLocaleString() }}+</strong> <span class="text-slate-400">Empresas</span></div>
              <div><strong class="text-lg">{{ stats.postulantesRegistrados.toLocaleString() }}+</strong> <span class="text-slate-400">Candidatos</span></div>
            </div>
          </div>

          <!-- Imagen decorativa (solo desktop) -->
          <div class="hidden lg:block relative h-[340px]">
            <div class="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"></div>
            <div class="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl p-3 flex items-center gap-3 shadow-lg w-[280px]">
              <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg">💼</div>
              <div class="flex-1">
                <div class="font-semibold text-sm text-slate-800">Desarrollador Full Stack</div>
                <div class="text-xs text-slate-500">TechCorp · Remoto</div>
              </div>
              <span class="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded">Nuevo</span>
            </div>
            <div class="absolute bottom-16 left-5 bg-white rounded-xl p-3 flex items-center gap-3 shadow-lg w-[220px]">
              <div class="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-lg">📈</div>
              <div>
                <div class="font-bold text-emerald-500">+38%</div>
                <div class="text-xs text-slate-500">Más contrataciones</div>
              </div>
            </div>
            <div class="absolute bottom-5 right-5 bg-white rounded-xl p-3 flex items-center gap-3 shadow-lg w-[200px]">
              <div class="flex">
                <div class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">A</div>
                <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold -ml-2">B</div>
                <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold -ml-2">C</div>
              </div>
              <div>
                <div class="font-semibold text-sm text-slate-800">Muchos candidatos</div>
                <div class="text-xs text-slate-500">registrados hoy</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- STATS BAR -->
    <section class="bg-white border-b border-slate-200 py-6">
      <div class="max-w-3xl mx-auto grid grid-cols-3 text-center">
        <div class="border-r border-slate-200 px-4">
          <h3 class="text-2xl font-extrabold text-blue-600">{{ stats.empleosActivos.toLocaleString() }}+</h3>
          <p class="text-slate-500 text-sm">Empleos activos</p>
        </div>
        <div class="border-r border-slate-200 px-4">
          <h3 class="text-2xl font-extrabold text-blue-600">{{ stats.empresasRegistradas.toLocaleString() }}+</h3>
          <p class="text-slate-500 text-sm">Empresas registradas</p>
        </div>
        <div class="px-4">
          <h3 class="text-2xl font-extrabold text-blue-600">{{ stats.postulantesRegistrados.toLocaleString() }}+</h3>
          <p class="text-slate-500 text-sm">Candidatos</p>
        </div>
      </div>
    </section>

    <!-- CATEGORÍAS -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-8">
          <div class="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2">Explora por área</div>
          <h2 class="text-3xl font-extrabold text-slate-900" style="font-family: 'Sora', sans-serif;">Categorías de empleo</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link v-for="cat in categorias" :key="cat.id" :to="{ path: '/empleos', query: { categoria: cat.id } }" class="bg-white border-2 border-slate-200 rounded-xl p-6 text-center hover:border-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition duration-200">
            <span class="text-3xl block mb-3">{{ getIcono(cat.nombre) }}</span>
            <h6 class="font-semibold text-slate-800 mb-1" style="font-family: 'Sora', sans-serif;">{{ cat.nombre }}</h6>
            <small class="text-slate-500">{{ cat.cantidad }} empleos</small>
          </router-link>
        </div>
      </div>
    </section>

    <!-- EMPLEOS RECIENTES -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex justify-between items-end mb-8">
          <div>
            <div class="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-1">Oportunidades destacadas</div>
            <h2 class="text-3xl font-extrabold text-slate-900" style="font-family: 'Sora', sans-serif;">Empleos recientes</h2>
          </div>
          <router-link to="/empleos" class="text-blue-600 border border-blue-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition" style="font-family: 'Sora', sans-serif;">
            Ver todos →
          </router-link>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="emp in empleos" :key="emp.id" class="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition duration-200">
            <div class="flex gap-3 mb-4">
              <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
              <div class="flex-1">
                <h6 class="font-bold text-slate-800 mb-0.5">{{ emp.titulo }}</h6>
                <span class="text-slate-500 text-sm">{{ emp.empresa }}</span>
              </div>
              <button class="w-9 h-9 border-2 border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition flex-shrink-0">🔖</button>
            </div>
            <div class="flex gap-2 mb-3">
              <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">{{ emp.modalidad }}</span>
              <span class="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-md">Tiempo completo</span>
            </div>
            <div class="flex items-center gap-3 text-slate-500 text-sm mb-3">
              <span>📍 {{ emp.ubicacion }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-emerald-600 font-bold" style="font-family: 'Sora', sans-serif;">${{ emp.salarioMin }} – ${{ emp.salarioMax }}/mes</span>
              <router-link :to="`/empleos/${emp.id}`" class="bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition" style="font-family: 'Sora', sans-serif;">Ver oferta</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CÓMO FUNCIONA -->
    <section class="py-16">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-10">
          <div class="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2">Simple y efectivo</div>
          <h2 class="text-3xl font-extrabold text-slate-900" style="font-family: 'Sora', sans-serif;">¿Cómo funciona?</h2>
          <p class="text-slate-500 mt-2">Encuentra tu próximo trabajo en 3 pasos</p>
        </div>
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div class="relative">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4" style="font-family: 'Sora', sans-serif;">1</div>
            <h5 class="font-bold text-slate-800 mb-2">Crea tu perfil</h5>
            <p class="text-slate-500 text-sm">Regístrate gratis y completa tu perfil con tu experiencia y habilidades.</p>
            <div class="hidden md:block absolute top-7 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
          </div>
          <div class="relative">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4" style="font-family: 'Sora', sans-serif;">2</div>
            <h5 class="font-bold text-slate-800 mb-2">Explora empleos</h5>
            <p class="text-slate-500 text-sm">Filtra por categoría, ubicación, salario y tipo de empleo.</p>
            <div class="hidden md:block absolute top-7 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
          </div>
          <div>
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4" style="font-family: 'Sora', sans-serif;">3</div>
            <h5 class="font-bold text-slate-800 mb-2">Aplica y conecta</h5>
            <p class="text-slate-500 text-sm">Envía tu aplicación con un clic y espera la respuesta de la empresa.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- EMPRESAS DESTACADAS -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-8">
          <div class="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2">Las mejores empresas te esperan</div>
          <h2 class="text-3xl font-extrabold text-slate-900" style="font-family: 'Sora', sans-serif;">Empresas destacadas</h2>
        </div>
        <div class="flex flex-wrap justify-center gap-4">
          <div v-for="emp in stats.empresasDestacadas" :key="emp.id"
               class="bg-white border-2 border-slate-200 rounded-xl px-8 py-5 text-center font-semibold text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transition cursor-pointer"
               style="font-family: 'Sora', sans-serif;">
            {{ emp.nombreComercial }}
          </div>
        </div>
        <div v-if="stats.empresasDestacadas.length === 0" class="text-center text-slate-400 py-8">
          Aún no hay empresas registradas
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer-page></footer-page>

  </div>
</template>