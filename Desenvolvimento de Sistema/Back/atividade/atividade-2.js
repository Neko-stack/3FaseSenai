class Queue {

    constructor (){
        this.array = new Array()
    }

    enqueue(value){
        if(value.isEldery){
            let contador=0
            while(contador < this.array.length && this.array[contador].isEldery){ contador++
            }
            this.array.splice(contador, 0, value)

        }else{
            this.array.push(value)
        }
        

    }

    dequeue(){
        if(this.tamanho === 0) return "fila vazia"
        const removido = 
        this.arr [this.inicio] = undefined
        this.inicio = this.inicio +  1
        this.tamanho = this.tamanho - 1
        return removido
    }


    mostrarTamanho(){
        return this.array.length
    }

}

const fila = new Queue();

fila.enqueue({nome:"Ronald", isEldery:false})
fila.enqueue({nome:"Felipe", isEldery:false})
fila.enqueue({nome:"Fred", isEldery:false})
fila.enqueue({nome:"Sebastião", isEldery:true})
fila.enqueue({nome:"Terezinha", isEldery:true})



