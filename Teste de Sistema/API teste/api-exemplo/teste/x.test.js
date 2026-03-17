import { userService } from "./userService.js"


test('testando usuario', () => {
    expect(() => userService(userData)).toThrow('Nome inválido')
})