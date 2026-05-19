import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isLoggedIn = ref(false)

    async function checkSession() {
        try {
            const { data } = await api.get('/auth/check')
            user.value = data.user
            isLoggedIn.value = data.loggedIn
        } catch {
            user.value = null
            isLoggedIn.value = false
        }
    }

    async function login(correo, password) {
        const { data } = await api.post('/auth/login', { correo, password })
        user.value = data.user
        isLoggedIn.value = true
        return data
    }

    async function registerPostulante(formData) {
        const { data } = await api.post('/auth/register-postulante', formData)
        user.value = data.data
        isLoggedIn.value = true
        return data
    }

    async function registerEmpleador(formData) {
        const { data } = await api.post('/auth/register-empleador', formData)
        user.value = data.data
        isLoggedIn.value = true
        return data
    }

    async function logout() {
        await api.post('/auth/logout')
        user.value = null
        isLoggedIn.value = false
    }

    return {
        user,
        isLoggedIn,
        checkSession,
        login,
        registerPostulante,
        registerEmpleador,
        logout
    }
})