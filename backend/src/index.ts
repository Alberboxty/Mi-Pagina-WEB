import express from 'express'

//import servidoresRoutes from './routes/servidores'
import authRoutes from './routes/auth.routes'
import adminRoutes from "./routes/admin.routes"
import mailerRoutes from "./routes/mailer.routes"
import forgottenPassRoutes from "./routes/forgottenPass.routes"

import morgan from 'morgan';
import cors from 'cors';

import { PORT, IP } from './config'

import { test } from './dbtest';

import cookieParser from 'cookie-parser'

import {emailTest} from "../src/middlewares/mailer.middleware"

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use('/uploads', express.static('uploads'));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(morgan('dev'))

console.log(test)

app.use(express.json()) //Middleware que transforma el req.body a un JSON.

app.get('/ping', (_req, res) => {
    console.log('alguien hizo ping aquí')
    res.send('pong')
})

app.use('/auth', authRoutes)

//Admin y contenido
app.use("/admin", adminRoutes)

//app.use('/api' , apiRoutes)

app.get("/mailertest", emailTest)
app.use("/mailer", mailerRoutes)
app.use("/recoveryPass", forgottenPassRoutes)

app.listen(PORT, ()=> {
    console.log(`El server se inicia en http://${IP}:${PORT}`)
})