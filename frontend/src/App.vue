<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
//import HelloWorld from './components/HelloWorld.vue'
import Headerr from './components/Home/Header.vue'
import '@/assets/scss/body.scss'
// import "@NM/boxicons/css/boxicons.min.css"
import '@NM/primeicons/primeicons.css'

onMounted(() => {
    console.log('APP MONTADA');
});

</script>

<template>
  <headerr></headerr>
  <RouterView />
</template>


