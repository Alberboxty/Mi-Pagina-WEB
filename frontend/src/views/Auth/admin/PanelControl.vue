<style scoped lang="scss" src="@/assets/scss/adminPannel.scss" />
<script setup lang="ts">
    import { admin } from '@/api/auth.api';
    import UsuariosAPI from '@/components/ControlPannel/UsuariosAPI.vue';
    import PermisosAPI from '@/components/ControlPannel/PermisosYRoles.vue'
    import PermisosModulares from '@/components/ControlPannel/PermisosModulares.vue'
    import AsidePannel from '@/components/ControlPannel/AsidePannel.vue';
</script>

<template>
  <div class="AdminPannel">
    <AsidePannel/>
    <main>
      <h1>Panel Administrador</h1>
      <p>{{ admin }}</p>
      <section>
        <UsuariosAPI></UsuariosAPI>
        <PermisosAPI></PermisosAPI>
        <PermisosModulares></PermisosModulares>
      </section>

    </main>
    
    

    
    
    
    
  </div>
</template>