class Queue {

    constructor (){
        this.array = new Array()
        this.inicio = 0
        this.final = 0
        this.tamanho = 0
    }

    enqueue(value){
        this.array [this.final] = value
        this.final = this.final + 1
        this.tamanho = this.tamanho + 1

    }

    dequeue(){
        if(this.tamanho === 0) return "fila vazia"
        const removido = this.array[this.inicio]
        this.arr [this.inicio] = undefined
        this.inicio = this.inicio +  1
        this.tamanho = this.tamanho - 1
        return removido
    }

    peek(){
        return this.arr[this.inicio]
    }
    mostrarTamanho(){
        return this.tamanho
    }

}

const fila = new Queue();

fila.enqueue("Ronald")
fila.enqueue("Felipe")
fila.enqueue("Frederico")
console.log(fila.dequeue())



console.log(fila.peek())
