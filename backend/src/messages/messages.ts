export const messages = {
    success: {
        sentemail: `Has recibido un el email en `,
        changedPass: "Contraseña cambiada correctamente ✅",
        tokenPassInvalidated: "Se ha invalidado el cambio de contraseña correctamente ✅"
    },
    errors: {

        // -> /auth
        serverSleep: "[Backend] Error en el servidor",
        requireUser: "[Backend] Usuario obligatorio",
        requireMail: "[Backend] Email obligatorio",
        requirePassword: "[Backend] Contraseña obligatoria",
        weakPassword: "[Backend] Requisitos Contraseña: a-z, A-Z, 0-9, @#*!_-, Min: 8, Max: 64",
        requirementsUser: "[Backend] Entre 3 y 20 caracteres",
        requirementsEmail: "[Backend] Email inválido",
        requirementsPassword: "[Backend] Password mínimo 8 caracteres",
        onlyNumbers: "[Backend] Solo numeros",
        onlyBooleans: "[Backend] Solo debe ser true o false",
        existEmail: "[Backend] El email ya existe.",
        isntRol: "[Backend] Rol no válido",
        isntEmailAndPass: "[Backend] Se requiere: email y contraseña",
        instEmail2: "[Backend] El email no es correcto",
        isntLogin: "[Backend] Credenciales incorrectas.",
        unauthenticated: "[Backend] Usuario no autenticado",
        unauthorized: "[Backend] No autorizado",
        userNotFound: "[Backend] Usuario no encontrado",
        logOut: "[Backend] Sesión cerrada",

        // -> /recoveryPass
        requireToken: "Token requerido",
        isntToken: "Token inválido",
        newPass: "Requiere contraseña",
        confirmPass: "Requiere confirmar contraseña",
        notMatchPass: "Las contraseñas no coinciden",
        expiresLink: "El enlace ha expirado",
        
    }
} as const