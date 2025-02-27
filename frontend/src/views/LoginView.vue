<script setup>
import FormInput from '@/components/FormInput.vue';
import { useAuthStore } from '@/stores/authStore';
import { reactive, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
    username: '',
    password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    try {
        loading.value = true
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
        const response = await fetch(`${apiBaseUrl}/users/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
        if(response.ok){
            const data = await response.json()
            authStore.login(data)
            router.push('/')
        } else {
            const error = await response.json()
            throw new Error(error.message)
        }
    } catch (error) {
        errorMessage.value = error.message
        console.error(error.message)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div v-if="loading">Loading</div>

    <div v-else class="flex flex-col items-center justify-center h-[calc(100vh-65px)]">

        <form @submit.prevent="handleLogin" class="space-y-6 p-10 shadow-xl rounded-md bg-white relative">
            <div v-if="errorMessage.length > 0" class="absolute -top-12 left-0 border-2 border-red-800 bg-red-300 p-1 px-2 w-full text-red-600 text-center">{{ errorMessage }}</div>
            
            <div class="text-2xl font-bold text-center">Log In</div>

            <FormInput 
                label="Username"
                v-model="form.username"
                id="username"
            />

            <FormInput 
                label="Password"
                v-model="form.password"
                id="password"
                type="password"
            />

            <button class="bg-purple-600 hover:bg-purple-500 w-full text-white font-semibold cursor-pointer py-1 rounded-md active:scale-[98%]" type="submit">Log in</button>

            <div>Don't have an account? <RouterLink to="/register" class="text-blue-500 hover:underline">Register</RouterLink></div>
        </form>

    </div>
</template>