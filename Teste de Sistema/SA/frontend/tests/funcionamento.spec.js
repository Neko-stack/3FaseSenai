import { expect, test } from '@playwright/test';

const ADMIN_EMAIL = 'admin@motoprime.com';
const SENHA = '123456';

async function entrar(page, email = ADMIN_EMAIL, senha = SENHA) {
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('******').fill(senha);
  await page.getByRole('button', { name: 'Entrar' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test('login valido abre o sistema e logout volta para a tela de acesso', async ({ page }) => {
  await entrar(page);

  await expect(page.getByRole('heading', { name: /motos prontas/i })).toBeVisible();
  await expect(page.getByText('Honda CB 500F')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('token-motos'))).not.toBeNull();

  await page.getByRole('button', { name: 'Sair' }).click();

  await expect(page.getByRole('heading', { name: 'Acessar Moto Prime' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('token-motos'))).toBeNull();
});

test('login invalido mostra erro e nao cria sessao', async ({ page }) => {
  await entrar(page, ADMIN_EMAIL, 'senha-errada');

  await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Acessar Moto Prime' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('token-motos'))).toBeNull();
});

test('cadastro de usuario permite login e consulta pelo e-mail', async ({ page }) => {
  const email = `funcional.${Date.now()}@motoprime.com`;

  await page.getByRole('button', { name: 'Cadastro' }).click();
  await page.getByPlaceholder('Seu nome').fill('Usuario Funcional');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('******').fill(SENHA);
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(page.getByText(/cadastro realizado/i)).toBeVisible();
  await page.getByPlaceholder('******').fill(SENHA);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.getByRole('button', { name: 'Usuario' }).click();

  await expect(page.getByRole('heading', { name: 'Consulta de usuarios' })).toBeVisible();
  await page.getByPlaceholder('Buscar usuario').fill(email);
  await expect(page.getByRole('listitem').filter({ hasText: email })).toContainText('Usuario Funcional');
});

test('cadastro, alteracao e exclusao de moto funcionam pela interface', async ({ page }) => {
  const modelo = `FUNCIONAL-${Date.now()}`;

  await entrar(page);
  await page.getByRole('button', { name: 'Cadastrar moto' }).click();
  await page.getByLabel('Marca', { exact: true }).fill('Ducati');
  await page.getByLabel('Modelo').fill(modelo);
  await page.getByLabel('Categoria').fill('Naked');
  await page.getByLabel('Preco').fill('59900');
  await page.getByLabel('Ano').fill('2024');
  await page.getByLabel('KM').fill('1200');
  await page.getByLabel('Cilindradas').fill('803');
  await page.getByLabel('Cor').fill('Vermelha');
  await page.getByRole('button', { name: 'Cadastrar moto' }).last().click();

  await expect(page.locator('.moto-card').filter({ hasText: `Ducati ${modelo}` })).toBeVisible();

  await page.getByRole('button', { name: 'Usuario' }).click();
  await page.getByRole('listitem').filter({ hasText: `Ducati ${modelo}` }).getByRole('button', { name: 'Editar' }).click();
  await page.getByLabel('Cor').fill('Azul');
  await page.getByRole('button', { name: 'Salvar alteracoes' }).click();

  await page.getByRole('button', { name: 'Home' }).click();
  await expect(page.locator('.moto-card').filter({ hasText: `Ducati ${modelo}` })).toContainText('Azul');

  await page.getByRole('button', { name: 'Usuario' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('listitem').filter({ hasText: `Ducati ${modelo}` }).getByRole('button', { name: 'Excluir' }).click();

  await expect(page.getByText(`Ducati ${modelo}`)).toBeHidden();
});
