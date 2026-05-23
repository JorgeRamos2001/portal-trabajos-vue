<script setup>
defineProps({
  comentario: Object
})

function tiempoRelativo(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  if (diff < 7) return `Hace ${diff} días`
  return new Date(fecha).toLocaleDateString('es-SV')
}
</script>

<template>
  <div class="bg-white border-2 border-slate-200 rounded-2xl p-5">
    <div class="flex gap-3">
      <div class="text-center flex-shrink-0">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-bold text-xs mx-auto" style="font-family: 'Sora', sans-serif;">
          {{ comentario.autor?.charAt(0) || '?' }}
        </div>
        <div class="text-xs font-semibold mt-1 text-slate-700">{{ comentario.autor }}</div>
      </div>
      <div class="flex-1">
        <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{{ comentario.contenido }}</p>
        <span class="text-xs text-slate-400 mt-2 block">{{ tiempoRelativo(comentario.fechaPublicacion) }}</span>
      </div>
    </div>
  </div>
</template>