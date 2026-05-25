// progress.js - Barra de progresso e etapas do funil
export function renderProgress(etapaAtual) {
    const etapas = [
        'Tipo', 'Escala', 'Conectividade', 'Dados', 'Processamento', 'Infraestrutura', 'Segurança', 'Capacitação', 'Resumo', 'Layout', 'HTML/CSS'
    ];
    const percent = 100 / etapas.length;
    let html = `<div class="mb-3 progress-wrapper">`;
    // Visual progress bar (no text inside segments)
    html += `<div class="progress" style="height: 1.6rem;">`;
    etapas.forEach((etapa, idx) => {
        const cls = idx <= etapaAtual ? 'bg-success' : 'bg-light';
        html += `<div class="progress-bar ${cls}" role="progressbar" style="width: ${percent}%"></div>`;
    });
    html += `</div>`;

    // Separate row with labels aligned to the segments
    html += `<div class="progress-labels d-flex mt-2">`;
    etapas.forEach((etapa, idx) => {
        const active = idx <= etapaAtual ? 'active' : '';
        html += `<div class="progress-label text-center ${active}" style="width:${percent}%" title="${etapa}">${etapa}</div>`;
    });
    html += `</div>`;

    html += `</div>`;
    return html;
}
