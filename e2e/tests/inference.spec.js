const { test, expect } = require('@playwright/test');

test.describe('Inferência e Revisão de NLP', () => {

  test('deve detectar e exibir inferências ao digitar descrição detalhada', async ({ page }) => {
    // Navigate and start funnel
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('funil:dados'));
    await page.click('#start-funnel-index');
    await page.waitForSelector('#tipo-grid');

    // Select a type and advance to step2
    await page.click(`#tipo-grid [data-type="Web App"]`);
    await page.click('#next-step');
    await page.waitForSelector('#escala-form');

    // Fill form with a description that triggers multiple inferences
    await page.fill('#escala-form textarea[name="resumo"]',
      'Sistema web com IA, Postgres, autenticação JWT, Docker, Kubernetes, WebSocket, ' +
      '1000 usuários, 200 simultâneos, machine learning, Stripe para pagamentos, ' +
      'monitoramento com Prometheus + Grafana, backup automático, LGPD, criptografia'
    );
    await page.fill('#escala-form input[name="usuarios"]', '1000');
    await page.fill('#escala-form input[name="simultaneos"]', '200');
    await page.selectOption('#escala-form select[name="tipo_uso"]', 'comercial');
    await page.selectOption('#escala-form select[name="crescimento"]', 'alto');
    await page.click('#escala-form button[type="submit"]');

    // Wait for inference review modal to appear
    await page.waitForSelector('.modal-dialog', { timeout: 5000 });
    await page.waitForSelector('#accepted-count');

    // Verify modal title is visible
    const modalTitle = await page.textContent('.modal-title');
    expect(modalTitle).toContain('Inferências Detectadas');

    // Count inference items
    const items = await page.$$('.inference-item');
    expect(items.length).toBeGreaterThanOrEqual(3);

    // Verify specific detections are present
    const bodyText = await page.textContent('.modal-body');
    expect(bodyText).toMatch(/IA|Machine Learning|ML/i);
    expect(bodyText).toMatch(/Postgres|PostgreSQL|banco/i);
    expect(bodyText).toMatch(/JWT|OAuth|auth/i);
    expect(bodyText).toMatch(/Docker|Kubernetes/i);
    expect(bodyText).toMatch(/Prometheus|Grafana|monitoramento/i);

    // Accept all and confirm
    await page.click('#inference-accept-all');
    await page.click('#inference-confirm');

    // Should navigate to step3 (conect-form)
    await page.waitForSelector('#conect-form', { timeout: 5000 });
    expect(await page.isVisible('#conect-form')).toBeTruthy();
  });

  test('deve permitir rejeitar e editar inferências individuais', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('funil:dados'));
    await page.click('#start-funnel-index');
    await page.waitForSelector('#tipo-grid');
    await page.click(`#tipo-grid [data-type="Mobile"]`);
    await page.click('#next-step');
    await page.waitForSelector('#escala-form');

    // Description to trigger inferences
    await page.fill('#escala-form textarea[name="resumo"]',
      'App mobile com backend FastAPI, MongoDB, Redis para cache, deploy na AWS'
    );
    await page.fill('#escala-form input[name="usuarios"]', '500');
    await page.fill('#escala-form input[name="simultaneos"]', '50');
    await page.selectOption('#escala-form select[name="tipo_uso"]', 'pequena_empresa');
    await page.selectOption('#escala-form select[name="crescimento"]', 'medio');
    await page.click('#escala-form button[type="submit"]');

    // Wait for modal
    await page.waitForSelector('.modal-dialog', { timeout: 5000 });

    // Reject the first item by clicking its toggle (✅ → ❌)
    await page.locator('.inference-item').first().locator('.inference-toggle').click();
    // Verify the first item got the rejected style
    await expect(page.locator('.inference-item').first()).toHaveClass(/inference-rejected/);

    // Edit the second item
    const secondItem = page.locator('.inference-item').nth(1);
    await secondItem.locator('.inference-edit').click();
    // Wait for the edit input to become visible in this specific item
    const editInput = secondItem.locator('.inference-edit-input');
    await editInput.waitFor({ state: 'visible', timeout: 5000 });
    await editInput.fill('Editado Manualmente');
    await secondItem.locator('.inference-edit-confirm').click();
    // Verify the displayed value updated
    await expect(secondItem.locator('.inference-value')).toContainText('Editado Manualmente');

    // Confirm
    await page.click('#inference-confirm');

    // Should navigate to step3
    await page.waitForSelector('#conect-form', { timeout: 5000 });
    expect(await page.isVisible('#conect-form')).toBeTruthy();
  });

  test('deve prosseguir sem modal quando não há descrição', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('funil:dados'));
    await page.click('#start-funnel-index');
    await page.waitForSelector('#tipo-grid');
    await page.click(`#tipo-grid [data-type="API / Backend"]`);
    await page.click('#next-step');
    await page.waitForSelector('#escala-form');

    // Leave description empty
    await page.fill('#escala-form input[name="usuarios"]', '100');
    await page.fill('#escala-form input[name="simultaneos"]', '10');
    await page.selectOption('#escala-form select[name="tipo_uso"]', 'interno');
    await page.selectOption('#escala-form select[name="crescimento"]', 'baixo');
    await page.click('#escala-form button[type="submit"]');

    // No modal — directly goes to step3
    await page.waitForSelector('#conect-form', { timeout: 5000 });
    expect(await page.isVisible('#conect-form')).toBeTruthy();
  });
});