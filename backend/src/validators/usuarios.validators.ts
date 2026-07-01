import { body } from "express-validator";
import { messages } from "../messages/messages";

//Array de cada input
export const validarRegistro = [
    body("username")
        .trim() // Quita espacios innecesarios
        .notEmpty().withMessage(messages.errors.requireUser) //No debe estar vacio
        .isLength({ min: 3, max: 20 }) //Maximo y minimo de caracteres
        .withMessage(messages.errors.requirementsUser) //Mensaje de error.
        .escape(), //Evita HTML en el input para ataques XSS

    body("email")
        .trim()
        .isEmail() //Verifica si lleva el @ y quita mayusculas
        .withMessage(messages.errors.requirementsEmail)
        .normalizeEmail({
            gmail_remove_dots: false
        }) //Elimina simbolos raros como el . y otros mas
        .escape(),

    body("password")
        .isLength({ min: 8, max: 64 })
        .withMessage(messages.errors.requirementsPassword)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#*!_\-]).{8,64}$/)
        .withMessage(messages.errors.weakPassword)
        .escape()
]

export const validarLoggeo = [
    body("email")
        .trim()
        .isEmail() //Verifica si lleva el @ y quita mayusculas
        .withMessage(messages.errors.requirementsEmail)
        .normalizeEmail({
            gmail_remove_dots: false
        }) //Elimina simbolos raros como el . y otros mas
        .escape(),

    body("password")
        .isLength({ min: 8, max: 64 })
        .withMessage(messages.errors.requirementsPassword)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#*!_-])[a-zA-Z0-9@#*!_-]{8,64}$/)
        .withMessage(messages.errors.weakPassword)
        .escape()
]

export const validarRecoveryPass = [
    body("newPassword")
        .isLength({ min: 8, max: 64 })
        .withMessage(messages.errors.requirementsPassword)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#*!_-])[a-zA-Z0-9@#*!_-]{8,64}$/)
        .withMessage(messages.errors.weakPassword)
        .escape(),
    body("confirmPassword")
        .isLength({ min: 8, max: 64 })
        .withMessage(messages.errors.requirementsPassword)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#*!_-])[a-zA-Z0-9@#*!_-]{8,64}$/)
        .withMessage(messages.errors.weakPassword)
        .escape()
]

export const validarEmail = [
    body("emailFP")
        .trim()
        .isEmail() //Verifica si lleva el @ y quita mayusculas
        .withMessage(messages.errors.requirementsEmail)
        .normalizeEmail({
            gmail_remove_dots: false
        }) //Elimina simbolos raros como el . y otros mas
        .escape(),
]

export const validarUsuariosAPI = [
    body("username")
        .trim() // Quita espacios innecesarios
        .notEmpty().withMessage(messages.errors.requireUser) //No debe estar vacio
        .isLength({ min: 3, max: 20 }) //Maximo y minimo de caracteres
        .withMessage(messages.errors.requirementsUser) //Mensaje de error.
        .escape(), //Evita HTML en el input para ataques XSS

    body("email")
        .trim()
        .isEmail() //Verifica si lleva el @ y quita mayusculas
        .withMessage(messages.errors.requirementsEmail)
        .normalizeEmail({
            gmail_remove_dots: false
        }) //Elimina simbolos raros como el . y otros mas
        .escape(),

    body("id_rol")
        .trim()
        .isDecimal().withMessage(messages.errors.onlyNumbers)
        .escape(),

    body("verified")
        .trim()
        .isBoolean().withMessage(messages.errors.onlyBooleans)
        .escape()
]