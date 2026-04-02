import axios from 'axios'
import { useState } from 'react'

function Register() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmaSenha, setConfirmaSenha] = useState("")
  const [dataRegister, setDataRegister] = useState(false)

  const cadastrar = async () => {
    if (senha !== confirmaSenha) {
      alert("senha errada po")
      return
    }

    setDataRegister(true)
    try {
      const response = await axios.post("http://localhost:3000/register", {
        nome,
        email,
        senha
      })

      if (response.status === 201 || response.status === 200) {
        alert("Cadastro realizado com sucesso!")
      }
    } catch (error) {
      console.error(error)
      alert("Erro ao cadastrar usuário")
    } 
  
  }

  return (
    <>
        {dataRegister !== null ? (
        <div className='flex flex-col bg-gray-400 w-full pt-32 items-center h-screen'>
          <h1 className='text-2xl font-semibold text-white'>Cadastrou viva</h1>
        </div>
      ) : (

    <div className='flex flex-col bg-gray-400 w-full justify-center items-center h-screen'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800'>Criar Conta</h2>
      
      <form className='flex gap-2 w-full max-w-xs flex-col items-center justify-center' onSubmit={(e) => e.preventDefault()}>
          <label className='font-medium'>Nome Completo</label>
          <input className='' type="text" onChange={(e) => setNome(e.target.value)} />
        


          <label className='font-medium'>Email</label>
          <input className='' type="email" onChange={(e) => setEmail(e.target.value)}/>



          <label className='font-medium'>Senha</label>
          <input className=''type="password" onChange={(e) => setSenha(e.target.value)} />


          <label className='font-medium'>Confirmar Senha</label>
          <input className=''type="password" onChange={(e) => setConfirmaSenha(e.target.value)} />


        <button onClick={cadastrar} className={`mt-4 bg-gray-800 px-5 py-2 text-white rounded-2xl w-full hover:bg-gray-900 transition-colors`}> Registrar</button>
      </form>
    </div>
      )}
    </>
  )
}

export default Register