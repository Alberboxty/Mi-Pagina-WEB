import express from 'express'

import servidoresRouter from './routes/servidores'


import morgan from 'morgan';

import { PORT, IP } from './config'

import { test } from './dbtest';

const app = express()
app.use(morgan('dev'))

console.log(test)


app.use(express.json()) //Middleware que transforma el req.body a un JSON.

app.get('/ping', (_req, res) => {
    console.log('alguien hizo ping aquí')
    res.send('pong')
})

app.use('/api/servidores' , servidoresRouter)

app.listen(PORT, ()=> {
    console.log(`El server se inicia en http://${IP}:${PORT}`)
})