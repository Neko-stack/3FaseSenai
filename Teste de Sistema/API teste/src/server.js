import express from 'express'
import route from './routes/userRoutes.js'

const PORT = 3000
const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Bem vindo!")
})

// rotas
app.use('/user', route)

app.listen(PORT, () => {
    console.log(`API rodando em: http://localhost:${PORT}`)
})
