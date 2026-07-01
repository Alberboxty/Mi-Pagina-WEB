<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useNoticias } from '@/composables/contenido/useNoticias.composable';

    const {
        noticias,
        obtenerFNoticias,
        editarFNoticia,
        eliminarFNoticia,
        modoFormularioNews

    } = useNoticias()


    onMounted(() => {
        obtenerFNoticias()
    })
</script>

<template>
    <div>
        <section class="contenidos">
            <h1>Tabla de contenido: Modo actual: {{ modoFormularioNews }}</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>titulo</th>
                        <th>asunto</th>
                        <th>descripcion</th>
                        <th>version</th>
                        <th>imagen</th>
                        <th>Fecha de creación</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="noticia in noticias" :key="noticia.id"> 
                        <td>{{ noticia.id }}</td>
                        <td>{{ noticia.titulo }}</td>
                        <td>{{ noticia.asunto }}</td>
                        <td>{{ noticia.descripcion }}</td>
                        <td>{{ noticia.version }}</td>
                        <td><img 
                        :src="`http://localhost:4000${noticia.imagen}`" 
                        alt="imagen del servidor" 
                        width="100"
                        >
                        </td>
                        <td>{{ noticia.fecha_creacion }}</td>
                        <td>
                        <button @click="editarFNoticia(noticia)">Editar</button>
                        </td>
                        <td>
                        <button @click="eliminarFNoticia(noticia.id)">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>

<style scoped lang="scss">
    .contenidos{
        background-color: rgb(113, 172, 172);
    }
</style>