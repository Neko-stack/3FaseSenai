export const createUser = (userData) => {
    
    if (userData  || !userData.name)  {
        throw new Error('O nome do usuário é obrigatório.')
    }
     if(userData.age < 18){
        throw new Error("O usuário deve ser maior de idade.")
    }

    return{

        id: Math.floor(Math.random(1,10)),
        name: userData.name,
        age: userData.age,
        isActive: true,
        roles: ["user"]
    
}
}
