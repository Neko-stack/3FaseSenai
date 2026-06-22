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

test('login válido acessa o sistema e logout encerra a sessão', async ({ page }) => {
  await entrar(page);
  await expect(page.getByRole('heading', { name: /motos prontas/i })).toBeVisible();
  await expect(page.getByText('Honda CB 500F')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('token-motos'))).not.toBeNull();

  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page.getByRole('heading', { name: 'Acessar Moto Prime' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('token-motos'))).toBeNull();
});

test('login inválido informa credenciais incorretas e não cria sessão', async ({ page }) => {
  await entrar(page, ADMIN_EMAIL, 'senha-errada');
  await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Acessar Moto Prime' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('token-motos'))).toBeNull();
});

test('cadastro de usuário permite login com as novas credenciais', async ({ page }) => {
  const email = `teste.e2e.${Date.now()}@motoprime.com`;

  await page.getByRole('button', { name: 'Cadastro' }).click();
  await page.getByPlaceholder('Seu nome').fill('Maria Teste E2E');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('******').fill(SENHA);
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(page.getByText(/cadastro realizado/i)).toBeVisible();
  await page.getByPlaceholder('******').fill(SENHA);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText(/Maria Teste E2E/)).toBeVisible();
});

test('cadastro de usuário rejeita e-mail já utilizado', async ({ page }) => {
  await page.getByRole('button', { name: 'Cadastro' }).click();
  await page.getByPlaceholder('Seu nome').fill('Outro Administrador');
  await page.getByPlaceholder('seu@email.com').fill(ADMIN_EMAIL);
  await page.getByPlaceholder('******').fill(SENHA);
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(page.getByText('Este e-mail ja esta cadastrado.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Criar cadastro' })).toBeVisible();
});

test('cadastro de moto persiste, altera e exclui os dados pela API real', async ({ page }) => {
  const modelo = `E2E-${Date.now()}`;
  await entrar(page);
  await expect(page.getByRole('heading', { name: /motos prontas/i })).toBeVisible();

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

  const card = page.locator('.moto-card').filter({ hasText: `Ducati ${modelo}` });
  await expect(card).toBeVisible();
  await expect(card.getByRole('button', { name: 'Editar' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Usuario' }).click();
  const motoDoUsuario = page.getByRole('listitem').filter({ hasText: `Ducati ${modelo}` });
  await motoDoUsuario.getByRole('button', { name: 'Editar' }).click();
  await page.getByLabel('Cor').fill('Azul');
  await page.getByRole('button', { name: 'Salvar alteracoes' }).click();
  await expect(page.getByRole('heading', { name: 'Informacoes do usuario' })).toBeVisible();
  await page.getByRole('button', { name: 'Home' }).click();
  await expect(page.locator('.moto-card').filter({ hasText: `Ducati ${modelo}` })).toContainText('Azul');

  await page.getByRole('button', { name: 'Usuario' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('listitem').filter({ hasText: `Ducati ${modelo}` }).getByRole('button', { name: 'Excluir' }).click();
  await expect(page.getByText(`Ducati ${modelo}`)).toBeHidden();
});

test('cadastro de moto impede envio de ano inválido', async ({ page }) => {
  await entrar(page);
  await page.getByRole('button', { name: 'Cadastrar moto' }).click();
  await page.getByLabel('Marca', { exact: true }).fill('Honda');
  await page.getByLabel('Modelo').fill(`E2E-INVALIDA-${Date.now()}`);
  await page.getByLabel('Categoria').fill('Street');
  await page.getByLabel('Preco').fill('20000');
  await page.getByLabel('Ano').fill('1800');
  await page.getByLabel('KM').fill('0');
  await page.getByLabel('Cilindradas').fill('160');
  await page.getByLabel('Cor').fill('Preta');
  await page.getByRole('button', { name: 'Cadastrar moto' }).last().click();

  await expect(page.getByRole('heading', { name: 'Cadastrar nova moto' })).toBeVisible();
  await expect(page.getByLabel('Ano')).toBeFocused();
  expect(await page.getByLabel('Ano').evaluate((input) => input.validity.valid)).toBe(false);
});

test('limpa compras antigas e permite remover uma compra para comprar novamente', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('compras-motos', JSON.stringify([{ motoId: 1, moto: 'Compra antiga' }])));
  await entrar(page);

  const card = page.locator('.moto-card').filter({ hasText: 'Honda CB 500F' });
  await expect(card.getByRole('button', { name: 'Comprar' })).toBeEnabled();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('compras-motos'))).toBeNull();

  await card.getByRole('button', { name: 'Comprar' }).click();
  await page.getByLabel('Nome').fill('Administrador');
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await page.getByRole('button', { name: 'Fechar' }).click();
  await expect(card.getByRole('button', { name: 'Comprada' })).toBeDisabled();

  await page.getByRole('button', { name: 'Usuario' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Honda CB 500F' }).getByRole('button', { name: 'Remover' }).click();
  await page.getByRole('button', { name: 'Home' }).click();
  await expect(card.getByRole('button', { name: 'Comprar' })).toBeEnabled();
});
