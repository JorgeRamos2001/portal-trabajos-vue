<script setup>
defineProps({
  post: Object
})

function tiempoRelativo(fecha) {
  if (!fecha) return ''
  const diff = Math.floor((new Date() - new Date(fecha)) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  if (diff < 30) return `Hace ${diff} días`
  if (diff < 60) return 'Hace 1 mes'
  return `Hace ${Math.floor(diff / 30)} meses`
}
</script>

<template>
  <router-link :to="`/foro/${post.id}`"
               class="block bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-lg transition">
    <div class="flex gap-3">
      <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style="font-family: 'Sora', sans-serif;">
        {{ post.autor?.charAt(0) || '?' }}
      </div>
      <div class="flex-1 min-w-0">
        <h6 class="font-bold text-slate-800 mb-1">{{ post.titulo }}</h6>
        <p class="text-slate-500 text-sm mb-2 line-clamp-2">{{ post.contenido?.substring(0, 150) }}</p>
        <div class="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
          <span>Por <strong class="text-slate-600">{{ post.autor }}</strong></span>
          <span>🕐 {{ tiempoRelativo(post.fechaPublicacion) }}</span>
          <span class="bg-slate-100 px-2 py-0.5 rounded-full">💬 {{ post.totalComentarios || 0 }}</span>
          <span class="bg-slate-100 px-2 py-0.5 rounded-full">👍 {{ post.totalLikes || 0 }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>