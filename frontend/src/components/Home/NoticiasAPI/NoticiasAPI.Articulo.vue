<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useRoute } from 'vue-router';
    import { useNoticias } from '@/composables/contenido/useNoticias.composable';

    const {
        noticiasID,
        obtenerFNoticia
    } = useNoticias ()

    const route = useRoute()

    onMounted(() => {
        obtenerFNoticia(Number(route.params.id))
    })
</script>

<template>
    <div>
        <article v-if="noticiasID">
            <div class="Title">
                <h2>{{ noticiasID.titulo }}</h2> 
                <p>{{ noticiasID.autor_nombre }}</p>
                <p>{{ noticiasID.fecha_creacion }}</p>
            </div>
            <div class="imageSubject">
                <img 
                    :src="`http://localhost:4000${noticiasID.imagen}`" 
                    alt="imagen de la noticia" 
                    width="100"
                >
                <p>{{ noticiasID.asunto }}</p>
            </div>
            <p v-html="noticiasID.descripcion"></p>

            
        </article>
        <article v-else>
            <p>Cargando...</p>
        </article>
    </div>

</template>