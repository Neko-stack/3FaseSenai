import { useEffect, useState } from 'react'
import styles from './Card.module.css'

export const CardApi = () => {

    //const[contador, setContador] = useState(0)

    //const incrementaValor = ()=>{

     //   setContador(prev => prev + 1)
       // console.log("contador", contador)
    //}
     const [users,setUsers] = useState([])
   

        useEffect(()=>{

            fetch('https://jsonplaceholder.typicode.com/users/')
            .then(res => res.json())
            .then(data => setUsers(data))
           // console.log(users)

        },[])
    return( 
    <>
    <div className={styles.cardContainerApi}>
        {
            users.map((user) =>(
                <div className={styles.card} key={user.id}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <p>{user.address.street}</p>
                    <p>{user.address.geo.lat}</p>
                    <p>{user.address.geo.lng}</p>

                    
            </div>
            ))
        }
    </div>
     </>
    )
}