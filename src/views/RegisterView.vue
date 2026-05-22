<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const tipoCuenta = ref('postulante')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

const form = reactive({
  nombres: '',
  apellidos: '',
  correo: '',
  password: '',
  dui: '',
  fechaNacimiento: '',
  direccion: '',
  telefono: '',
  nombreEmpresa: '',
  razonSocial: '',
  nit: '',
  ubicacion: '',
  correoEmpresa: '',
  sector: '',
  tipoEmpresa: '',
  descripcion: ''
})

async function handleRegister() {
  error.value = ''
  loading.value = true

  try {
    if (tipoCuenta.value === 'postulante') {
      const datos = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        password: form.password,
        dui: form.dui,
        fechaNacimiento: form.fechaNacimiento,
        direccion: form.direccion,
        telefono: form.telefono
      }
      await auth.registerPostulante(datos)
    } else {
      const datos = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        password: form.password,
        nombreEmpresa: form.nombreEmpresa,
        razonSocial: form.razonSocial,
        nit: form.nit,
        ubicacion: form.ubicacion,
        telefono: form.telefono,
        correoEmpresa: form.correoEmpresa,
        sector: form.sector,
        tipoEmpresa: form.tipoEmpresa,
        descripcion: form.descripcion
      }
      await auth.registerEmpleador(datos)
    }
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Error al registrarse'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">

    <nav class="bg-white border-b border-slate-200">
      <div class="container mx-auto px-4 h-16 flex items-center">
        <router-link to="/" class="text-xl font-extrabold text-blue-600" style="font-family: 'Sora', sans-serif;">
          Portal<span class="text-emerald-500">Trabajos</span>
        </router-link>
      </div>
    </nav>

    <div class="flex-1 flex">

      <div class="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 relative overflow-hidden items-center justify-center p-16">        <div class="absolute w-80 h-80 bg-blue-500/20 rounded-full -bottom-20 -left-20 blur-3xl"></div>
        <div class="absolute w-96 h-96 bg-emerald-500/15 rounded-full -top-24 -right-24 blur-3xl"></div>
        <div class="absolute w-80 h-80 bg-blue-500/20 rounded-full -bottom-20 -left-20 blur-3xl"></div>
        <div class="relative z-10 w-full">
          <h1 class="text-3xl font-extrabold text-white mb-2 leading-tight" style="font-family: 'Sora', sans-serif;">
            Únete a la comunidad<br/>de <span class="text-emerald-400">Portal Trabajos</span>
          </h1>
          <p class="text-white/50 text-lg mb-10">Gratis. Siempre.</p>
          <div class="space-y-5">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">🔍</div>
              <div class="text-white/85 text-sm"><strong class="text-white">Acceso a miles de ofertas</strong><br/>Aplica con un clic a empleos en toda la región</div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">📄</div>
              <div class="text-white/85 text-sm"><strong class="text-white">CV y perfil profesional</strong><br/>Crea tu perfil y haz que los reclutadores te encuentren</div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">💬</div>
              <div class="text-white/85 text-sm"><strong class="text-white">Comunidad activa</strong><br/>Foro, recursos y networking con +12,000 profesionales</div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">🔔</div>
              <div class="text-white/85 text-sm"><strong class="text-white">Alertas personalizadas</strong><br/>Recibe notificaciones de empleos que coincidan con tu perfil</div>
            </div>
          </div>
          <div class="mt-6 flex gap-1.5">
            <span class="h-2 w-6 bg-white rounded-full"></span>
            <span class="h-2 w-2 bg-white/30 rounded-full"></span>
            <span class="h-2 w-2 bg-white/30 rounded-full"></span>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-[560px] bg-white overflow-y-auto max-h-[calc(100vh-64px)]">
        <div class="p-8 lg:p-10">

          <div class="text-center mb-6">
            <div class="text-2xl font-extrabold text-blue-600 mb-2" style="font-family: 'Sora', sans-serif;">
              Portal<span class="text-emerald-500">Trabajos</span>
            </div>
            <h2 class="text-xl font-bold text-slate-800 mb-1">Crea tu cuenta gratis</h2>
            <p class="text-slate-500 text-sm">Sin tarjeta de crédito. Cancela cuando quieras.</p>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {{ error }}
          </div>

          <div class="mb-6">
            <label class="block text-sm font-semibold text-slate-700 mb-2">¿Cómo vas a usar Portal Trabajos?</label>
            <div class="grid grid-cols-2 gap-2">
              <div @click="tipoCuenta = 'postulante'; error = ''"
                   :class="tipoCuenta === 'postulante' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400'"
                   class="border-2 rounded-xl p-4 cursor-pointer text-center transition">
                <div class="text-2xl mb-1">👤</div>
                <h6 class="font-bold text-sm text-slate-800" style="font-family: 'Sora', sans-serif;">Busco empleo</h6>
                <p class="text-xs text-slate-500 mt-0.5">Quiero encontrar trabajo</p>
              </div>
              <div @click="tipoCuenta = 'empleador'; error = ''"
                   :class="tipoCuenta === 'empleador' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400'"
                   class="border-2 rounded-xl p-4 cursor-pointer text-center transition">
                <div class="text-2xl mb-1">🏢</div>
                <h6 class="font-bold text-sm text-slate-800" style="font-family: 'Sora', sans-serif;">Soy empleador</h6>
                <p class="text-xs text-slate-500 mt-0.5">Quiero publicar empleos</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-3">

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input v-model="form.nombres" type="text" required placeholder="María"
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                <input v-model="form.apellidos" type="text" required placeholder="Rodríguez"
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
              <input v-model="form.correo" type="email" required placeholder="tu@correo.com"
                     class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <div class="relative">
                <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required placeholder="Mínimo 5 caracteres"
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-2.5 text-slate-400">👁</button>
              </div>
            </div>

            <!-- Postulante -->
            <template v-if="tipoCuenta === 'postulante'">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">DUI</label>
                  <input v-model="form.dui" type="text" required placeholder="00000000-0"
                         class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Fecha Nacimiento</label>
                  <input v-model="form.fechaNacimiento" type="date" required
                         class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                <input v-model="form.direccion" type="text" required placeholder="Tu dirección"
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input v-model="form.telefono" type="text" required placeholder="7777-7777"
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
              </div>
            </template>

            <!-- Empleador -->
            <template v-if="tipoCuenta === 'empleador'">
              <p class="text-sm font-semibold text-slate-700 pt-3 pb-1">Datos de la Empresa</p>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Nombre de la Empresa</label>
                <input v-model="form.nombreEmpresa" type="text" required placeholder="Mi Empresa"
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Razón Social</label>
                <input v-model="form.razonSocial" type="text" required placeholder="Mi Empresa S.A. de C.V."
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">NIT</label>
                <input v-model="form.nit" type="text" required placeholder="0000-000000-000-0"
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                <input v-model="form.ubicacion" type="text" required placeholder="San Salvador"
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                <select v-model="form.sector" required class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition bg-white">
                  <option value="">Selecciona un sector</option>
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
                <label class="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <select v-model="form.tipoEmpresa" required
                        class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition bg-white">
                  <option value="">Selecciona una opción</option>
                  <option>Privada</option>
                  <option>Publica</option>
                  <option>ONG</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea v-model="form.descripcion" rows="3" placeholder="Describe tu empresa..."
                          class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"></textarea>
              </div>
              <p class="text-sm font-semibold text-slate-700 pt-3 pb-1">Datos de contacto</p>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input v-model="form.telefono" type="text" required placeholder="2222-2222"
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Correo Comercial</label>
                <input v-model="form.correoEmpresa" type="email" required placeholder="empresa@correo.com"
                       class="w-full border-2 border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition" />
              </div>
            </template>

            <div class="flex items-start gap-2 pt-2">
              <input type="checkbox" required class="mt-0.5" />
              <label class="text-xs text-slate-600">
                Acepto los <a href="#" class="text-blue-600">Términos de Servicio</a> y la <a href="#" class="text-blue-600">Política de Privacidad</a>
              </label>
            </div>

            <button type="submit" :disabled="loading"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-50"
                    style="font-family: 'Sora', sans-serif;">
              {{ loading ? 'Creando cuenta...' : 'Crear cuenta gratis' }}
            </button>
          </form>

          <p class="text-center text-slate-500 text-sm mt-6">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="text-blue-600 font-semibold hover:underline">Inicia sesión aquí</router-link>
          </p>

        </div>
      </div>
    </div>
  </div>
</template>