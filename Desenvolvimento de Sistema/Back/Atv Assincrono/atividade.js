//Atividade 1

const tempoAssar = 3500
const time = 3500

function fazerBolo(time){
    return new Promise(
        (resolve, reject) => {
            setTimeout(() => {
            const tempoAssar = 3500
            const time = 3500

            if(time === tempoAssar ){ //3 pois está com 3,5 segundos
            resolve(`Esperou ${time}ms`);
            }else{
            reject('Fail')
            }
           },
        time);
    });
}

fazerBolo(3500)
    .then(console.log('Opa assou o bolo'))
    .catch(console.error('Vixi deu ruim o bolo'))
.finally(console.log('Oloco o bolo ja acabou'))




//Atividade 2

function numeros(algum){
    return new Promise(
        (resolve, reject) => {
            setTimeout(() => {
                const algum = 3
                if(algum > 5){ 
                resolve(`${algum}`);
                }else{
                reject('Fail')
                }
            },
            algum);
        });
}

numeros(3500)
    .then(console.log('resolve'))
    .catch(console.error('reject'))
.finally(console.log('E isso é tudo por hoje pessoal!'))