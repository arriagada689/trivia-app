<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class="bg-gray-700">
    <Navbar />
  </div>

  <div class="container mx-auto">
    <RouterView />
  </div>
</template>


