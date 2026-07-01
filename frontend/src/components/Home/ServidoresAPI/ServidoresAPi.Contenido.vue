<script setup lang="ts">
    import { onMounted } from 'vue'
    import { useServidores } from '@/composables/contenido/useServidores.composable';

    const {
        servidores,
        obtenerFServidores,
        editarFServidor,
        eliminarFServidor,
        modoFormulario

    } = useServidores()


    onMounted(() => {
        obtenerFServidores()
    })
</script>

<template>
    <div>
        <section class="contenidos">
            <h1>Tabla de contenido: Modo actual: {{ modoFormulario }}</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>nombre_servidor</th>
                        <th>estado</th>
                        <th>ip</th>
                        <th>description</th>
                        <th>imagen</th>
                        <th>Fecha de creación</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="servidor in servidores" :key="servidor.id"> 
                        <td>{{ servidor.id }}</td>
                        <td>{{ servidor.nombre_servidor }}</td>
                        <td>{{ servidor.estado }}</td>
                        <td>{{ servidor.ip }}</td>
                        <td>{{ servidor.description }}</td>
                        <td><img 
                        :src="`http://localhost:4000${servidor.imagen}`" 
                        alt="imagen del servidor" 
                        width="100"
                        >
                        </td>
                        <td>{{ servidor.date }}</td>
                        <td>
                        <button @click="editarFServidor(servidor)">Editar</button>
                        </td>
                        <td>
                        <button @click="eliminarFServidor(servidor.id)">Eliminar</button>
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