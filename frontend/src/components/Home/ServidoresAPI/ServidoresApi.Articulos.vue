<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useServidores } from '@/composables/contenido/useServidores.composable';

    const {
        servidores,
        obtenerFServidores
    } = useServidores()

    onMounted(() => {
        obtenerFServidores()
    })
</script>

<template>
    <div>
        <h1>Servidores en articulo</h1>
        <section class="servidores">
            <article v-for="servidor in servidores" :key="servidor.id"> 
                <img 
                :src="`http://localhost:4000${servidor.imagen}`" 
                alt="imagen del servidor" 
                width="100"
                >
                <div>
                <div>
                    <h2>{{ servidor.nombre_servidor }}</h2>
                    <p>{{ servidor.estado }}</p>
                </div>
                <p>{{ servidor.ip }}</p>
                
                </div>
            </article>
        </section>
    </div>
</template>