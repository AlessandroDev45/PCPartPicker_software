// main.ts - Entry point for frontend logic

import { renderIntro } from '../components/intro.js';
import { renderProgress } from '../components/progress.js';
import { renderStep6Backend } from '../components/step6_backend.js';

// Função para renderizar etapa com barra de progresso
export function renderWithProgress(
    etapaIdx: number,
    renderEtapa: (container: HTMLElement | null) => void
) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = renderProgress(etapaIdx) + '<div id="etapa"></div>';
    renderEtapa(document.getElementById('etapa'));
}

document.addEventListener('DOMContentLoaded', () => {
    renderIntro();
});

// Exemplo de como chamar a etapa de backend (pode ser chamado a partir de um botão ou navegação do funil)
// Para integração real, ajuste a navegação entre etapas para chamar renderWithProgress(6, renderStep6Backend)
// Exemplo:
// renderWithProgress(6, renderStep6Backend);
