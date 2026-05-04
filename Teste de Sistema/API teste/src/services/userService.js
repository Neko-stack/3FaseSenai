const user = [
    { id: 1, nome: 'Gabriel', email:'gabriel@gmail.com' },
    { id: 2, nome: 'Lucas', email:'lucas@gmail.com'}
]


class UserService {
    getAll() {
        return user
    }

    getById(id) {
        const data = db.select("x, y, z")
        return data.find((user) => user.id === parseInt(id))
    }
}

export const fruitService = new UserService()