<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore()
const router = useRouter()

const logoutUser = () => {
    authStore.logout()
    router.push('/')
}
</script>

<template>
    <nav class="space-x-3 border-b">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/leaderboard">Leaderboard</RouterLink>
        
        <div v-if="authStore.isLoggedIn" class="space-x-3">
            <RouterLink to="/profile">Profile</RouterLink>
            <button @click="logoutUser">Log out</button>
        </div>
        <div v-else class="space-x-3">
            <RouterLink to="/login">Log In</RouterLink>
            <RouterLink to="/register">Register</RouterLink>
        </div>
    </nav>
</template>