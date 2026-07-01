<script setup lang="ts">
    import { useAuth } from '@/composables/useAuth.composable';
    import { onMounted } from 'vue'
    import { admin } from '@/api/auth.api';
    import UsuariosAPI from '@/components/ControlPannel/UsuariosAPI.vue';
    import PermisosAPI from '@/components/ControlPannel/PermisosYRoles.vue'
    import PermisosModulares from '@/components/ControlPannel/PermisosModulares.vue'
    const {
        adminData
    } = useAuth();

    onMounted(() => {
        adminData()
    })
</script>

<template>
  <main>
    <h1>Panel Administrador</h1>
    
    <p>{{ admin }}</p>
    <UsuariosAPI></UsuariosAPI>
    <PermisosAPI></PermisosAPI>
    <PermisosModulares></PermisosModulares>

    
  </main>
</template>