<style scoped lang="scss" src="@/assets/scss/auth.scss" />
<style scoped lang="scss" src="@/assets/scss/auth.movile.scss" />

<script setup lang="ts">
  import {ref} from 'vue'
  import { useAuth } from '@/composables/useAuth.composable';
  const {
    logearse,
    registrarse,
    errorLogin,
    errorRegistro
  } = useAuth()

  import { lemail, lpassword, remail, rpassword, rusername } from '@/api/auth.api';

  const isActive = ref(false)
</script>

<template>
  <main>
    <span v-if="errorLogin"><b>Error al loguearse:</b> {{ errorLogin }}</span>
    <span v-if="errorRegistro"><b>Error al registrarse:</b> {{ errorRegistro }}</span>
    <h1>Auth</h1>
    <section>
      
      <article class="login" >
        <form @submit.prevent="logearse" :class="{ LFormActive: isActive }">
          <h2>Login</h2>
          <input type="text" v-model="lemail" placeholder="Email">
          <input type="password" v-model="lpassword" placeholder="Contraseña">
          <button type="submit">Enviar</button>
          <RouterLink to="/auth/forgotten"><p class="clic">¿Quieres recuperar tu contraseña?</p></RouterLink>
        </form>
        <div class="ColorBlock" :class="{ LColorBlockActive: isActive }"></div>
        <div class="TextBlock" :class="{ LTextBlockActive: isActive }">
          <h2>Bienvenido a MiPaginaWeb</h2>
          <p class="texto">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit adipisci sunt ad aperiam quis quam! Accusamus dolorem quod ipsum, doloribus odio aspernatur illo nulla veritatis fugit cum architecto totam! Amet.</p>
          <p class="clic" @click="isActive = !isActive">Quiero registrarme</p>
        </div>
      </article>
      <article class="Registro">
        <div class="TextBlock" :class="{ RTextBlockActive: isActive }">
          <h2>Bienvenido a MiPaginaWeb</h2>
          <p class="texto">Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit adipisci sunt ad aperiam quis quam! Accusamus dolorem quod ipsum, doloribus odio aspernatur illo nulla veritatis fugit cum architecto totam! Amet.</p>
          <p class="clic" @click="isActive = !isActive">Quiero Loguearme</p>
        </div>
        <div class="ColorBlock" :class="{ RColorBlockActive: isActive }"></div>
        <form @submit.prevent="registrarse" :class="{ RFormActive: isActive }">
          <h2>Registro</h2>
          <input type="text" v-model="rusername" placeholder="Usuario">
          <input type="text" v-model="remail" placeholder="Email">
          <input type="password" v-model="rpassword" placeholder="Contraseña">
          <button type="submit">Enviar</button>
        </form>
      </article>
    </section>
  </main>
</template>

