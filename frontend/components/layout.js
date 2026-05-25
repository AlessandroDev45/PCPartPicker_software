// layout.js - Layout visual e estrutura de arquitetura
export function renderLayout(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Layout Visual da Arquitetura</h3>
            <p class="mb-4">Veja abaixo o diagrama visual e a estrutura de componentes do seu sistema, conforme as escolhas feitas no funil técnico.</p>
            <div class="row mb-4">
                <div class="col-md-8">
                    <div class="bg-light border rounded p-3 mb-3">
                        <h5>Diagrama de Blocos (Exemplo)</h5>
                        <div id="diagram-container" style="min-height:220px;">
                            <!-- Aqui pode ser renderizado um diagrama SVG, Mermaid ou imagem -->
                            <pre class="bg-white p-2 rounded"><code class="language-mermaid">
flowchart TD
    Frontend[Frontend: ${dados.frontend || 'Next.js/React/...'}]
    Backend[Backend: ${dados.backend || 'FastAPI/NestJS/...'}]
    DB[(Banco: ${dados.banco || 'PostgreSQL/Supabase/...'} )]
    Storage[(Storage: ${dados.storage || 'S3/Supabase/...'} )]
    IA[[IA: ${dados.ia || 'OpenAI/HuggingFace/...'} ]]
    Auth[[Auth: ${dados.auth || 'JWT/OAuth/...'} ]]
    Workers[[Workers: ${dados.workers || 'Celery/PM2/...'} ]]
    Filas[[Filas: ${dados.filas || 'Redis/RabbitMQ/...'} ]]
    Frontend -->|API| Backend
    Backend --> DB
    Backend --> Storage
    Backend --> IA
    Backend --> Auth
    Backend --> Workers
    Workers --> Filas
                        </code></pre>
                        <small class="text-muted">* Diagrama gerado conforme respostas. Personalize conforme sua arquitetura real.</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="bg-light border rounded p-3">
                        <h5>Resumo dos Componentes</h5>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item"><strong>Frontend:</strong> ${dados.frontend || '-'}</li>
                            <li class="list-group-item"><strong>Backend:</strong> ${dados.backend || '-'}</li>
                            <li class="list-group-item"><strong>Banco:</strong> ${dados.banco || '-'}</li>
                            <li class="list-group-item"><strong>Storage:</strong> ${dados.storage || '-'}</li>
                            <li class="list-group-item"><strong>IA:</strong> ${dados.ia || '-'}</li>
                            <li class="list-group-item"><strong>Auth:</strong> ${dados.auth || '-'}</li>
                            <li class="list-group-item"><strong>Workers:</strong> ${dados.workers || '-'}</li>
                            <li class="list-group-item"><strong>Filas:</strong> ${dados.filas || '-'}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <button class="btn btn-secondary" id="back">Voltar</button>
                <button class="btn btn-primary ms-2" id="htmlcss">Ver HTML/CSS/Bootstrap</button>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./summary.js').then(m => m.renderSummary(dados));
    };
        document.getElementById('htmlcss').onclick = () => {
            import('./htmlcss.js').then(m => m.renderHtmlCss(dados));
        };
    // Opcional: aqui pode-se integrar um renderizador Mermaid para exibir o diagrama visualmente
}
