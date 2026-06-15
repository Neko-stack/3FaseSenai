import { Login } from './Login.jsx';
import { Heart, Plus, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { buscarMotosDaApi } from './api.js';
import { motos as motosLocais } from './motos.js';

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const motoInicial = {
  nome: '',
  categoria: '',
  preco: '',
  ano: '',
  km: '',
  cilindradas: '',
  cor: '',
  imagem: '',
  destaque: false,
};

function lerStorage(chave, valorInicial) {
  try {
    const valor = window.localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : valorInicial;
  } catch {
    return valorInicial;
  }
}

function salvarStorage(chave, valor) {
  window.localStorage.setItem(chave, JSON.stringify(valor));
}

export function App() {
  const [pagina, setPagina] = useState('home');
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [favoritos, setFavoritos] = useState(() => lerStorage('favoritos-motos', []));
  const [compras, setCompras] = useState(() => lerStorage('compras-motos', []));
  const [motoSelecionada, setMotoSelecionada] = useState(null);
  const [nomeComprador, setNomeComprador] = useState('');
  const [pagamento, setPagamento] = useState('Pix');
  const [compraFinalizada, setCompraFinalizada] = useState(false);
  const [usuario, setUsuario] = useState(() => lerStorage('usuario-motos', null));
  const [catalogoBase, setCatalogoBase] = useState(motosLocais);
  const [motosCadastradas, setMotosCadastradas] = useState(() =>
    lerStorage('motos-cadastradas', [])
  );
  const [novaMoto, setNovaMoto] = useState(motoInicial);

  useEffect(() => {
    let ativo = true;

    buscarMotosDaApi()
      .then((motosDaApi) => {
        if (ativo && motosDaApi.length > 0) {
          setCatalogoBase(motosDaApi);
        }
      })
      .catch(() => {
        setCatalogoBase(motosLocais);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const catalogo = useMemo(
    () => [...catalogoBase, ...motosCadastradas],
    [catalogoBase, motosCadastradas]
  );

  const categorias = useMemo(
    () => ['Todas', ...new Set(catalogo.map((moto) => moto.categoria))],
    [catalogo]
  );

  const motosFiltradas = useMemo(() => {
    return catalogo.filter((moto) => {
      const combinaBusca = moto.nome.toLowerCase().includes(busca.toLowerCase());
      const combinaCategoria = categoria === 'Todas' || moto.categoria === categoria;
      return combinaBusca && combinaCategoria;
    });
  }, [busca, categoria, catalogo]);

  function fazerLogout() {
    window.localStorage.removeItem('usuario-motos');
    setUsuario(null);
  }

  if (!usuario) {
    return <Login aoLogar={setUsuario} />;
  }

  function alternarFavorito(id) {
    const novosFavoritos = favoritos.includes(id)
      ? favoritos.filter((favoritoId) => favoritoId !== id)
      : [...favoritos, id];

    setFavoritos(novosFavoritos);
    salvarStorage('favoritos-motos', novosFavoritos);
  }

  function abrirCompra(moto) {
    if (compras.some((compra) => compra.motoId === moto.id)) return;

    setMotoSelecionada(moto);
    setNomeComprador('');
    setPagamento('Pix');
  }

  function fecharCompra() {
    setMotoSelecionada(null);
    setNomeComprador('');
    setPagamento('Pix');
  }

  function finalizarCompra(event) {
    event.preventDefault();

    const novaCompra = {
      motoId: motoSelecionada.id,
      moto: motoSelecionada.nome,
      nome: nomeComprador.trim(),
      pagamento,
    };
    const novasCompras = [...compras, novaCompra];

    setCompras(novasCompras);
    salvarStorage('compras-motos', novasCompras);
    fecharCompra();
    setCompraFinalizada(true);
  }

  function atualizarNovaMoto(campo, valor) {
    setNovaMoto((motoAtual) => ({ ...motoAtual, [campo]: valor }));
  }

  function cadastrarMoto(event) {
    event.preventDefault();

    const motoCadastrada = {
      id: `local-${Date.now()}`,
      nome: novaMoto.nome.trim(),
      categoria: novaMoto.categoria.trim(),
      preco: Number(novaMoto.preco),
      ano: Number(novaMoto.ano),
      km: Number(novaMoto.km),
      cilindradas: Number(novaMoto.cilindradas),
      cor: novaMoto.cor.trim(),
      destaque: novaMoto.destaque,
      imagem:
        novaMoto.imagem.trim() ||
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
    };
    const novasMotos = [...motosCadastradas, motoCadastrada];

    setMotosCadastradas(novasMotos);
    salvarStorage('motos-cadastradas', novasMotos);
    setNovaMoto(motoInicial);
    setCategoria('Todas');
    setBusca('');
    setPagina('home');
  }

  return (
    <main>
      <header className="app-header">
        <nav className="app-nav" aria-label="Navegacao principal">
          <button
            className={pagina === 'home' ? 'nav-button active' : 'nav-button'}
            onClick={() => setPagina('home')}
            type="button"
          >
            Home
          </button>
          <button
            className={pagina === 'nova-moto' ? 'nav-button active' : 'nav-button'}
            onClick={() => setPagina('nova-moto')}
            type="button"
          >
            <Plus size={18} aria-hidden="true" />
            Cadastrar moto
          </button>
          <button
            className={pagina === 'usuario' ? 'nav-button active' : 'nav-button'}
            onClick={() => setPagina('usuario')}
            type="button"
          >
            <User size={18} aria-hidden="true" />
            Usuario
          </button>
        </nav>

        <div className="session-actions">
          <span>Olá, {usuario.nome}</span>
          <button onClick={fazerLogout} className="secondary-button" type="button">
            Sair
          </button>
        </div>
      </header>

      {pagina === 'home' && (
        <>
          <section className="hero" aria-labelledby="titulo-principal">
            <div className="hero__content">
              <p className="eyebrow">Concessionaria Moto Prime</p>
              <h1 id="titulo-principal">Motos prontas para sair da loja</h1>
              <p>
                Compare modelos, salve seus favoritos e compre sua moto informando seus dados de
                pagamento.
              </p>
              <div className="hero__stats" aria-label="Resumo do estoque">
                <span>{catalogo.length} motos</span>
                <span>{favoritos.length} favoritas</span>
                <span>{compras.length} compras</span>
              </div>
            </div>
          </section>

          <section className="toolbar" aria-label="Filtros do catalogo">
            <label className="search">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Buscar moto</span>
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por modelo"
              />
            </label>

            <div className="category-list" role="group" aria-label="Categorias">
              {categorias.map((item) => (
                <button
                  className={item === categoria ? 'active' : ''}
                  key={item}
                  onClick={() => setCategoria(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section
            className={categoria === 'Todas' ? 'grid' : 'grid grid--featured'}
            aria-label="Catalogo de motos"
          >
            {motosFiltradas.map((moto) => {
              const favorito = favoritos.includes(moto.id);
              const comprada = compras.some((compra) => compra.motoId === moto.id);

              return (
                <article className="moto-card" key={moto.id}>
                  <img alt={moto.nome} src={moto.imagem} />
                  <div className="moto-card__body">
                    <div className="moto-card__title">
                      <div>
                        <p>{moto.categoria}</p>
                        <h2>{moto.nome}</h2>
                      </div>
                      {moto.destaque && <span className="tag">Destaque</span>}
                    </div>

                    <dl>
                      <div>
                        <dt>Ano</dt>
                        <dd>{moto.ano}</dd>
                      </div>
                      <div>
                        <dt>KM</dt>
                        <dd>{moto.km.toLocaleString('pt-BR')}</dd>
                      </div>
                      <div>
                        <dt>Motor</dt>
                        <dd>{moto.cilindradas} cc</dd>
                      </div>
                      <div>
                        <dt>Cor</dt>
                        <dd>{moto.cor}</dd>
                      </div>
                    </dl>

                    <strong>{moeda.format(moto.preco)}</strong>

                    <div className="actions">
                      <button
                        aria-pressed={favorito}
                        className="icon-button"
                        onClick={() => alternarFavorito(moto.id)}
                        title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        type="button"
                      >
                        <Heart fill={favorito ? 'currentColor' : 'none'} size={20} />
                      </button>
                      <button
                        className="buy-button"
                        disabled={comprada}
                        onClick={() => abrirCompra(moto)}
                        type="button"
                      >
                        <ShoppingBag size={18} aria-hidden="true" />
                        {comprada ? 'Comprada' : 'Comprar'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {motosFiltradas.length === 0 && (
            <p className="empty">Nenhuma moto encontrada com esses filtros.</p>
          )}
        </>
      )}

      {pagina === 'usuario' && (
        <section className="page-panel" aria-labelledby="titulo-usuario">
          <div className="page-panel__header">
            <p className="eyebrow">Area do usuario</p>
            <h1 id="titulo-usuario">Informacoes do usuario</h1>
          </div>

          <div className="info-grid">
            <article className="info-card">
              <span>Nome</span>
              <strong>{usuario.nome}</strong>
            </article>
            <article className="info-card">
              <span>E-mail</span>
              <strong>{usuario.email}</strong>
            </article>
            <article className="info-card">
              <span>Favoritos</span>
              <strong>{favoritos.length}</strong>
            </article>
            <article className="info-card">
              <span>Compras</span>
              <strong>{compras.length}</strong>
            </article>
          </div>

          <section className="history" aria-labelledby="titulo-compras">
            <h2 id="titulo-compras">Compras realizadas</h2>
            {compras.length > 0 ? (
              <ul>
                {compras.map((compra) => (
                  <li key={`${compra.motoId}-${compra.nome}`}>
                    <span>{compra.moto}</span>
                    <strong>{compra.pagamento}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma compra registrada.</p>
            )}
          </section>
        </section>
      )}

      {pagina === 'nova-moto' && (
        <section className="page-panel" aria-labelledby="titulo-cadastro-moto">
          <div className="page-panel__header">
            <p className="eyebrow">Estoque</p>
            <h1 id="titulo-cadastro-moto">Cadastrar novo card de moto</h1>
          </div>

          <form className="moto-form" onSubmit={cadastrarMoto}>
            <label>
              Nome da moto
              <input
                required
                value={novaMoto.nome}
                onChange={(event) => atualizarNovaMoto('nome', event.target.value)}
                placeholder="Ex: Honda CG 160"
              />
            </label>
            <label>
              Categoria
              <input
                required
                value={novaMoto.categoria}
                onChange={(event) => atualizarNovaMoto('categoria', event.target.value)}
                placeholder="Ex: Street"
              />
            </label>
            <label>
              Preco
              <input
                required
                min="0"
                type="number"
                value={novaMoto.preco}
                onChange={(event) => atualizarNovaMoto('preco', event.target.value)}
                placeholder="25990"
              />
            </label>
            <label>
              Ano
              <input
                required
                min="1900"
                type="number"
                value={novaMoto.ano}
                onChange={(event) => atualizarNovaMoto('ano', event.target.value)}
                placeholder="2025"
              />
            </label>
            <label>
              KM
              <input
                required
                min="0"
                type="number"
                value={novaMoto.km}
                onChange={(event) => atualizarNovaMoto('km', event.target.value)}
                placeholder="0"
              />
            </label>
            <label>
              Cilindradas
              <input
                required
                min="1"
                type="number"
                value={novaMoto.cilindradas}
                onChange={(event) => atualizarNovaMoto('cilindradas', event.target.value)}
                placeholder="160"
              />
            </label>
            <label>
              Cor
              <input
                required
                value={novaMoto.cor}
                onChange={(event) => atualizarNovaMoto('cor', event.target.value)}
                placeholder="Preta"
              />
            </label>
            <label>
              URL da imagem
              <input
                value={novaMoto.imagem}
                onChange={(event) => atualizarNovaMoto('imagem', event.target.value)}
                placeholder="https://..."
              />
            </label>
            <label className="checkbox-field">
              <input
                checked={novaMoto.destaque}
                onChange={(event) => atualizarNovaMoto('destaque', event.target.checked)}
                type="checkbox"
              />
              Marcar como destaque
            </label>

            <div className="form-actions">
              <button className="secondary-button" onClick={() => setPagina('home')} type="button">
                Cancelar
              </button>
              <button className="buy-button" type="submit">
                Cadastrar moto
              </button>
            </div>
          </form>
        </section>
      )}

      {motoSelecionada && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-compra">
            <h2 id="titulo-compra">Comprar {motoSelecionada.nome}</h2>
            <p>{moeda.format(motoSelecionada.preco)}</p>

            <form onSubmit={finalizarCompra}>
              <label>
                Nome
                <input
                  required
                  value={nomeComprador}
                  onChange={(event) => setNomeComprador(event.target.value)}
                  placeholder="Seu nome"
                />
              </label>

              <label>
                Forma de pagamento
                <select value={pagamento} onChange={(event) => setPagamento(event.target.value)}>
                  <option>Pix</option>
                  <option>Cartao de credito</option>
                  <option>Financiamento</option>
                  <option>Dinheiro</option>
                </select>
              </label>

              <div className="modal__actions">
                <button className="secondary-button" onClick={fecharCompra} type="button">
                  Cancelar
                </button>
                <button className="buy-button" type="submit">
                  Confirmar compra
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {compraFinalizada && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal success-modal" role="alertdialog" aria-modal="true">
            <h2>Compra realizada</h2>
            <button
              className="buy-button"
              onClick={() => setCompraFinalizada(false)}
              type="button"
            >
              Fechar
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
