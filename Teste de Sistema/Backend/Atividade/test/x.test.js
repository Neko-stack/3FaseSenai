import { createUser } from "./userService.js"


test('testando usuario', () => {
    expect(() => createUser(userData)).toThrow('Nome inválido')
})