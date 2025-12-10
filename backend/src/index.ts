import express from 'express'

import diaryRouter from './routes/diaries'

const app = express()
app.use(express.json()) //Middleware que transforma el req.body a un JSON.

const PUERTO = 3000 
const IP = "localhost"

app.get('/ping', (_req, res) => {
    console.log('alguien hizo ping aquí')
    res.send('pong')
})

app.use('/api/diaries' , diaryRouter)

app.listen(PUERTO, ()=> {
    console.log(`El server se inicia en http://${IP}:${PUERTO}`)
}) 