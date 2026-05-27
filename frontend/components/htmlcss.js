// htmlcss.js - Etapa visual: HTML, CSS e Bootstrap
import { tipoToString } from '../assets/tipoHelper.js';

function getRealSource(key, dados) {
    if (!dados || !dados._meta) return 'default';
    return dados._meta[key] || 'default';
}

function computeInferredHighlights(dados) {
    const highlights = [];
    const allKeys = [
        { key: 'tipo', label: 'Tipo(s) de aplicação', isObject: true },
        { key: 'backend', label: 'Backend' },
        { key: 'frontend', label: 'Frontend' },
        { key: 'banco', label: 'Banco de dados' },
        { key: 'auth', label: 'Autenticação' },
        { key: 'storage', label: 'Storage' },
        { key: 'ia', label: 'IA' },
        { key: 'cloud', label: 'Cloud' },
        { key: 'realtime', label: 'Tempo real' },
        { key: 'automacoes', label: 'Automações' },
        { key: 'docker', label: 'Docker' },
        { key: 'kubernetes', label: 'Kubernetes' },
        { key: 'monitoramento', label: 'Monitoramento' },
        { key: 'workers', label: 'Workers' },
        { key: 'filas', label: 'Filas' },
        { key: 'servicos', label: 'Serviços' },
    ];
    for (const { key, label, isObject } of allKeys) {
        const val = dados[key];
        if (val === undefined || val === null) continue;
        const display = isObject
            ? (val.values ? val.values.join(', ') + (val.primary ? ` (primário: ${val.primary})` : '') : JSON.stringify(val))
            : (Array.isArray(val) ? val.join(', ') : String(val));
        if (display && display !== '' && display !== '-' && display !== 'Não' && display !== 'nao') {
            const source = getRealSource(key, dados);
            highlights.push({ key, label, value: display, source });
        }
    }
    return highlights;
}

export function renderHtmlCss(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    const highlights = computeInferredHighlights(dados);
    const tipoStr = tipoToString(dados.tipo);
    const totalInf = highlights.length;

    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Dashboard do Sistema</h3>
            <p class="mb-3">Resumo visual de todas as decisões e inferências do seu projeto.</p>

            <!-- Badge de tipo -->
            <div class="d-flex flex-wrap align-items-center gap-2 mb-4">
                <span class="badge bg-primary fs-6">${tipoStr || 'Nenhum tipo'}</span>
                ${dados.escala ? `<span class="badge bg-secondary fs-6">Complexidade: ${dados.escala}</span>` : ''}
                ${dados.crescimento ? `<span class="badge bg-info fs-6">Crescimento: ${dados.crescimento}</span>` : ''}
                <span class="badge bg-light text-dark fs-6">${totalInf} item(ns) detectado(s)</span>
            </div>

            <!-- Cartões de métricas rápidas -->
            <div class="row g-3 mb-4">
                <div class="col-md-3 col-6">
                    <div class="card border-primary h-100">
                        <div class="card-body text-center py-3">
                            <div class="fs-2 fw-bold text-primary">${dados.usuarios || '-'}</div>
                            <small class="text-muted">Usuários</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="card border-success h-100">
                        <div class="card-body text-center py-3">
                            <div class="fs-2 fw-bold text-success">${dados.simultaneos || '-'}</div>
                            <small class="text-muted">Simultâneos</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="card border-warning h-100">
                        <div class="card-body text-center py-3">
                            <div class="fs-2 fw-bold text-warning">${dados.tipo_uso || '-'}</div>
                            <small class="text-muted">Uso</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="card border-info h-100">
                        <div class="card-body text-center py-3">
                            <div class="fs-2 fw-bold text-info">${dados.ambiente || '-'}</div>
                            <small class="text-muted">Ambiente</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Itens detectados automaticamente (inferências) -->
            <div class="mb-4">
                <h5 class="d-flex align-items-center gap-2">
                    <span>🧠 Itens Detectados</span>
                    <span class="badge bg-light text-dark">${totalInf} item(ns)</span>
                </h5>
                ${highlights.length === 0 ? `
                    <div class="alert alert-light border text-muted py-2 mb-0">
                        Nenhum item detectado automaticamente. Preencha sua descrição na Etapa 2 para ativar inferências.
                    </div>
                ` : `
                    <div class="row g-2">
                        ${highlights.map(h => `
                            <div class="col-md-4 col-sm-6">
                                <div class="border rounded p-2 d-flex align-items-center gap-2 bg-white inference-highlight" style="border-left: 3px solid #0d6efd;">
                                    <span class="badge bg-primary rounded-circle" style="width:18px;height:18px;font-size:10px;display:flex;align-items:center;justify-content:center;">✓</span>
                                    <div class="flex-grow-1">
                                        <strong class="d-block small">${h.label}</strong>
                                        <span class="text-muted small">${h.value}</span>
                                    </div>
                                    <span class="badge bg-light text-info" style="font-size:9px;">auto</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>

            <!-- Services (se houver) -->
            ${Array.isArray(dados.servicos) && dados.servicos.length ? `
                <div class="mb-4">
                    <h5 class="d-flex align-items-center gap-2">
                        <span>☁️ Serviços</span>
                        <span class="badge bg-light text-dark">${dados.servicos.length}</span>
                    </h5>
                    <div class="d-flex flex-wrap gap-2">
                        ${dados.servicos.map(s => `<span class="badge bg-secondary">${s}</span>`).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Ações rápidas -->
            <div class="d-flex flex-wrap gap-2 border-top pt-3">
                <button class="btn btn-outline-primary" id="back">
                    ← Voltar
                </button>
                <button class="btn btn-primary" id="preview-main-action-btn">
                    📋 Ver Resumo Final
                </button>
                <button class="btn btn-outline-success" id="export-json-btn">
                    📥 Exportar Dados
                </button>
            </div>
        </div>
    `;

    // Back button
    document.getElementById('back').onclick = () => {
        import('./layout.js').then(m => m.renderLayout(dados));
    };

    // Main action: go to summary
    document.getElementById('preview-main-action-btn').onclick = () => {
        // Build full dados with all computed fields for summary
        const fullDados = Object.assign({}, dados);
        // Navigate to summary
        import('./summary.js').then(m => m.renderSummary(fullDados));
    };

    // Export JSON button
    document.getElementById('export-json-btn').onclick = () => {
        const clean = {};
        Object.keys(dados).sort().forEach(k => {
            const v = dados[k];
            if (v !== undefined && v !== null && v !== '' && v !== '-') {
                clean[k] = v;
            }
        });
        const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'arquitetura-dados.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Live preview highlight style
    if (!document.getElementById('dashboard-highlight-style')) {
        const s = document.createElement('style');
        s.id = 'dashboard-highlight-style';
        s.textContent = `
            .inference-highlight {
                transition: background-color 0.2s, box-shadow 0.2s;
            }
            .inference-highlight:hover {
                background-color: #f0f7ff !important;
                box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.15);
            }
            @keyframes fadeInHighlight {
                from { opacity: 0; transform: translateY(4px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .inference-highlight {
                animation: fadeInHighlight 0.3s ease-out;
            }
        `;
        document.head.appendChild(s);
    }
}