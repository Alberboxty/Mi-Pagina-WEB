<script setup lang="ts">
  import { useServidores } from '@/composables/contenido/useServidores.composable';


  const {
    modoFormulario,
    input_nombre_servidor,
    input_estado,
    input_ip,
    input_description,
    imagenPreview,
    enviarFServidor,
    onFileChange

  } = useServidores()
</script>

<template>
  <div>
    <form @submit.prevent="enviarFServidor">
      <h1>
        {{ modoFormulario === 'crear' 
            ? 'Creando un nuevo servidor' 
            : `Editando: ${input_nombre_servidor}` }}
        Modo actual: {{ modoFormulario }}
      </h1>
      <label for="">nombre_servidor</label>
      <input type="text" v-model="input_nombre_servidor" placeholder="nombre_servidor">

      <br>

      <label for="">estado </label>
      <span>online</span>
      <input type="radio" v-model="input_estado" name="estado" value="online">
      <span>offline</span>
      <input type="radio" v-model="input_estado" name="estado" value="offline">
      <span>mantenimiento</span>
      <input type="radio" v-model="input_estado" name="estado" value="mantenimiento">

      <br>

      <label for="">ip</label>
      <input type="text" v-model="input_ip" placeholder="ip">

      <br>
      <label for="">imagen</label>
      <input type="file" @change="onFileChange" placeholder="imagen">
      

      <br>

      <label for="">description</label>
      <input type="text" v-model="input_description" placeholder="description">

      <button type="submit">
        {{ modoFormulario === 'crear' ? 'Crear servidor' : 'Actualizar servidor' }}
      </button>
    </form>

    <section class="vistaprevia">
      <h1>Vista Previa</h1>
      <p>nombre_servidor: {{ input_nombre_servidor }}</p>
      <p>estado: {{ input_estado }}</p>
      <p>ip: {{ input_ip }}</p>
      <!-- <p>imagen: {{ input_imagen }}</p> -->
      <img v-if="imagenPreview" :src="imagenPreview" alt="Vista previa" />
      <p>description: {{ input_description }}</p>
    </section>

    
  </div>
</template>
<style scoped lang="scss">
  form {
    background-color: rgb(250, 250, 160);
  }
  .vistaprevia{
    background-color: rgb(121, 139, 118);

  }

</style>