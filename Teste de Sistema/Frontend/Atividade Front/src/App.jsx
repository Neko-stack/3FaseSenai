import { Heart, Search, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { categorias, motos } from './motos.js';

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

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
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [favoritos, setFavoritos] = useState(() => lerStorage('favoritos-motos', []));
  const [compras, setCompras] = useState(() => lerStorage('compras-motos', []));
  const [motoSelecionada, setMotoSelecionada] = useState(null);
  const [nomeComprador, setNomeComprador] = useState('');
  const [pagamento, setPagamento] = useState('Pix');
  const [compraFinalizada, setCompraFinalizada] = useState(false);

  const motosFiltradas = useMemo(() => {
    return motos.filter((moto) => {
      const combinaBusca = moto.nome.toLowerCase().includes(busca.toLowerCase());
      const combinaCategoria = categoria === 'Todas' || moto.categoria === categoria;
      return combinaBusca && combinaCategoria;
    });
  }, [busca, categoria]);

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

  return (
    <main>
      <section className="hero" aria-labelledby="titulo-principal">
        <div className="hero__content">
          <p className="eyebrow">Concessionaria Moto Prime</p>
          <h1 id="titulo-principal">Motos prontas para sair da loja</h1>
          <p>
            Compare modelos, salve seus favoritos e compre sua moto informando seus dados de
            pagamento.
          </p>
          <div className="hero__stats" aria-label="Resumo do estoque">
            <span>{motos.length} motos</span>
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
