// export const permissionGuard = (permission: string): NavigationGuard => {
//     return async () => {
//         try {
//             await checkPermissionAPI(permission);
//             return true;
//         } catch (error: any) {
//             if (error.response?.status === 401) {
//                 return { name: 'auth' };
//             }

//             return { name: 'perfil' };
//         }
//     };
// };