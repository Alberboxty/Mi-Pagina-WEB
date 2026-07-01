import express from "express"

import { recoveryPass, iHaveNotBeenPass } from "../controllers/recoveryPass.controllers"
import { validarCampos } from '../middlewares/validation.middleware'
import { validarRecoveryPass } from "../validators/usuarios.validators";

const router = express.Router()

router.post("/recoveryPass/:token", validarRecoveryPass, validarCampos, recoveryPass);
router.get("/IHaveNotBeen/:token", iHaveNotBeenPass)

export default router