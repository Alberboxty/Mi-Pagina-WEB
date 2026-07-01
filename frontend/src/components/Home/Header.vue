<style scoped lang="scss" src="@/assets/scss/header.pc.scss" />
<style scoped lang="scss" src="@/assets/scss/header.mobile.scss" />

<!-- Los iconos vienen de https://primevue.org/icons/ -->
<script setup lang="ts">
    import { onMounted } from 'vue'
    import {ref} from 'vue'
    const headerMenuIsActive = ref(false)
    import { useAuth } from '@/composables/useAuth.composable';
    import { user } from '@/api/auth.api';

    // iconos de https://icon-sets.iconify.design/
    import InstagramIcon from '@iconify-vue/skill-icons/instagram';
    import DiscordIcon from '@iconify-vue/skill-icons/discord';

    const {
        obtenerPerfil,
        logout
    } = useAuth()
    
    onMounted(() => {
        obtenerPerfil();
    });
</script>
<template>
    <header>
        
        <nav>
            <div class="flechaizquierda"></div>
            <article class="inicio">
                <RouterLink to="/"><i alt="Inicio" class="pi pi-home" /></RouterLink>
                <img class="logo" src="" alt="Logo">
                <i class="pi pi-bars" @click="headerMenuIsActive = !headerMenuIsActive"/>
            </article>
            <div class="flechaderecha"></div>
            <article class="menu">
                <ul :class="{ ulmenu: headerMenuIsActive }">
                    <li class="Perfil">
                        <div>
                            <RouterLink to="/perfil"><i class="pi pi-user"></i></RouterLink>
                        </div>
                        <div>
                            <RouterLink to="/perfil"><p>{{ user?.username || "Inicia Sesión" }}</p></RouterLink>
                            <button @click="logout">Cerrar Sesión</button>
                        </div>
                    </li>
                    <li class="lista"><RouterLink to="/admin"><p>Panel Control</p></RouterLink></li>
                    <li class="lista"><RouterLink to="/auth"><p>Auth</p></RouterLink></li>
                    <li class="lista"><RouterLink to="/servidores/Servidores"><p>Servidores</p></RouterLink></li>
                    <li class="lista"><RouterLink to="/noticias"><p>Noticias</p></RouterLink></li>
                    <li class="RRSS">
                        <a href="https://www.instagram.com/lokuraplay/" target="_blank"><InstagramIcon height="25" /></a>
                        <a href="https://discord.gg/Fw8KVbyhMH" target="_blank"><DiscordIcon height="25" /></a>
                    </li>
                </ul>
            </article>
        </nav>
        
    </header>
</template>




    
