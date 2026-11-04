<style scoped lang="scss" src="@/assets/scss/asideAdminPannel.scss" />

<script setup lang="ts">
    import UsuariosAPI2 from './UsuariosAPI2.vue';

</script>

<template>
    <aside>
        <nav>
            <div class="TitleAside">
                <i class="pi pi-angle-right"></i>
                <h2><i class="pi pi-users"></i>Usuarios</h2>
            
            </div>
            
            <UsuariosAPI2/>
        </nav>
    </aside>
</template>