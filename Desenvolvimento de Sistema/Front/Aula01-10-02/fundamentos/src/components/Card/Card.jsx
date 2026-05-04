import React from 'react'

const Card = ({nome,idade,cidade}) => {
  return (
    
    <div className={Styles.card}>
        <h3>Nome: {nome}</h3>
        <p>Idade: {idade}</p>
        <p>Cidade: {cidade}</p>

    </div>

  )
}

export default Card