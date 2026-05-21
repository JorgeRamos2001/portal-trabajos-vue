<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import NavbarPublic from '@/components/NavbarPublic.vue'
import SidebarAuth from '@/components/SidebarAuth.vue'

const auth = useAuthStore()
const route = useRoute()

onMounted(() => {
  auth.checkSession()
})

const rutasSinLayout = ['/login', '/register']

const mostrarSidebar = computed(() => {
  return auth.isLoggedIn && !rutasSinLayout.includes(route.path)
})

const mostrarNavbar = computed(() => {
  return !auth.isLoggedIn && !rutasSinLayout.includes(route.path)
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">

    <SidebarAuth v-if="mostrarSidebar" />

    <div :class="mostrarSidebar ? 'flex-1 ml-64' : 'flex-1'">
      <NavbarPublic v-if="mostrarNavbar" />

      <router-view />
    </div>

  </div>
</template>