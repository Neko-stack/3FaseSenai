import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'

const Autores = () => {
    const [autores, setPosts] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/autores")
            .then(res => res.json())
            .then(data => {
                setPosts(data)
            })
    }, [])
    return (
        <>
            <div className='flex gap-2'>
            {autores.map(autor => (
                <div key={autor.id} className="card">
                    <img src={autor.foto} />
                    <h2>{autor.nome}</h2>
                    <h3>{autor.especialidade}</h3>
                    <p>{autor.descricao}</p>
                    
                    <Link to={`/autor/${autor.id}`} className='inline-flex items-center text-xl justify-center text-white bg-blue-500 "'>
                        ver mais
                    </Link>
                </div>
                    )
                    )
                }
            </div>
        </>

    )
}

export default Autores