<script setup lang="ts">
    import { useNoticias } from '@/composables/contenido/useNoticias.composable';

    const {
        modoFormularioNews,
        imagenPreview,
        input_Titulo,
        input_Asunto,
        input_Descripcion,
        input_Version,
        onFileChange,
        enviarFNoticia,
        resetNewsFormulario

    } = useNoticias()

</script>


<template>
  <div>
    <section>
      <form @submit.prevent="enviarFNoticia">
        <h1>
          {{ modoFormularioNews === 'crear' 
              ? 'Creando un nuevo servidor' 
              : `Editando: ${input_Titulo}` }}
          Modo actual: {{ modoFormularioNews }}
        </h1>
        <label for="">imagen</label>
        <input type="file" @change="onFileChange" placeholder="Imagen">

        <br>
        <label for="">Titulo</label>
        <input type="text" v-model="input_Titulo" placeholder="Titulo">

        <br>

        <label for="">Asunto</label>
        <input type="text" v-model="input_Asunto" placeholder="Asunto">

        <br>
        <label for="">Descripción</label>
        <textarea type="text" v-model="input_Descripcion" placeholder="Descripción"></textarea>
        
        <br>

        <label for="">Versión</label>
        <input type="text" v-model="input_Version" placeholder="Versión">

        <button type="submit">
          {{ modoFormularioNews === 'crear' ? 'Crear noticia' : 'Actualizar noticia' }}
        </button>
        <button :click="resetNewsFormulario">Borrar</button>
      </form>
      <article class="vistaprevia">
        <h1>Vista Previa</h1>
        <img v-if="imagenPreview" :src="imagenPreview" alt="Vista previa" />
        <p>titulo: {{ input_Titulo}}</p>
        <p>asunto: {{ input_Asunto }}</p>
        <p>descripcion: {{ input_Descripcion }}</p>
        <p>version: {{ input_Version }}</p>
      </article>
    </section>    
  </div>
</template>
<style scoped lang="scss">
  section {
    margin-top: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 20px;
    form{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      input {
        border: 0px solid black;
        background-color: pink;
        padding: 10px 15px;
        border-radius: 5px;
      }
      button{
        border: 0px solid black;
        border-radius: 5px;
        background-color: pink;
        padding: 10px 15px;
        
      }
    }
    .vistaprevia {
      background-color: greenyellow;
    }
  }
    
</style>
