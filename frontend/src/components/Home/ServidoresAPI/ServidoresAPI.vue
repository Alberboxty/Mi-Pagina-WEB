<template>
  <div>
    <form @submit.prevent="enviarFServidor">
      <h1>
        {{ modoFormulario === 'crear' 
            ? 'Creando un nuevo servidor' 
            : `Editando: ${input_nombre_servidor}` }}
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

    <section class="contenidos">
      <h1>Tabla de contenido</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>nombre_servidor</th>
            <th>estado</th>
            <th>ip</th>
            <th>description</th>
            <th>imagen</th>
            <th>Fecha de creación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servidor in servidores" :key="servidor.id"> 
            <td>{{ servidor.id }}</td>
            <td>{{ servidor.nombre_servidor }}</td>
            <td>{{ servidor.estado }}</td>
            <td>{{ servidor.ip }}</td>
            <td>{{ servidor.description }}</td>
            <td><img 
              :src="`http://localhost:4000${servidor.imagen}`" 
              alt="imagen del servidor" 
              width="100"
              >
            </td>
            <td>{{ servidor.date }}</td>
            <td>
              <button @click="editarFServidor(servidor)">Editar</button>
            </td>
            <td>
              <button @click="eliminarFServidor(servidor.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <h1>Servidores en articulo</h1>
    <section class="servidores">
      <article v-for="servidor in servidores" :key="servidor.id"> 
        <img 
          :src="`http://localhost:4000${servidor.imagen}`" 
          alt="imagen del servidor" 
          width="100"
        >
        <div>
          <div>
            <h2>{{ servidor.nombre_servidor }}</h2>
            <p>{{ servidor.estado }}</p>
          </div>
          <p>{{ servidor.ip }}</p>
          
        </div>
      </article>
    </section>
  </div>
</template>