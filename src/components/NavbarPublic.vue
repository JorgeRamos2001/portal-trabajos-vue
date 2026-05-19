<script setup>
</script>

<template>
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="text-xl font-extrabold text-blue-600" style="font-family: 'Sora', sans-serif;">
        Portal<span class="text-emerald-500">Trabajos</span>
      </router-link>

      <div class="flex items-center gap-4 text-sm font-medium">
        <router-link to="/empleos" class="text-slate-700 hover:text-blue-600 transition">Empleos</router-link>
        <router-link to="/recursos" class="text-slate-700 hover:text-blue-600 transition">Recursos</router-link>
        <router-link to="/foro" class="text-slate-700 hover:text-blue-600 transition">Foro</router-link>
      </div>

      <div class="flex gap-2">
        <router-link to="/login" class="border border-blue-600 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition" style="font-family: 'Sora', sans-serif;">
          Iniciar Sesión
        </router-link>
        <router-link to="/register" class="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition" style="font-family: 'Sora', sans-serif;">
          Registrarse
        </router-link>
      </div>
    </div>
  </nav>
</template>