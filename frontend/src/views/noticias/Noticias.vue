<script setup lang="ts">
    import NoticiasAPIEditCreate from '@/components/Home/NoticiasAPI/NoticiasAPI.Edit.Create.vue';
    import NoticiasAPIContenido from '@/components/Home/NoticiasAPI/NoticiasAPI.Contenido.vue';
    import NoticiasAPIArticulos from '@/components/Home/NoticiasAPI/NoticiasAPI.Articulos.vue';
</script>

<template>
    <div>
        <NoticiasAPIEditCreate></NoticiasAPIEditCreate>
        <NoticiasAPIContenido></NoticiasAPIContenido>
        <NoticiasAPIArticulos></NoticiasAPIArticulos>
    </div>
</template>