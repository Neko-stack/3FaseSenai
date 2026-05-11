import { useState } from 'react';

export function Login({ aoLogar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function gerenciarLogin(event) {
    event.preventDefault();
    
    // Validação simples (exemplo: admin / 123456)
    if (email === 'admin@motoprime.com' && senha === '123456') {
      const usuario = { email, nome: 'Administrador' };
      window.localStorage.setItem('usuario-motos', JSON.stringify(usuario));
      aoLogar(usuario);
    } else {
      setErro('Credenciais inválidas.');
    }
  }

  return (
    <div className="modal-backdrop">
      <section className="modal" role="dialog">
        <h2>Acessar Moto Prime</h2>
        <form onSubmit={gerenciarLogin}>
          <label>
            E-mail
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="seu@email.com"
            />
          </label>
          <label>
            Senha
            <input 
              type="password" 
              required 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              placeholder="******"
            />
          </label>
          
          {erro && <p style={{ color: 'red', fontSize: '14px' }}>{erro}</p>}

          <div className="modal__actions">
            <button className="buy-button" type="submit">Entrar</button>
          </div>
        </form>
      </section>
    </div>
  );
}