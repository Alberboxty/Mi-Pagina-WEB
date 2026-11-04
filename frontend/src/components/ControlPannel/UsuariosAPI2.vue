<style scoped lang="scss" src="@/assets/scss/usuariosAPI2.scss" />

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useUsuarios, input_usuario, input_email, input_id_rol, input_verified} from '@/composables/usuarios.composable'

const {
    usuarios,
    obtenerFUsuarios,
    eliminarFUsuario,
    editarFUsuario,
    enviarFUsuarios
} = useUsuarios()

const ventanaEdicion = ref(false);

onMounted(() => {
    console.log('UsuariosAPI: onMounted ejecutado');
    obtenerFUsuarios()
})

</script>

<template>
    <section class="usuarios">
        <form v-if="ventanaEdicion" class="editarUsuarios" @submit.prevent="enviarFUsuarios">
            <div class="titulo">
                <h1>Editar</h1>
                <i class="pi pi-times" @click="ventanaEdicion = false"></i>
            </div>
            <div class="field">
                <label for="">Usuario</label>
                <input type="text" v-model="input_usuario" placeholder="Usuario">
            </div>
            <div class="field">
                <label for="">Email</label>
                <input type="text" v-model="input_email" placeholder="Email">
            </div>
            <div class="field">
                <label for="">id_rol</label>
                <input type="text" v-model="input_id_rol" placeholder="id_rol">
            </div>
            <div class="field">
                <label for="">Verified</label>
                <input type="text" v-model="input_verified" placeholder="verified">
            </div>
            <button type="submit">Enviar</button>
        </form>

        <h1>Lista de usuarios</h1>
        <table>
            <thead>
                <tr>
                    <th>id</th>
                    <th>username</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="usuario in usuarios" :key="usuario.id">
                    <td>{{ usuario.id }}</td>
                    <td>
                        <button class="editarEmail" :title="`Editar con email ${ usuario.email }`"  @click="editarFUsuario(usuario); ventanaEdicion = true">{{ usuario.username }}</button>
                    </td>
                    <td>
                        <button class="basura" @click="eliminarFUsuario(usuario.id)"><i class="pi pi-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>