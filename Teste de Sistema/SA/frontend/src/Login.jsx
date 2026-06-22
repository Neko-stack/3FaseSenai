import { useState } from 'react';
import { cadastrarUsuarioNaApi, loginNaApi } from './api.js';

export function Login({ aoLogar }) {
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  function trocarModo(novoModo) {
    setModo(novoModo);
    setErro('');
    setMensagem('');
  }

  async function gerenciarLogin(event) {
    event.preventDefault();
    try {
      const usuarioDaApi = await loginNaApi(email.trim().toLowerCase(), senha);
      const usuario = { id: usuarioDaApi.id, email: usuarioDaApi.email, nome: usuarioDaApi.nome };
      window.localStorage.setItem('usuario-motos', JSON.stringify(usuario));
      aoLogar(usuario);
    } catch (error) {
      setErro(error.message || 'Credenciais invalidas.');
      setMensagem('');
    }
  }

  async function gerenciarCadastro(event) {
    event.preventDefault();
    try {
      await cadastrarUsuarioNaApi({ nome: nome.trim(), email: email.trim().toLowerCase(), senha });
      setModo('login');
      setNome('');
      setSenha('');
      setMensagem('Cadastro realizado. Entre com seu e-mail e senha.');
      setErro('');
    } catch (error) {
      setErro(error.message || 'Nao foi possivel cadastrar usuario.');
      setMensagem('');
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-labelledby="auth-titulo">
        <div className="auth-hero__content">
          <p className="eyebrow">Moto Prime</p>
          <h1 id="auth-titulo">Escolha sua proxima moto com mais controle</h1>
          <p>Cadastre-se para acessar a vitrine e gerenciar o estoque da concessionaria.</p>
        </div>
      </section>
      <section className="auth-panel" aria-label="Acesso do cliente">
        <div className="auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Escolha entre login e cadastro">
            <button className={modo === 'login' ? 'active' : ''} onClick={() => trocarModo('login')} type="button">Login</button>
            <button className={modo === 'cadastro' ? 'active' : ''} onClick={() => trocarModo('cadastro')} type="button">Cadastro</button>
          </div>
          <h2>{modo === 'login' ? 'Acessar Moto Prime' : 'Criar cadastro'}</h2>
          <form onSubmit={modo === 'login' ? gerenciarLogin : gerenciarCadastro}>
            {modo === 'cadastro' && (
              <label>Nome<input type="text" required maxLength={100} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" /></label>
            )}
            <label>E-mail<input type="email" required maxLength={100} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" /></label>
            <label>Senha<input type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="******" /></label>
            {erro && <p className="form-error">{erro}</p>}
            {mensagem && <p className="form-success">{mensagem}</p>}
            <button className="buy-button" type="submit">{modo === 'login' ? 'Entrar' : 'Cadastrar'}</button>
          </form>
        </div>
      </section>
    </main>
  );
}
