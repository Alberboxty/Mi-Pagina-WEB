<script setup lang="ts">
    import { onMounted } from 'vue';
    import { usePermissions } from '@/composables/usePermissions.composable';
    import { useRoles } from '@/composables/useRoles.composable';
    import { useRolesPermissions } from '@/composables/useRolesPermissions.composable';

    const {
        obtenerFPermissions,
        permisos,
        creaFPermissions,
        nombrePermiso,
        modoFormularioPermissions,
        editarFPermissions,
        eliminarFPermissions
    } = usePermissions()

    const {
        obtenerFRoles,
        roles,
        nombreRoles,
        creaFRol,
        modoFormularioRoles,
        editarFRol,
        eliminarFRol
    } = useRoles()

    const {
        obtenerFRolesPermissions,
        rolesPermissions,
        input_IDRoles,
        input_IDPermissions,
        creaFRolePermission,
        eliminarFRolePermission
    } = useRolesPermissions()

    onMounted(() => {
        obtenerFPermissions()
        obtenerFRoles()
        obtenerFRolesPermissions()
    })

</script>

<template>
    <div>
        

        <h1>Tabla de Permisos</h1>
        <table>
            <thead>
                <tr>
                    <th>ID Permission</th>
                    <th>Nombre Permission</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="permiso in permisos" :key="permiso.id_permission">
                    <td>{{permiso.id_permission}}</td>
                    <td>{{permiso.nombre}}</td>
                    <td><button @click="editarFPermissions(permiso)">editar</button></td>
                    <td><button @click="eliminarFPermissions(permiso.id_permission)">eliminar</button></td>
                </tr>
            </tbody>
        </table>
        <form @submit.prevent="creaFPermissions">
            <input type="text" v-model="nombrePermiso" placeholder="Escribe el permiso">
            <button type="submit">{{ modoFormularioPermissions === 'crear' ? 'Crear permiso' : 'Editar Permiso' }}</button>
        </form>


        <h1>Tabla de roles</h1>
        <table>
            <thead>
                <tr>
                    <th>ID Rol</th>
                    <th>Nombre Rol</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="rol in roles" :key="rol.id_rol">
                    <td>{{rol.id_rol}}</td>
                    <td>{{rol.rol_name}}</td>
                    <td><button @click="editarFRol(rol)">editar</button></td>
                    <td><button @click="eliminarFRol(rol.id_rol)">eliminar</button></td>
                </tr>
            </tbody>
        </table>
        <form @submit.prevent="creaFRol">
            <input type="text" v-model="nombreRoles" placeholder="Escribe el rol">
            <button type="submit">{{ modoFormularioRoles === 'crear' ? 'Crear Rol' : 'Editar Rol' }}</button>
        </form>


        <h1>Asignación de Roles y permisos</h1>
        <table>
            <thead>
                <tr>
                    <th>Nombre Rol</th>
                    <th>ID Rol</th>
                    <th>Nombre Permission</th>
                    <th>ID Permission</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="rolePermission in rolesPermissions" :key="rolePermission.id_rol + '-' + rolePermission.id_permission">
                    <td>{{ rolePermission.role }}</td>
                    <td>{{ rolePermission.id_rol }}</td>
                    <td>{{ rolePermission.permission }}</td>
                    <td>{{ rolePermission.id_permission }}</td>
                    <td><button @click="eliminarFRolePermission(rolePermission.id_rol, rolePermission.id_permission)">eliminar</button></td>
                </tr>
            </tbody>
        </table>
        <form @submit.prevent="creaFRolePermission">
            <input type="text" v-model="input_IDRoles" placeholder="Escribe el ID del rol">
            <input type="text" v-model="input_IDPermissions" placeholder="Escribe el ID del permiso">
            <button type="submit">Crear</button>
        </form>
    </div>
</template>