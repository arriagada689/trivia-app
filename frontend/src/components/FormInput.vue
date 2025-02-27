<script setup>
import { ref } from 'vue';
const props = defineProps({
  label: String, 
  modelValue: String,
  id: String, 
  type: { type: String, default: 'text' },
});

const isFocused = ref(props.modelValue.length > 0);

defineEmits(['update:modelValue']);
</script>

<template>
    <div class="relative w-[300px]">
        <input 
            class="border-b py-1 pl-1 w-full block focus:outline-none focus:border-b-purple-600" 
            :id="id" 
            :type="type" 
            :value="modelValue" 
            @input="$emit('update:modelValue', $event.target.value)"
            required 
            @focus="isFocused = true" 
            @blur="isFocused = modelValue.length > 0"
        >
        <label class="pl-1 absolute top-1 left-0" :for="id">
            <span 
                v-for="(letter, index) in label.split('')" 
                :key="index" 
                class="inline-block transition-transform peer-focus:-top-5 " 
                :class="{ '-translate-y-6': isFocused }" 
                :style="{ transitionDuration: `${200 + index * 50}ms` }">
                {{ letter }}
                <span v-if="letter === ' '">&nbsp;</span>
            </span>
        </label>
    </div>
</template>

<!-- <div class="relative w-[300px]">
    <input class="border-b py-1 pl-1 w-full block focus:outline-none focus:border-b-purple-600 " id="username" v-model="form.username" type="text" required @focus="usernameFocus = true" @blur="usernameFocus = form.username.length > 0">
    <label class="pl-1 absolute top-1 left-0" for="username">
        <span 
            v-for="(letter, index) in 'Username'.split('')" 
            :key="index" 
            class="inline-block transition-transform peer-focus:-top-5 " 
            :class="{ '-translate-y-6': usernameFocus }" 
            :style="{ transitionDuration: `${200 + index * 50}ms` }">
            {{ letter }}
        </span>
    </label>
</div> -->