<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore()

const logoutUser = () => {
    authStore.logout()
}
</script>

<template>
    <nav class="space-x-3">
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