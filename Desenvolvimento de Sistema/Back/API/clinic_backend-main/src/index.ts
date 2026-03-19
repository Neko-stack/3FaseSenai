import express from 'express';
import { prisma } from './prisma/prisma';
import type { Exame, Usuario } from './prisma/generated/prisma/client';

const app = express();
app.use(express.json())
const port = 3000;

app.get('/', (req, res) => {
  console.log(req)
  res.send("Hello world")
})

// Endpoints usuario
//app.get('/usuarios', async (_, res) => {
///  const usuarios = await prisma.usuario.findMany();
//  res.json(usuarios);
//})

app.get('/usuarios/:id', async (req, res)=> {
  const idUsuario = Number (req.params.id)
  const usuario = await prisma.usuario.findUnique({
    where: {
      id: idUsuario
    }
    
  }) })

  app.delete('/usuarios/:id', async (req, res)=> {
  const idUsuario = Number (req.params.id)
  const usuarioDeletado = await prisma.usuario.findUnique({
    where: {
      id: idUsuario
    }
    
  })

})

app.post("/usuarios", async (req, res) => {
  console.log(req.body)
  const dadosUsuario = req.body as Usuario
  const usuarioCriado = await prisma.usuario.create({
    data: {
      email: dadosUsuario.email,
      nome: dadosUsuario.nome || null
    }
  })
  return res.status(201).json(usuarioCriado)
})

app.put("/usuarios/:id", async(req, res)=>{
    const idUsuario = Number (req.params.id)
      const dadosParaAtualizar = req.body as Omit<Usuario, 'id'>

    await prisma.usuario.update({
      data:{
        ...dadosParaAtualizar
      },
      where: {
        id: idUsuario
      }
    })

    const usuarioAtualizado = await prisma.usuario.findUnique({
      where: {
        id: idUsuario
      }
    })

})
//sever ok

app.listen(port, () => {
  console.log("Servidor ta de pé :p")
})


// Exames

app.get('/exames/:id', async (req, res)=> {
  const idExame = Number (req.params.id)
  const exame = await prisma.exame.findUnique({
    where: {
      id: idExame
    }
    
  })
    return res.status(201).json(exame)  

})

  app.delete('/exames/:id', async (req, res)=> {
  const idExame = Number (req.params.id)
  const exameDeletado = await prisma.exame.findUnique({
    where: {
      id: idExame
    }
    
  })
      return console.log(`o exame ${idExame} foi deletado`)
      
})

app.post("/exames", async (req, res) => {
  console.log(req.body)
  const dadosExame = req.body as Exame
  const  ExameCriado = await prisma.exame.create({
    data: {
      tipo_exame: dadosExame.tipo_exame,
      valor: dadosExame.valor ,
      descricao: dadosExame.descricao,
      resultado: dadosExame.resultado,
      data_exame: dadosExame.data_exame
    }
  })
  return res.status(201).json(ExameCriado)
})

app.put("/usuarios/:id", async(req, res)=>{
    const idExame = Number (req.params.id)
      const dadosParaAtualizar = req.body as Omit<Exame, 'id'>

    await prisma.usuario.update({
      data:{
        ...dadosParaAtualizar
      },
      where: {
        id: idExame
      }
    })

    const exameAtualizado = await prisma.exame.findUnique({
      where: {
        id: idExame
      }
    })
      return console.log(`o exame ${idExame} foi atualizado`)
})

