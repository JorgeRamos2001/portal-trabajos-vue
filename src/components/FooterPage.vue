<script setup>
</script>

<template>
  <footer class="bg-slate-900 text-slate-400 py-12">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid md:grid-cols-5 gap-8 mb-8">

        <!-- Marca -->
        <div class="md:col-span-2">
          <div class="text-xl font-extrabold text-white mb-3" style="font-family: 'Sora', sans-serif;">
            Portal<span class="text-emerald-400">Trabajos</span>
          </div>
          <p class="text-sm mb-4">La plataforma líder de empleos en Centroamérica. Conectamos talento con oportunidades.</p>
          <div class="flex gap-3 text-lg">
            <a href="#" class="hover:text-white transition">📘</a>
            <a href="#" class="hover:text-white transition">🐦</a>
            <a href="#" class="hover:text-white transition">💼</a>
            <a href="#" class="hover:text-white transition">📷</a>
          </div>
        </div>

        <!-- Empleos -->
        <div>
          <h6 class="text-white font-semibold mb-3" style="font-family: 'Sora', sans-serif;">Empleos</h6>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white transition">Por categoría</a></li>
            <li><a href="#" class="hover:text-white transition">Por empresa</a></li>
            <li><a href="#" class="hover:text-white transition">Remotos</a></li>
            <li><a href="#" class="hover:text-white transition">Destacados</a></li>
          </ul>
        </div>

        <!-- Para empresas -->
        <div>
          <h6 class="text-white font-semibold mb-3" style="font-family: 'Sora', sans-serif;">Para empresas</h6>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white transition">Publicar empleo</a></li>
            <li><a href="#" class="hover:text-white transition">Planes</a></li>
            <li><a href="#" class="hover:text-white transition">Buscar candidatos</a></li>
          </ul>
        </div>

        <!-- Empresa -->
        <div>
          <h6 class="text-white font-semibold mb-3" style="font-family: 'Sora', sans-serif;">Empresa</h6>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white transition">Sobre nosotros</a></li>
            <li><a href="#" class="hover:text-white transition">Contacto</a></li>
            <li><a href="#" class="hover:text-white transition">Privacidad</a></li>
            <li><a href="#" class="hover:text-white transition">Términos</a></li>
          </ul>
        </div>
      </div>

      <hr class="border-slate-700 mb-4" />
      <div class="flex flex-col sm:flex-row justify-between items-center text-sm">
        <span>© 2025 PortalTrabajos. Todos los derechos reservados.</span>
        <span>Hecho con ❤️ en El Salvador</span>
      </div>
    </div>
  </footer>
</template>