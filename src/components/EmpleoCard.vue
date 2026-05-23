<script setup>
defineProps({
  empleo: Object,
  link: { type: Boolean, default: true }
})

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
  <component :is="link ? 'router-link' : 'div'" :to="link ? `/empleos/${empleo.id}` : undefined"
             :class="link ? 'block bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-lg transition duration-200 cursor-pointer' : 'bg-white border-2 border-slate-200 rounded-2xl p-5'">
    <div class="flex gap-4">
      <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between gap-2">
          <div>
            <h6 class="font-bold text-slate-800 mb-0.5">{{ empleo.titulo }}</h6>
            <span class="text-slate-500 text-sm">{{ empleo.empresa }} · {{ empleo.ubicacion }}</span>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="text-emerald-600 font-bold text-sm" style="font-family: 'Sora', sans-serif;">{{ formatearSalario(empleo.salarioMin, empleo.salarioMax) }}</div>
            <span class="text-xs text-slate-400">{{ tiempoRelativo(empleo.fechaPublicacion) }}</span>
          </div>
        </div>
        <div class="flex gap-2 mt-2">
          <span class="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md">{{ empleo.modalidad }}</span>
          <span class="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded-md">{{ empleo.categoria || 'General' }}</span>
        </div>
      </div>
    </div>
  </component>
</template>