<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useNoticias } from '@/composables/contenido/useNoticias.composable';

    const {
        noticias,
        obtenerFNoticias
    } = useNoticias ()

    onMounted(() => {
        obtenerFNoticias()
    })
</script>

<template>
    <div>
        <h1>Noticias en articulo</h1>
        <section class="noticias">
            <article v-for="noticia in noticias" :key="noticia.id"> 
                <img 
                :src="`http://localhost:4000${noticia.imagen}`" 
                alt="imagen de la noticia" 
                width="100"
                >
                <div>
                <div>
                    <h2>{{ noticia.titulo }}</h2>
                    <p>{{ noticia.asunto }}</p>
                    <p>{{ noticia.descripcion }}</p>
                    
                </div>
                <p>{{ noticia.fecha_creacion }}</p>
                <p>{{ noticia.autor_id }}</p>
                
                </div>
            </article>
        </section>
    </div>
</template>

<style scoped lang="scss">
    .servidores{
        //background-color: greenyellow;
        display: flex;
        gap: 10px;
        justify-content: center;
        article{
          padding: 20px;
          width: 400px;
          height: 500px;
          //background-color: aquamarine;
          box-shadow: 5px 5px 10px black;
          border-radius: 10px;
          img{
            
            width: 100%;
            height: 400px;
            box-shadow: 5px 5px 10px black;
            border-radius: 5px;
            object-fit: cover;
          }
          div{
            display: flex;
            flex-direction: column;
            div{
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }
          }
        }
    }


</style>