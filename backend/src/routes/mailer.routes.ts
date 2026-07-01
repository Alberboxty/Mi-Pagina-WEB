import express from "express"

import {emailVerification} from "../controllers/mailer.controllers"

const router = express.Router()

router.get("/verifyMail/:token", emailVerification)


export default router