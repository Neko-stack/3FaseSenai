import express from 'express'
import { userService } from '../services/userService.js'

const route = express.Router()

route.get("/", (req, res) => {
    res.json(userService.getAll())
})

route.get("/:id", (req, res) => {
    const { id } = req.params
    const usuario = fruitService.getById(id)

    if (!usuario) {
        res.status(404).json({ message: "user não encontrada" })
    }

    res.json(usuario)
})

export default route