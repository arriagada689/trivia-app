<script setup>
import { ref } from 'vue';
defineProps(['option', 'handleOptionClick', 'buttonBgColor', 'clicked', 'correctAnswer'])

const isCrossedOut = ref(false)

const crossOutToggle = () => {
    if(isCrossedOut.value) {
        isCrossedOut.value = false
    } else {
        isCrossedOut.value = true
    }
}
</script>

<template>
    <div class="w-full relative group flex md:block gap-x-2 items-center">
        <button
            @click="handleOptionClick(option)"
            class="w-full rounded-md text-lg py-1 transition-all duration-300 px-2"
            :class="[buttonBgColor(option), { 'opacity-50 cursor-not-allowed line-through': isCrossedOut }]"
            :disabled="isCrossedOut"
        >
            <span class="relative">{{ option }}<i v-if="correctAnswer(option)" class="pi pi-check-circle text-sm absolute right-full top-1/2 -translate-y-1/2 mr-2"></i></span>
        </button>

        <!--Desktop cross out button-->
        <button
            v-if="!clicked"
            class="hidden group-hover:md:flex justify-center items-center md:absolute right-2 ml-1 top-1/2 -translate-y-1/2 rounded-full bg-red-500 w-[27px] h-[27px] text-sm group/sub"
            @click.stop.prevent="crossOutToggle"
        >
            <i class="pi pi-times text-white"></i>
            <div class="hidden group-hover/sub:block absolute bottom-full mb-1 text-xs text-nowrap bg-gray-700 text-white px-2 py-1 rounded-md">{{ isCrossedOut ? 'Undo' : 'Cross out option' }}</div>
        </button>

        <!--Mobile cross out button-->
        <button
            v-if="!clicked"
            class="flex md:hidden justify-center items-center rounded-full bg-red-500 w-[27px] h-[27px] text-sm"
            @click.stop.prevent="crossOutToggle"
        >
            <i class="pi pi-times text-white"></i>
        </button>
    </div>
</template>

<style>
@keyframes shake {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
  75% { transform: rotate(-4deg); }
  100% { transform: rotate(0deg); }
}

.shake {
  animation: shake 0.3s ease-in-out;
}

@keyframes glow {
  0% { box-shadow: 0 0 5px #4caf50; }
  50% { box-shadow: 0 0 20px #4caf50; }
  100% { box-shadow: 0 0 5px #4caf50; }
}

.correct {
  animation: glow 0.3s ease-in-out;
}
</style>