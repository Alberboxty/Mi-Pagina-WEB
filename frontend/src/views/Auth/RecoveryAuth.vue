<style scoped lang="scss" src="@/assets/scss/recoveryPass.pc.scss" />
<script setup lang="ts">
    import { useRoute } from 'vue-router'
    import { newpassword, confirmpassword } from '@/api/recoveryPass.api';
    import { useRecoveryPass } from '@/composables/recoveryPass.composable';
    const route = useRoute()
    const token = route.params.token as string

    const {
        recoveryPass,
        errorRecovery,
        successRecovery
    } = useRecoveryPass(token)

</script>
<template>
    <main>
        <span v-if="errorRecovery"><b>Error:</b> {{ errorRecovery }}</span>
        <span v-if="successRecovery"><b>Correcto:</b> {{ successRecovery }}</span>
        <article>
            <h1>Recupera la contraseña</h1>
            <p>Token: {{ token }}</p>
            <p>Email: </p>
            <form @submit.prevent="recoveryPass">
                <input type="text" v-model="newpassword" placeholder="Contraseña">
                <input type="text" v-model="confirmpassword" placeholder="Repite contraseña">
                <button type="submit">Nueva contraseña</button>
            </form>
        </article>
    </main>
</template>