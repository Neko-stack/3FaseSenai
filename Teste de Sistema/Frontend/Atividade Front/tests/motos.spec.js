import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test('mostra a vitrine inicial de motos', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /motos prontas/i })).toBeVisible();
  await expect(page.getByText('Honda CB 500F')).toBeVisible();
  await expect(page.getByText('Yamaha MT-03')).toBeVisible();
  await expect(page.getByText('BMW G 310 GS')).toBeVisible();
});

test('filtra motos por busca', async ({ page }) => {
  await page.getByPlaceholder('Buscar por modelo').fill('ninja');

  await expect(page.getByText('Kawasaki Ninja 400')).toBeVisible();
  await expect(page.getByText('Honda CB 500F')).toBeHidden();
});

test('filtra motos por categoria', async ({ page }) => {
  await page.getByRole('button', { name: 'Adventure' }).click();

  await expect(page.getByText('BMW G 310 GS')).toBeVisible();
  await expect(page.getByText('Yamaha MT-03')).toBeHidden();
});

test('salva favorito e compra no localStorage', async ({ page }) => {
  const primeiroCard = page.locator('.moto-card').first();

  await primeiroCard.getByTitle('Adicionar aos favoritos').click();
  await primeiroCard.getByRole('button', { name: 'Comprar' }).click();
  await page.getByPlaceholder('Seu nome').fill('Gabriel');
  await page.getByLabel('Forma de pagamento').selectOption('Financiamento');
  await page.getByRole('button', { name: 'Confirmar compra' }).click();

  await expect(page.getByText('1 favoritas')).toBeVisible();
  await expect(page.getByText('1 compras')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Compra realizada' })).toBeVisible();

  await page.getByRole('button', { name: 'Fechar' }).click();
  await expect(primeiroCard.getByRole('button', { name: 'Comprada' })).toBeDisabled();

  await expect
    .poll(async () => page.evaluate(() => window.localStorage.getItem('favoritos-motos')))
    .toBe('[1]');
  await expect
    .poll(async () => page.evaluate(() => JSON.parse(window.localStorage.getItem('compras-motos'))))
    .toEqual([
      {
        motoId: 1,
        moto: 'Honda CB 500F',
        nome: 'Gabriel',
        pagamento: 'Financiamento',
      },
    ]);
});
