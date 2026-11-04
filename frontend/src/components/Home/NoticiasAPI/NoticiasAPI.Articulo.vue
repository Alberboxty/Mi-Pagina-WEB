<style scoped lang="scss" src="@/assets/scss/noticiaArticulos.scss" />
<script setup lang="ts">
    import { computed, onMounted } from 'vue'
    import { useRoute } from 'vue-router';
    import { useNoticias } from '@/composables/contenido/useNoticias.composable';
    import { renderDescripcion } from '@/editor/renderer/renderDescripcion';

    const {
        noticiasID,
        obtenerFNoticia
    } = useNoticias ()

    const route = useRoute()

    const descripcionHtml = computed(() =>
        noticiasID.value ? renderDescripcion(noticiasID.value.descripcion) : ""
    )

    onMounted(() => {
        obtenerFNoticia(Number(route.params.id))
    })
</script>

<template>
    <main>
        <section>
            <article v-if="noticiasID">
                <div class="Title">
                    <h2>{{ noticiasID.titulo }}</h2> 
                    <div class="subTitle">
                        <p class="autor">{{ noticiasID.autor_nombre }}</p>
                        <p class="fecha_creacion">{{ noticiasID.fecha_creacion }}</p>
                    </div>
                    
                </div>
                <hr>
                <div class="imageSubject">
                    <img 
                        :src="`http://localhost:4000${noticiasID.imagen}`" 
                        alt="imagen de la noticia" 
                        width="100"
                    >
                    <p>{{ noticiasID.asunto }}</p>
                </div>
                <hr>
                <div class="description" v-html="descripcionHtml"></div>
            </article>
            <article v-else>
                <p>Cargando...</p>
            </article>
        </section>
    </main>
</template>