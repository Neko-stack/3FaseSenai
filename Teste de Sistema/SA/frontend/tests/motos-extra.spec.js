import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      'usuario-motos',
      JSON.stringify({ email: 'admin@motoprime.com', nome: 'Administrador' })
    );
  });
  await page.reload();
});

test('exibe mensagem quando nenhum filtro encontra motos', async ({ page }) => {
  await page.getByPlaceholder('Buscar por modelo').fill('modelo inexistente');

  await expect(page.getByText('Nenhuma moto encontrada com esses filtros.')).toBeVisible();
  await expect(page.locator('.moto-card')).toHaveCount(0);
});

test('cancela compra sem gravar dados no localStorage', async ({ page }) => {
  const primeiroCard = page.locator('.moto-card').first();

  await primeiroCard.getByRole('button', { name: 'Comprar' }).click();
  await expect(page.getByRole('heading', { name: 'Comprar Honda CB 500F' })).toBeVisible();

  await page.getByPlaceholder('Seu nome').fill('Gabriel');
  await page.getByRole('button', { name: 'Cancelar' }).click();

  await expect(page.getByRole('heading', { name: 'Comprar Honda CB 500F' })).toBeHidden();
  await expect(page.getByText('0 compras')).toBeVisible();
  await expect
    .poll(async () => page.evaluate(() => window.localStorage.getItem('compras-motos')))
    .toBeNull();
});

test('remove favorito ao clicar novamente no mesmo card', async ({ page }) => {
  const primeiroCard = page.locator('.moto-card').first();
  const botaoFavorito = primeiroCard.getByTitle('Adicionar aos favoritos');

  await botaoFavorito.click();
  await expect(page.getByText('1 favoritas')).toBeVisible();

  await primeiroCard.getByTitle('Remover dos favoritos').click();

  await expect(page.getByText('0 favoritas')).toBeVisible();
  await expect
    .poll(async () => page.evaluate(() => window.localStorage.getItem('favoritos-motos')))
    .toBe('[]');
});
