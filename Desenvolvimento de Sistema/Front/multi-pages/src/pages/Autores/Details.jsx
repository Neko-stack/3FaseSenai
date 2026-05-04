import React, { useEffect, useState } from "react";
import { useParams } from "react-router";


const Detail = () => {
    const {id} = useParams()
    const [post,setPost] = useState(null)

    useEffect(() =>{
        fetch(`http://localhost:3000/autores/${id}`)
        .then(res=> res.json())
        .then(data => setPost(data))

    }, [id])

    if (!post) return <div>Carregando...</div>

    return(
        <div className="p-4">
            <img src={post.image} alt={post.title} />
            <h1 className="text-x1 font-bold">{post.nome}</h1>
            <h3>{post.especialidade}</h3>
            <p>{post.descricao}</p>
        </div>
    )
}

export default Detail