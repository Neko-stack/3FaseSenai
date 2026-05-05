import { test, expect } from '@playwright/test'

test("implementar o contador de click", async ({ page }) => {
    // navegar até a home
    await page.goto('/')

    // localizar e instanciar o botão em uma variável
    const counterButton = page.getByRole('button', { name: 'Count is 0' })

    // Verificar se o button está renderizado na tela
    await expect(counterButton).toBeVisible()

    // Clicar no botão
    await counterButton.click()

    // testar se o conteúdo do botão mudou de 0 para 1
    await expect(page.getByRole('button')).toContainText('Count is 1')


    const counterButton3 = page.getByRole('button', { name: 'Count is 1' })

    await expect(counterButton3).toBeVisible()

    // Clicar 5 vezes mais e testar se mudou para 6 o count
     await counterButton3.click()
    

    // // Verificar se o conteúdo do botão está 'Count is 6'
     await expect(page.getByRole('button')).toContainText('Count is 2')

     const counterButton4 = page.getByRole('button', { name: 'Count is 2' })

    await expect(counterButton4).toBeVisible()

    // Clicar 5 vezes mais e testar se mudou para 6 o count
     await counterButton4.click()
    

    // // Verificar se o conteúdo do botão está 'Count is 6'
     await expect(page.getByRole('button')).toContainText('Count is 3')

     const counterButton5 = page.getByRole('button', { name: 'Count is 3' })

    await expect(counterButton5).toBeVisible()

    // Clicar 5 vezes mais e testar se mudou para 6 o count
     await counterButton5.click()
    

    // // Verificar se o conteúdo do botão está 'Count is 6'
     await expect(page.getByRole('button')).toContainText('Count is 4')

     const counterButton6 = page.getByRole('button', { name: 'Count is 4' })

    await expect(counterButton6).toBeVisible()

    // Clicar 5 vezes mais e testar se mudou para 6 o count
     await counterButton6.click()
    

    // // Verificar se o conteúdo do botão está 'Count is 6'
     await expect(page.getByRole('button')).toContainText('Count is 5')

     const counterButton7 = page.getByRole('button', { name: 'Count is 5' })

    await expect(counterButton7).toBeVisible()

    // Clicar 5 vezes mais e testar se mudou para 6 o count
     await counterButton7.click()
    

    // // Verificar se o conteúdo do botão está 'Count is 6'
     await expect(page.getByRole('button')).toContainText('Count is 6')

})