<script setup>
defineProps({
  recurso: Object
})

function tiempoRelativo(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  if (diff < 7) return `Hace ${diff} días`
  if (diff < 14) return 'Hace 1 semana'
  return `Hace ${Math.floor(diff / 7)} semanas`
}

function colorFondo(tipo) {
  const map = { 'guía': 'from-purple-600 to-purple-400', 'tutorial': 'from-blue-600 to-cyan-400', 'artículo': 'from-pink-600 to-pink-400', 'noticia': 'from-amber-600 to-amber-400', 'video': 'from-red-600 to-red-400' }
  return map[tipo] || 'from-slate-700 to-slate-500'
}

function badgeColor(tipo) {
  const map = { 'guía': 'bg-amber-100 text-amber-800', 'tutorial': 'bg-blue-100 text-blue-800', 'artículo': 'bg-emerald-100 text-emerald-800', 'noticia': 'bg-red-100 text-red-800', 'video': 'bg-purple-100 text-purple-800' }
  return map[tipo] || 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <router-link :to="`/recursos/${recurso.id}`"
               class="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition duration-200 group">
    <div :class="`h-40 bg-gradient-to-br ${colorFondo(recurso.tipo)} flex items-center justify-center text-5xl`">📄</div>
    <div class="p-5">
      <span :class="`text-xs font-bold px-2.5 py-1 rounded-md ${badgeColor(recurso.tipo)}`" style="font-family: 'Sora', sans-serif;">{{ recurso.tipo }}</span>
      <h6 class="font-bold text-slate-800 mt-2 mb-1 group-hover:text-blue-600 transition">{{ recurso.titulo }}</h6>
      <p class="text-slate-500 text-sm line-clamp-2 mb-3">{{ recurso.contenido?.substring(0, 100) }}...</p>
      <div class="flex justify-between items-center text-xs text-slate-400">
        <span>🕐 {{ tiempoRelativo(recurso.fechaPublicacion) }}</span>
        <span class="text-blue-600 font-semibold">Leer →</span>
      </div>
    </div>
  </router-link>
</template>