<script setup>
import FormInput from '@/components/FormInput.vue';
import { useAuthStore } from '@/stores/authStore';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const token = JSON.parse(localStorage.getItem('userInfo')).token
const username = JSON.parse(localStorage.getItem('userInfo')).username

const form = reactive({
    username: username,
    password: '',
    confirm_password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const submitHandler = async () => {
    try {
        loading.value = true
        const response = await fetch(`${apiBaseUrl}/users/update_profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(form)
        })
        if(response.ok) {
            const data = await response.json()
            authStore.login(data)
            router.push('/profile')
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

    <div v-else class="flex items-center justify-center h-[calc(100vh-65px)]">

        <form @submit.prevent="submitHandler" class="space-y-6 p-10 shadow-xl rounded-md bg-white relative">
            <div v-if="errorMessage.length > 0" class="absolute -top-12 left-0 border-2 border-red-800 bg-red-300 p-1 px-2 w-full text-red-600 text-center">{{ errorMessage }}</div>
            
            <div class="text-2xl font-bold text-center">Update Profile</div>

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

            <FormInput 
                label="Confirm password"
                v-model="form.confirm_password"
                id="confirm_password"
                type="password"
            />

            <button class="bg-purple-600 hover:bg-purple-500 w-full text-white font-semibold cursor-pointer py-1 rounded-md active:scale-[98%]" type="submit">Update</button>
        </form>
    </div>
</template>