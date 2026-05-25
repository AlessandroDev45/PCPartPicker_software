// Playwright config for funil E2E
module.exports = {
  testDir: './tests',
  timeout: 120000,
  use: {
    baseURL: 'http://localhost:8000',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10000,
    navigationTimeout: 10000
  },
  reporter: [['list'], ['json', { outputFile: './e2e/reports/report.json' }]]
};
