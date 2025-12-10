import express from 'express' // ESModules
import * as diaryServices from '../services/diaryServices'
import toNewDiaryEntry from '../utils'

//const express = require('express') -> commonjs

const router = express.Router()

router.get('/', (_req, res) => {
    res.send(diaryServices.getEntriesWithoutSensitiveInfo())
})

router.get('/:id', (req, res) => {
    const diary = diaryServices.findById(Number(req.params.id))
    return (diary != null)
        ? res.send(diary)
        : res.sendStatus(404)
    //res.send(diary?.comment)
})

router.post('/', (req, res) => {
    try {
        const newDiaryEntry = toNewDiaryEntry(req.body)

        const addedDiaryEntry = diaryServices.addDiary(newDiaryEntry)

        res.json(addedDiaryEntry)

    }catch (e: unknown){
        if (e instanceof Error) {
            res.status(400).send(e.message);
        } else {
            res.status(400).send('An unexpected error occurred');
        }
    }
    
})

export default router