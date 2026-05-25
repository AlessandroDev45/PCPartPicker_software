const { test, expect } = require('@playwright/test');
const fs = require('fs');

const types = ['Aplicação Local','Web App','Mobile','SaaS','Automação','Bot 24h','API / Backend','Sistema Industrial','IA','Dashboard','Desktop','Jogo','IoT','PWA','Edge','Embedded','Data Pipeline','Realtime','Admin','Sistema Híbrido'];

test.describe('Funil técnico - sweep por tipo', () => {
  test('percorre tipos e valida avanços', async ({ page }) => {
    const results = [];

    for (const tipo of types) {
      const entry = { tipo, selectFlow: {}, primaryFlow: {} };
      try {
        // clear central storage
        await page.goto('/');
        await page.evaluate(() => localStorage.removeItem('funil:dados'));
        await page.click('#start-funnel-index');
        await page.waitForSelector('#tipo-grid');

        // select-only
        try {
          await page.click(`#tipo-grid [data-type="${tipo}"]`);
          const nextEnabled = await page.isEnabled('#next-step');
          entry.selectFlow.nextEnabled = nextEnabled;
          if (nextEnabled) {
            await page.click('#next-step');
            await page.waitForSelector('#escala-form');
            await page.fill('#escala-form input[name="usuarios"]','100');
            await page.fill('#escala-form input[name="simultaneos"]','10');
            await page.selectOption('#escala-form select[name="tipo_uso"]','comercial');
            await page.selectOption('#escala-form select[name="crescimento"]','alto');
            await page.click('#escala-form button[type="submit"]');
            await page.waitForSelector('#conect-form');
            await page.selectOption('#conect-form select[name="internet"]','online');
            await page.selectOption('#conect-form select[name="realtime"]','nao');
            await page.selectOption('#conect-form select[name="edge"]','nao');
            await page.click('#conect-form button[type="submit"]');
            await page.waitForSelector('#dados-form');
            await page.selectOption('#dados-form select[name="usa_banco"]','sim');
            // pick an available tipo_dados if present
            const tipos = await page.$$('[name="tipos_dados"]');
            if (tipos.length) await tipos[0].click();
            await page.click('#dados-form button[type="submit"]');
            await page.waitForSelector('#proc-form');
            await page.selectOption('#proc-form select[name="ia"]','nao');
            await page.selectOption('#proc-form select[name="cpu_gpu"]','nao');
            await page.selectOption('#proc-form select[name="automacoes"]','nao');
            await page.selectOption('#proc-form select[name="paralelo"]','nao');
            await page.selectOption('#proc-form select[name="realtime"]','nao');
            await page.click('#proc-form button[type="submit"]');
            await page.waitForSelector('#backend-grid');

            // select backend card and ensure next becomes enabled
            await page.click('#backend-grid .backend-card');
            const backendNext = await page.isEnabled('#next-backend');
            entry.selectFlow.backendNextEnabled = backendNext;
            if (backendNext) {
              await page.click('#next-backend');
              await page.waitForSelector('#infra-form');
              entry.selectFlow.reachedInfra = true;
            } else entry.selectFlow.reachedInfra = false;
          }
        } catch (e) {
          entry.selectFlow.error = String(e);
        }

        // primary flow
        try {
          await page.goto('/');
          await page.evaluate(() => localStorage.removeItem('funil:dados'));
          await page.click('#start-funnel-index');
          await page.waitForSelector('#tipo-grid');
          const selector = `#tipo-grid [data-type="${tipo}"]`;
          const card = page.locator(selector);
          await card.locator('.primary-btn').click();
          const nextEnabled = await page.isEnabled('#next-step');
          entry.primaryFlow.nextEnabled = nextEnabled;
          if (nextEnabled) {
            await page.click('#next-step');
            // repeat the happy path as above
            await page.waitForSelector('#escala-form');
            await page.fill('#escala-form input[name="usuarios"]','100');
            await page.fill('#escala-form input[name="simultaneos"]','10');
            await page.selectOption('#escala-form select[name="tipo_uso"]','comercial');
            await page.selectOption('#escala-form select[name="crescimento"]','alto');
            await page.click('#escala-form button[type="submit"]');
            await page.waitForSelector('#conect-form');
            await page.selectOption('#conect-form select[name="internet"]','online');
            await page.selectOption('#conect-form select[name="realtime"]','nao');
            await page.selectOption('#conect-form select[name="edge"]','nao');
            await page.click('#conect-form button[type="submit"]');
            await page.waitForSelector('#dados-form');
            const tipos2 = await page.$$('[name="tipos_dados"]');
            if (tipos2.length) await tipos2[0].click();
            await page.click('#dados-form button[type="submit"]');
            await page.waitForSelector('#proc-form');
            await page.selectOption('#proc-form select[name="ia"]','nao');
            await page.selectOption('#proc-form select[name="cpu_gpu"]','nao');
            await page.selectOption('#proc-form select[name="automacoes"]','nao');
            await page.selectOption('#proc-form select[name="paralelo"]','nao');
            await page.selectOption('#proc-form select[name="realtime"]','nao');
            await page.click('#proc-form button[type="submit"]');
            await page.waitForSelector('#backend-grid');
            await page.click('#backend-grid .backend-card');
            const backendNext2 = await page.isEnabled('#next-backend');
            entry.primaryFlow.backendNextEnabled = backendNext2;
            if (backendNext2) {
              await page.click('#next-backend');
              await page.waitForSelector('#infra-form');
              entry.primaryFlow.reachedInfra = true;
            } else entry.primaryFlow.reachedInfra = false;
          }
        } catch (e) {
          entry.primaryFlow.error = String(e);
        }

      } catch (e) {
        entry.error = String(e);
      }
      results.push(entry);
    }

    // write report
    try { fs.mkdirSync('./e2e/reports', { recursive: true }); } catch (e) {}
    fs.writeFileSync('./e2e/reports/report.json', JSON.stringify(results, null, 2));
    console.log('E2E sweep saved to ./e2e/reports/report.json');
  });
});
