// layout.js - Layout visual e estrutura de arquitetura
export function renderLayout(dados) {
    const app = document.getElementById('app');
    if (!app) return;

    const mermaidDiagram = `flowchart TD
    Frontend[Frontend: ${dados.frontend || 'Next.js/React/...'}]
    Backend[Backend: ${dados.backend || 'FastAPI/NestJS/...'}]
    ${dados.banco && dados.banco !== '-' ? `DB[(Banco: ${dados.banco})]` : ''}
    ${dados.storage && dados.storage !== '-' ? `Storage[(Storage: ${dados.storage})]` : ''}
    ${dados.ia && dados.ia !== 'Não' && dados.ia !== '-' ? `IA[[IA: ${dados.ia}]]` : ''}
    ${dados.auth && dados.auth !== 'Sem autenticação' && dados.auth !== '-' ? `Auth[[Auth: ${dados.auth}]]` : ''}
    ${dados.workers && dados.workers !== '-' ? `Workers[[Workers: ${dados.workers}]]` : ''}
    ${dados.filas && dados.filas !== '-' ? `Filas[[Filas: ${dados.filas}]]` : ''}
    Frontend -->|API| Backend
    ${dados.banco && dados.banco !== '-' ? 'Backend --> DB' : ''}
    ${dados.storage && dados.storage !== '-' ? 'Backend --> Storage' : ''}
    ${dados.ia && dados.ia !== 'Não' && dados.ia !== '-' ? 'Backend --> IA' : ''}
    ${dados.auth && dados.auth !== 'Sem autenticação' && dados.auth !== '-' ? 'Backend --> Auth' : ''}
    ${dados.workers && dados.workers !== '-' ? 'Backend --> Workers' : ''}
    ${dados.workers && dados.workers !== '-' && dados.filas && dados.filas !== '-' ? 'Workers --> Filas' : ''}
    `;

    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Layout Visual da Arquitetura</h3>
            <p class="mb-4">Diagrama dinâmico dos componentes do seu sistema (apenas o que foi selecionado).</p>
            <div class="row mb-4">
                <div class="col-md-8">
                    <div class="bg-light border rounded p-3 mb-3">
                        <h5>Diagrama de Blocos</h5>
                        <div id="diagram-container" style="min-height:220px;">
                            <pre class="bg-white p-2 rounded"><code class="language-mermaid">
${mermaidDiagram}
                            </code></pre>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="bg-light border rounded p-3">
                        <h5>Resumo dos Componentes</h5>
                        <ul class="list-group list-group-flush">
                            ${dados.frontend && dados.frontend !== '-' ? `<li class="list-group-item"><strong>Frontend:</strong> ${dados.frontend}</li>` : ''}
                            ${dados.backend && dados.backend !== '-' ? `<li class="list-group-item"><strong>Backend:</strong> ${dados.backend}</li>` : ''}
                            ${dados.banco && dados.banco !== '-' ? `<li class="list-group-item"><strong>Banco:</strong> ${dados.banco}</li>` : ''}
                            ${dados.storage && dados.storage !== '-' ? `<li class="list-group-item"><strong>Storage:</strong> ${dados.storage}</li>` : ''}
                            ${dados.ia && dados.ia !== 'Não' && dados.ia !== '-' ? `<li class="list-group-item"><strong>IA:</strong> ${dados.ia}</li>` : ''}
                            ${dados.auth && dados.auth !== 'Sem autenticação' && dados.auth !== '-' ? `<li class="list-group-item"><strong>Auth:</strong> ${dados.auth}</li>` : ''}
                            ${dados.workers && dados.workers !== '-' ? `<li class="list-group-item"><strong>Workers:</strong> ${dados.workers}</li>` : ''}
                            ${dados.filas && dados.filas !== '-' ? `<li class="list-group-item"><strong>Filas:</strong> ${dados.filas}</li>` : ''}
                            ${dados.realtime === 'sim' ? `<li class="list-group-item"><strong>Realtime:</strong> Sim</li>` : ''}
                        </ul>
                    </div>
                </div>
            </div>
            <button class="btn btn-secondary" id="back">Voltar</button>
            <button class="btn btn-primary ms-2" id="htmlcss">Ver Dashboard</button>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./summary.js').then(m => m.renderSummary(dados));
    };
    document.getElementById('htmlcss').onclick = () => {
        import('./htmlcss.js').then(m => m.renderHtmlCss(dados));
    };
}