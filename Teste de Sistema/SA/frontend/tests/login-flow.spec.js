import { expect, test } from '@playwright/test';

test('login via UI mostra a vitrine', async ({ page }, testInfo) => {
  await page.goto('/');
  // garantir estado limpo
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();

  // coletar logs para diagnóstico
  const consoleMsgs = [];
  const pageErrors = [];
  page.on('console', (msg) => consoleMsgs.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', (err) => pageErrors.push(err.message));

  // preencher o formulário de login
  await page.getByPlaceholder('seu@email.com').fill('admin@motoprime.com');
  await page.getByPlaceholder('******').fill('123456');
  await page.getByRole('button', { name: 'Entrar' }).click();

  // aguardar carregamento da aplicação
  await page.waitForLoadState('networkidle');

  // salvar screenshot para inspeção
  const screenshotPath = testInfo.outputPath('after-login.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // publicar logs na saída do teste para diagnóstico
  console.log('--- Console messages after login ---');
  consoleMsgs.forEach((m) => console.log(m));
  console.log('--- Page errors after login ---');
  pageErrors.forEach((e) => console.log(e));
  console.log('Screenshot saved to', screenshotPath);

  // checar se a vitrine aparece
  await expect(page.getByRole('heading', { name: /motos prontas/i })).toBeVisible();
});

