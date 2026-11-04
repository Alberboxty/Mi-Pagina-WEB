<style scoped lang="scss" src="@/assets/scss/noticiasEditCreate.pc.scss" />

<script setup lang="ts">
    import { useNoticias } from '@/composables/contenido/useNoticias.composable';

    import EditorView from '@/editor/vue/EditorView.vue';

    const {
        modoFormularioNews,
        imagenPreview,
        input_Titulo,
        input_Asunto,
        editor,
        descripcionHtml,
        descripcionError,
        input_Version,
        onFileChange,
        enviarFNoticia,
        resetNewsFormulario

    } = useNoticias()

</script>

<template>
  <div>
    <section class="formAndPreview">
      <form @submit.prevent="enviarFNoticia">
        <h1>
          {{ modoFormularioNews }}
          {{ modoFormularioNews === 'Crear' 
              ? 'una noticia.' 
              : `noticia: ${input_Titulo}` }}
        </h1>
        <div class="form-grid">
          <div class="field full">
            <label for="titulo">Titulo</label>
            <input id="titulo" type="text" v-model="input_Titulo" placeholder="Titulo">
          </div>
          <div class="field">
            <label for="asunto">Asunto</label>
            <input id="asunto" type="text" v-model="input_Asunto" placeholder="Asunto">
          </div>
          <div class="field">
            <label for="version">Versión</label>
            <input id="version" type="text" v-model="input_Version" placeholder="Versión">
          </div>
          <div class="field full">
            <label>Descripción</label>
            <EditorView :editor="editor" :show-preview="false" />
            <p v-if="descripcionError" role="alert">{{ descripcionError }}</p>
          </div>
          <div class="field full">
            <label for="imagen">Imagen</label>
            <input id="imagen" type="file" @change="onFileChange" placeholder="Imagen">
          </div>
        </div>
        <div class="actions">
          <button type="submit">
          {{ modoFormularioNews === 'Crear' ? 'Crear noticia' : 'Actualizar noticia' }}
          </button>
          <button :click="resetNewsFormulario">Borrar</button>
        </div>
      </form>
      <article class="vistaprevia">      
        <img v-if="imagenPreview" :src="imagenPreview" alt="Vista previa" />
        <div class="prevContent">
          <div class="prevData1">
            <p class="asunto">asunto: {{ input_Asunto }}</p>
            <p class="version">version: {{ input_Version }}</p>
          </div>

          <p class="titulo">titulo: {{ input_Titulo}}</p>

          <div class="prevData2">
            <p>usuario</p>
            <p>fecha</p>
          </div>
          
          <div class="description" v-html="descripcionHtml"></div>

        </div>
        
        
      </article>
    </section>    
  </div>
</template>
