import styles from './Header.module.css'
import React from 'react'

const Header = ({title})=>{
    return(
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
        </header>
    )
}

export default Header