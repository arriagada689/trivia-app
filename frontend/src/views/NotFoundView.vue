<script setup>
import { RouterLink, useRouter } from 'vue-router';
const router = useRouter()

const handleBackClick = () => {
    router.go(-1)
}
</script>

<template>
    <div class="flex flex-col items-center justify-center h-[calc(100vh-65px)] gap-y-3">
        <i class="pi pi-ban text-9xl"></i>
        <div class="font-bold text-5xl">404 Not Found</div>
        <div class="text-xl">This page does not exist</div>

        <div class="flex items-center gap-x-4">
            <button @click="handleBackClick" class="bg-gray-500 hover:bg-gray-400 text-white font-semibold cursor-pointer py-2 rounded-md active:scale-[98%] w-fit px-3">Go back</button>
            <RouterLink to="/" class="bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer py-2 rounded-md active:scale-[98%] w-fit px-3">Home</RouterLink>
        </div>
    </div>
</template>