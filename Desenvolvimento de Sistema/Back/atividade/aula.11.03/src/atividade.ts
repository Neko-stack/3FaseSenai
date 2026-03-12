class Produto{
nome: string;
preco: number

constructor(nome: string, preco: number){ 
this.nome = nome;
this.preco = preco;
 }
}





class Categoria{
    nome: string;
    desconto: number;
    constructor(nome:string, desconto: number){
    this.nome = nome;
    this.desconto = desconto;
    }


    calcularPrecoComDesconto(produto:Produto): number{
        const precoComDesconto = produto.preco - (produto.preco * (this.desconto / 100));
        return precoComDesconto
    }
}

const camisata = new Produto('Camiseta',50);
const bermuda = new Produto('Bermuda', 100);
const verao = new Categoria('Verao', 10)
const primavera = new Categoria('Primavera', 30)

const precoFinal = verao.calcularPrecoComDesconto(bermuda)

console.log(`O preço final é ${precoFinal}`)