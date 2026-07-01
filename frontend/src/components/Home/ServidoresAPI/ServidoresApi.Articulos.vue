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