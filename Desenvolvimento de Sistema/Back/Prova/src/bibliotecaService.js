import {pool} from "./config.js";

export async function buscarProdutoPorId(produtoId) {
    try {
        const [rows] = await pool.query('SELECT * FROM produtos WHERE ID=?', [produtoId])
        return rows[0]
    } catch (error) {
        console.error(`[buscarProdutoPorId] Falha ao buscar produto ${produtoId}:`, error.message);
        throw error;
    }
};

export async function buscarView() {
    try {
        const [rows] = await pool.query("SELECT * from vw_produtos")
        return rows
    } catch (error) {
        console.error("[buscarView] Falha ao buscar view:", error.message);
        throw error;
    }
};

// export async function cadastrarNovoProduto(categoria, marca, valor_unitario, estoque_minimo, estoque_maximo) {
    // const [rows] = await pool.query( 'INSERT INTO produtos (categoria, marca, valor_unitario, estoque_minimo, estoque_maximo) VALUES(?,?,?,?,?)', [categoria, marca, valor_unitario, estoque_minimo, estoque_maximo])
    // console.log(rows)
    // return rows
//  }

export async function produtosMaiorSaidaNoPeriodo(dataInicial, dataFinal) {
    if (!dataInicial || !dataFinal) {
        throw new Error("dataInicial e dataFinal são obrigatórios");
    }
    const [rows] = await pool.query(`
    SELECT p.id AS produto_id, 
    p.categoria AS produtos, 
    p.valor_unitario, 
    m.quantidade_total_saida 
    FROM produtos p 
    LEFT JOIN 
    ( SELECT produto_id, SUM(quantidade) AS quantidade_total_saida 
    FROM movimentacoes 
    WHERE tipo = 'SAIDA' 
    AND data_movimentacao 
    BETWEEN 2026-01-01 AND 2026-01-01-30 
    GROUP BY produto_id ) 
    m ON m.produto_id = p.id 
    ORDER BY m.quantidade_total_saida DESC;`,
        [dataInicial, dataFinal]);
    return rows.map((item) => {
        const quantidade = item.quantidade_total_saida; 
        const valorUnitario = item.valor_unitario;
        return { 
            produto: item.produto, 
            quantidade_total_saida: quantidade, 
            valor_total_financeiro_saidas: quantidade * valorUnitario 
        };
    });
} 

export async function produtosMaiorEntradaNoPeriodo(dataInicial, dataFinal) {
    if (!dataInicial || !dataFinal) {
        throw new Error("dataInicial e dataFinal são obrigatórios");
    }
    const [rows] = await pool.query(`
    SELECT p.id AS produto_id, 
    p.categoria AS produtos, 
    p.valor_unitario, 
    m.quantidade_total_entrada
    FROM produtos p 
    LEFT JOIN 
    ( SELECT produto_id, SUM(quantidade) AS quantidade_total_entrada
    FROM movimentacoes 
    WHERE tipo = 'ENTRADA' 
    AND data_movimentacao 
    BETWEEN 2026-01-01 AND 2026-01-01-30 
    GROUP BY produto_id ) 
    m ON m.produto_id = p.id 
    ORDER BY m.quantidade_total_entrada DESC;`,
       [dataInicial, dataFinal] );
    return rows.map((item) => {
        const quantidade = item.quantidade_total_entrada; 
        const valorUnitario = item.valor_unitario;
        return { 
            produto: item.produto, 
            quantidade_total_entrada: quantidade, 
            valor_total_financeiro_entradas: quantidade * valorUnitario 
        };
    });
} 