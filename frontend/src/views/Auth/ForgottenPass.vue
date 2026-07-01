<style scoped lang="scss" src="@/assets/scss/forgottenPass.pc.scss" />


<script setup lang="ts">
    import { lemail } from '@/api/auth.api';
    import { useAuth } from '@/composables/useAuth.composable';
    const {
        forgottenPass,
        errorForgotten,
        successForgotten
    } = useAuth()
</script>

<template>
    <main>
        <span v-if="errorForgotten"><b>Error: </b> {{ errorForgotten }}</span>
        <span v-if="successForgotten"><b>Correcto: </b> {{ successForgotten }}</span>
        <article>
            <h1>He olvidado mi contraseña</h1>
            <p>Escribe tu correo y te enviaremos un mensaje por email</p>
            <form @submit.prevent="forgottenPass">
                <input type="text" v-model="lemail" placeholder="email">
                <button type="submit">Enviar</button>
            </form>
            <RouterLink to="/auth">Quiero iniciar sesión</RouterLink>
        </article>
        
    </main>
</template>