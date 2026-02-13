import { buscarProdutoPorId, buscarView, cadastrarNovoProduto, produtosMaiorEntradaNoPeriodo, produtosMaiorSaidaNoPeriodo  } from "./bibliotecaService.js";
import {pool} from "./config.js";

async function  main(){
    await buscarProdutoPorId(1)
    await buscarProdutoPorId(2)
    await buscarProdutoPorId(3)
    await buscarProdutoPorId(4)
    await buscarView()
    await cadastrarNovoProduto('Amaciante', 'Downy', '67.00', '4', '40')
    await produtosMaiorEntradaNoPeriodo()
    await produtosMaiorSaidaNoPeriodo()
}

main(). catch(error =>
    console.error(error)
). finally(async()=>{
    await pool.end();
})