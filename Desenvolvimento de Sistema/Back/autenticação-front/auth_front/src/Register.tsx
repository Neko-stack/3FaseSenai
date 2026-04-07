import axios from 'axios'
import { useState } from 'react'

function Register() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [dataRegister, setDataRegister] = useState(null)

  const cadastrar = async () => {
    try {
      const response = await axios.post("http://localhost:3000/register", {
        nome,
        email,
        senha
      })

      if (response?.data) {
        setDataRegister(response.data)
      }
    } catch (error) {
      console.log(error)
      alert("Erro ao cadastrar usuário!")
    }
  }

  return (
    <>
      {dataRegister !== null ? (
        <div className='flex flex-col bg-gray-400 w-full pt-32 items-center h-screen'>
          <h1 className='text-2xl font-semibold text-white'>
            Cadastro realizado com sucesso!
          </h1>

          <button
            className='bg-gray-800 px-5 py-2 text-white rounded-2xl mt-4'
            onClick={() => setDataRegister(null)}
          >
            Voltar
          </button>
        </div>
      ) : (
        <div className='flex flex-col bg-gray-400 w-full justify-center items-center h-screen'>
          <form className='flex gap-2 w-full flex-col items-center justify-center'>
            
            <label>Nome</label>
            <input type="text" onChange={(e) => setNome(e.target.value)} />

            <label>Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} />

            <label>Senha</label>
            <input type="password" onChange={(e) => setSenha(e.target.value)} />

          </form>

          <button
            onClick={cadastrar}
            className='bg-gray-800 px-5 py-2 text-white rounded-2xl'
          >
            Registrar
          </button>
        </div>
      )}
    </>
  )
}

export default Register