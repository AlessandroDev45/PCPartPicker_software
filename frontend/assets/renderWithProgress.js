// renderWithProgress.js - Shared helper to render steps with progress
export function renderWithProgress(
    etapaIdx,
    renderEtapa
) {
    const app = document.getElementById('app');
    if (!app) return;
    // Assume renderProgress is available from components/progress.js
    import('../components/progress.js').then(m => {
        const renderProgress = m.renderProgress;
        app.innerHTML = renderProgress(etapaIdx) + '<div id="etapa"></div>';
        renderEtapa(document.getElementById('etapa'));
    });
}
