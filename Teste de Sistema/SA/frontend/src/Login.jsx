import { useState } from 'react';
import { loginNaApi } from './api.js';

const USUARIOS_CHAVE = 'usuarios-motos';
const usuarioPadrao = {
  nome: 'Administrador',
  email: 'admin@motoprime.com',
  senha: '123456',
};

function lerUsuarios() {
  try {
    const usuarios = JSON.parse(window.localStorage.getItem(USUARIOS_CHAVE) || '[]');
    return Array.isArray(usuarios) ? usuarios : [];
  } catch {
    return [];
  }
}

function salvarUsuarios(usuarios) {
  window.localStorage.setItem(USUARIOS_CHAVE, JSON.stringify(usuarios));
}

export function Login({ aoLogar }) {
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  function limparAvisos() {
    setErro('');
    setMensagem('');
  }

  async function gerenciarLogin(event) {
    event.preventDefault();

    const emailTratado = email.trim();

    try {
      const usuarioDaApi = await loginNaApi(emailTratado, senha);

      if (usuarioDaApi) {
        const usuario = { email: usuarioDaApi.email, nome: usuarioDaApi.nome };
        window.localStorage.setItem('usuario-motos', JSON.stringify(usuario));
        aoLogar(usuario);
        return;
      }
    } catch (error) {
      console.warn('[Login] API indisponível, tentando login local:', error?.message || error);
    }

    const usuarios = [usuarioPadrao, ...lerUsuarios()];
    const usuarioEncontrado = usuarios.find(
      (usuario) => usuario.email === emailTratado && usuario.senha === senha
    );

    if (usuarioEncontrado) {
      const usuario = { email: usuarioEncontrado.email, nome: usuarioEncontrado.nome };
      window.localStorage.setItem('usuario-motos', JSON.stringify(usuario));
      aoLogar(usuario);
    } else {
      setErro('Credenciais inválidas.');
      setMensagem('');
    }
  }

  function gerenciarCadastro(event) {
    event.preventDefault();

    const nomeTratado = nome.trim();
    const emailTratado = email.trim();
    const usuarios = lerUsuarios();
    const emailJaExiste =
      usuarioPadrao.email === emailTratado ||
      usuarios.some((usuario) => usuario.email === emailTratado);

    if (emailJaExiste) {
      setErro('Este e-mail já está cadastrado.');
      setMensagem('');
      return;
    }

    salvarUsuarios([...usuarios, { nome: nomeTratado, email: emailTratado, senha }]);
    setModo('login');
    setSenha('');
    setMensagem('Cadastro realizado. Entre com seu e-mail e senha.');
    setErro('');
  }

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-labelledby="auth-titulo">
        <div className="auth-hero__content">
          <p className="eyebrow">Moto Prime</p>
          <h1 id="auth-titulo">Escolha sua próxima moto com mais controle</h1>
          <p>
            Cadastre-se para salvar favoritos, acompanhar compras e acessar a vitrine completa da
            concessionária.
          </p>
        </div>
      </section>

      <section className="auth-panel" aria-label="Acesso do cliente">
        <div className="auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Escolha entre login e cadastro">
            <button
              className={modo === 'login' ? 'active' : ''}
              onClick={() => {
                setModo('login');
                limparAvisos();
              }}
              type="button"
            >
              Login
            </button>
            <button
              className={modo === 'cadastro' ? 'active' : ''}
              onClick={() => {
                setModo('cadastro');
                limparAvisos();
              }}
              type="button"
            >
              Cadastro
            </button>
          </div>

          <h2>{modo === 'login' ? 'Acessar Moto Prime' : 'Criar cadastro'}</h2>

          <form onSubmit={modo === 'login' ? gerenciarLogin : gerenciarCadastro}>
            {modo === 'cadastro' && (
              <label>
                Nome
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Seu nome"
                />
              </label>
            )}

            <label>
              E-mail
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seu@email.com"
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="******"
              />
            </label>

            {erro && <p className="form-error">{erro}</p>}
            {mensagem && <p className="form-success">{mensagem}</p>}

            <button className="buy-button" type="submit">
              {modo === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
