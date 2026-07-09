<style scoped lang="scss" src="@/assets/scss/noticias.pc.scss" />

<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useNoticias } from '@/composables/contenido/useNoticias.composable';
    import { useRouter } from 'vue-router';

    const {
        noticias,
        obtenerFNoticias
    } = useNoticias ()

    const router = useRouter()

    const irANoticiasID = (id: number) => {
        router.push(`/noticias/${id}`)
    }

    onMounted(() => {
        obtenerFNoticias()
    })
</script>

<template>
    <div>
        <h1>Noticias en articulo</h1>
        <section class="noticias">
            <article 
                v-for="noticia in noticias" 
                :key="noticia.id"
                @click="irANoticiasID(noticia.id)"
            >
                <div class="newArticle">
                    <div class="Title">
                        <h2>{{ noticia.titulo }}</h2> 
                        <p>{{ noticia.fecha_creacion }}</p>
                    </div>
                    
                    <div class="imageSubject">
                        <img 
                            :src="`http://localhost:4000${noticia.imagen}`" 
                            alt="imagen de la noticia" 
                            width="100"
                        >
                        <p>{{ noticia.asunto }}</p>
                    </div>
                </div>
            </article>
        </section>
    </div>
</template>