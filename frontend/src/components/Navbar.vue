<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import logo from '@/favicon-brain-32.png'
import logo2 from '@/brain-96.png'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const active = ref(false)

const logoutUser = () => {
    authStore.logout()
    router.push('/')
    active.value = false
}

const handleDropdownClick = (command) => {
    active.value = command
}
</script>

<template>
    <nav class="container mx-auto h-[65px] flex items-center justify-between text-white px-4 md:px-0">
        <RouterLink to="/" @click="handleDropdownClick(false)" class="flex items-center gap-x-2 font-bold text-xl md:text-3xl">
            <img :src="logo2" alt="brain logo" class="h-[32px] object-contain flex-shrink-0">
            Trivia Game App
        </RouterLink>

        <!--Desktop right side-->
        <div class="hidden md:flex items-center gap-x-5 font-semibold text-lg">
            <RouterLink to="/leaderboard" :class="`hover:scale-105 py-1 px-2 rounded-md ${route.path === '/leaderboard' ? 'bg-black' : ''}`">Leaderboard</RouterLink>
            <RouterLink to="/about" :class="`hover:scale-105 py-1 px-2 rounded-md ${route.path === '/about' ? 'bg-black' : ''}`">About</RouterLink>
            
            <div v-if="authStore.isLoggedIn" class="flex items-center gap-x-5">
                <RouterLink to="/profile" :class="`hover:scale-105 py-1 px-2 rounded-md ${route.path === '/profile' ? 'bg-black' : ''}`">Profile</RouterLink>
                <button @click="logoutUser" class="hover:scale-105 ">Log out</button>
            </div>
            <div v-else class="flex items-center gap-x-5">
                <RouterLink to="/login" :class="`hover:scale-105 py-1 px-2 rounded-md ${route.path === '/login' ? 'bg-black' : ''}`">Log In</RouterLink>
                <RouterLink to="/register" :class="`hover:scale-105 py-1 px-2 rounded-md ${route.path === '/register' ? 'bg-black' : ''}`">Register</RouterLink>
            </div>
        </div>

        <!--Mobile right side-->
        <div class="block md:hidden z-50">
            <button v-if="active" @click="handleDropdownClick(false)"><i class="pi pi-times text-xl"></i></button>
            <button v-else @click="handleDropdownClick(true)"><i class="pi pi-bars text-xl"></i></button>

            <div :class="`fixed bg-gray-700 top-[65px] right-0 h-fit w-full border-t border-t-white transition-transform duration-200 ease-in-out ${active ? 'translate-x-0' : 'translate-x-full'}`">
                <div v-if="authStore.isLoggedIn" class="flex flex-col text-center text-lg font-semibold">
                    <RouterLink to="/leaderboard" @click="handleDropdownClick(false)" class="border-b border-b-white w-full py-2"><i class="pi pi-crown mr-3"></i>Leaderboard</RouterLink>
                    <RouterLink to="/about" @click="handleDropdownClick(false)" class="border-b border-b-white w-full py-2"><i class="pi pi-info-circle mr-3"></i>About</RouterLink>
                    <RouterLink to="/profile" @click="handleDropdownClick(false)" class="border-b border-b-white w-full py-2"><i class="pi pi-user mr-3"></i>Profile</RouterLink>
                    <button @click="logoutUser" class="w-full py-2"><i class="pi pi-sign-out mr-3"></i>Log out</button>
                </div>
                <div v-else class="flex flex-col text-center text-lg font-semibold">
                    <RouterLink to="/leaderboard" @click="handleDropdownClick(false)" class="border-b border-b-white w-full py-2"><i class="pi pi-crown mr-3"></i>Leaderboard</RouterLink>
                    <RouterLink to="/about" @click="handleDropdownClick(false)" class="border-b border-b-white w-full py-2"><i class="pi pi-info-circle mr-3"></i>About</RouterLink>
                    <RouterLink to="/login" @click="handleDropdownClick(false)" class="border-b border-b-white w-full py-2"><i class="pi pi-sign-in mr-3"></i>Log In</RouterLink>
                    <RouterLink to="/register" @click="handleDropdownClick(false)" class="w-full py-2"><i class="pi pi-user-plus mr-3"></i>Register</RouterLink>
                </div>
            </div>
        </div>
    </nav>
</template>