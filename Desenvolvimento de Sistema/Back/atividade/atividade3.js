class FilaPrioridade {
    constructor() {
        this.elders = []
        this.normal = []
    }

    enqueue(value) {
        if (value.isElderly) {
            this.elders.push(value)
        } else {
            this.normal.push(value)
        }
    }

    dequeue() {
        if (this.elders.length > 0) {
            return this.elders.shift()
        }
        if (this.normal.length > 0) {
            return this.normal.shift()
        }
        return "Fila vazia"
    }
}