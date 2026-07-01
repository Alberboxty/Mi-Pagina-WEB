<script setup lang="ts">
    import { useRoutesPermissions } from '@/composables/useRoutesPermissions.composable';
    import { onMounted } from 'vue';

    const {
        obtenerFRoutesPermissions,
        creaFRoutePermission,
        editarFRoutePermission,
        eliminarFRoutePermission,
        routesPermisos,
        input_RouteAPI,
        input_Method,
        input_R_IDPermission,
        modoFormularioRoutesPermissions,
        input_IsPublic
    } = useRoutesPermissions()  


    onMounted(() => {
        obtenerFRoutesPermissions()
    })
</script>

<template>
    <div>
        <h1>Crear Rutas API</h1>
        <form @submit.prevent="creaFRoutePermission">
            <input type="text" v-model="input_RouteAPI" placeholder="Ruta de la api">
            <input type="text" v-model="input_Method" placeholder="Metodo">
            <input type="text" v-model="input_R_IDPermission" placeholder="ID permiso">
            <select v-model="input_IsPublic">
                <option :value="true">Pública</option>
                <option :value="false">Privada</option>
            </select>
            <button type="submit">{{ modoFormularioRoutesPermissions === 'crear' ? 'Crear Rol' : 'Editar Rol' }}</button>
        </form>

        <h1>Tabla de Rutas API</h1>
        <table>
            <thead>
                <tr>
                    <th>ID Ruta API</th>
                    <th>Ruta API</th>
                    <th>Method</th>
                    <th>ID Permiso</th>
                    <th>Es Publico</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="routePermiso in routesPermisos" :key="routePermiso.id_route_permission">
                    <td>{{routePermiso.id_route_permission}}</td>
                    <td>{{routePermiso.route}}</td>
                    <td>{{routePermiso.method}}</td>
                    <td>{{routePermiso.id_permission}}</td>
                    <td>{{routePermiso.is_public}}</td>
                    <td><button @click="editarFRoutePermission(routePermiso)">editar</button></td>
                    <td><button @click="eliminarFRoutePermission(routePermiso.id_route_permission)">eliminar</button></td>
                </tr>
            </tbody>
        </table>


    </div>
</template>
    