import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test('mostra erro quando login recebe credenciais invalidas', async ({ page }) => {
  await page.getByPlaceholder('seu@email.com').fill('cliente@motoprime.com');
  await page.getByPlaceholder('******').fill('senha-errada');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText('Credenciais inválidas.')).toBeVisible();
  await expect(page.getByRole('heading', { name: /motos prontas/i })).toBeHidden();
  await expect
    .poll(async () => page.evaluate(() => window.localStorage.getItem('usuario-motos')))
    .toBeNull();
});

test('permite sair e volta para o formulario de login', async ({ page }) => {
  await page.getByPlaceholder('seu@email.com').fill('admin@motoprime.com');
  await page.getByPlaceholder('******').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByRole('heading', { name: /motos prontas/i })).toBeVisible();

  await page.getByRole('button', { name: 'Sair' }).click();

  await expect(page.getByRole('heading', { name: 'Acessar Moto Prime' })).toBeVisible();
  await expect
    .poll(async () => page.evaluate(() => window.localStorage.getItem('usuario-motos')))
    .toBeNull();
});

test('cadastra usuario e permite login com a nova conta', async ({ page }) => {
  await page.getByRole('button', { name: 'Cadastro' }).click();
  await page.getByPlaceholder('Seu nome').fill('Maria Cliente');
  await page.getByPlaceholder('seu@email.com').fill('maria@motoprime.com');
  await page.getByPlaceholder('******').fill('123456');
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(page.getByText('Cadastro realizado. Entre com seu e-mail e senha.')).toBeVisible();

  await page.getByPlaceholder('******').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText('Olá, Maria Cliente')).toBeVisible();
  await expect(page.getByRole('heading', { name: /motos prontas/i })).toBeVisible();
});
