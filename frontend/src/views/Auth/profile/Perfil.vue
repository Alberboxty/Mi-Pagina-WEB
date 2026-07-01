<script setup lang="ts">
    import { onMounted } from 'vue'
    
    import ServidoresAPIEditCreate from '@/components/Home/ServidoresAPI/ServidoresAPI.Edit.Create.vue';
    import ServidoresAPIContenido from '@/components/Home/ServidoresAPI/ServidoresAPi.Contenido.vue';
    import ServidoresAPIArticulos from '@/components/Home/ServidoresAPI/ServidoresApi.Articulos.vue';
    import { useAuth } from '@/composables/useAuth.composable';

    import { user } from '@/api/auth.api';

    const {
        obtenerPerfil,
    } = useAuth()

    onMounted(() => {
        obtenerPerfil();
    });
</script>

<template>
    <div>
        <h1>Perfil</h1>

        <p>Usuario: {{ user?.username || "Cargando..." }}</p>
        <p>Email: {{ user?.email || "Cargando..." }}</p>

        <ServidoresAPIEditCreate></ServidoresAPIEditCreate>
        <ServidoresAPIContenido></ServidoresAPIContenido>
        <ServidoresAPIArticulos></ServidoresAPIArticulos>
        
    </div>
</template>