<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, RouterLink } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const token = JSON.parse(localStorage.getItem('userInfo')).token

const stats = ref(null)
const achievements = ref(null)
const gameHistory = ref(null)
const loading = ref(true)

const username = JSON.parse(localStorage.getItem('userInfo')).username

onMounted(async () => {
    
    try {
        const response = await fetch(`${apiBaseUrl}/users/profile`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if(response.ok){
            const data = await response.json()
            console.log(data);
            stats.value = data.stats
            achievements.value = data.achievements
            gameHistory.value = data.game_history
            loading.value = false
        } else {
            const error = await response.json()
            throw new Error(error.message)
        }
    } catch (error) {
        console.error(error.message)
    }
})

const deleteProfile = async () => {
    const confirm = window.confirm('Are you sure you want to delete your profile?')
    if(!confirm) return

    try {
        const response = await fetch(`${apiBaseUrl}/users/delete_profile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            await response.json()
            authStore.logout()
            router.push('/')
        } else {
            const error = await response.json()
            throw new Error(error.message)
        }
    } catch (error) {
        console.error(error.message)
    }
}
</script>

<template>
    <div v-if="loading">Loading</div>

    <div v-else>
        <button @click="deleteProfile" class="bg-red-500">Delete Profile</button>
        <RouterLink to="/profile/update" class="bg-green-500">Update Profile</RouterLink>

        <div><span>{{ username }}</span></div>
        <div>Game history length: {{ gameHistory.length }}</div>
    </div>
</template>