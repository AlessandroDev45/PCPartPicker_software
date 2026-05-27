// intro.js - Renderiza a introdução e o início do funil técnico

import { renderWithProgress } from '../assets/renderWithProgress.js';
import { normalizeTipo, loadStoredTipos, saveStoredTipos, tipoToString, mergeAndSaveDados } from '../assets/tipoHelper.js';

export function renderIntro() {
    renderWithProgress(0, (container) => {
        if (!container) return;
        container.innerHTML = `
            <div class="card shadow-sm p-4 mb-4">
                <h2 class="mb-3">Vou conduzir você por um funil técnico inteligente para descobrir a melhor arquitetura possível para seu projeto.</h2>
                <p>Não vamos escolher tecnologias aleatoriamente. Selecione um ou mais tipos; use ℹ️ para detalhes, ☆ para marcar primário, ou adicione um tipo personalizado.</p>
                <div class="d-flex justify-content-start align-items-center mb-3"><span id="intro-selected-badge" class="badge bg-primary">0 selecionado(s)</span></div>
                <div id="intro-placeholder"></div>
            </div>
        `;
        const stored = loadStoredTipos();
        renderStep1(stored || [], container);
    });
}

export function renderStep1(preselected = [], container = null) {
    const root = container || document.getElementById('etapa') || document.getElementById('app');
    if (!root) return;
    // normalize preselected (accept array, string or object {values, primary})
    let selectedValues = [];
    let selectedPrimary = null;
    if (Array.isArray(preselected)) selectedValues = preselected.slice();
    else if (preselected && typeof preselected === 'object' && Array.isArray(preselected.values)) { selectedValues = preselected.values.slice(); selectedPrimary = preselected.primary || null; }
    else if (preselected) selectedValues = [preselected];
    const selectedSet = new Set(selectedValues);

    root.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Qual o tipo principal da sua aplicação?</h3>
            <p class="text-muted">Você pode selecionar vários tipos. Clique em uma carta para marcar/desmarcar. Clique em ℹ️ para ver detalhes.</p>
            <div class="mb-3"><span id="selected-count" class="badge bg-primary">${selectedSet.size} selecionado(s)</span></div>
            <div id="selected-chips" class="mb-2"></div>
            <div class="row row-cols-2 row-cols-md-4 g-3" id="tipo-grid">
                ${renderTypeOption('🖥', 'Aplicação Local')}
                ${renderTypeOption('🌐', 'Web App')}
                ${renderTypeOption('📱', 'Mobile')}
                ${renderTypeOption('☁', 'SaaS')}
                ${renderTypeOption('🤖', 'Automação')}
                ${renderTypeOption('🛰', 'Bot 24h')}
                ${renderTypeOption('🔌', 'API / Backend')}
                ${renderTypeOption('🏭', 'Sistema Industrial')}
                ${renderTypeOption('🧠', 'IA')}
                ${renderTypeOption('📊', 'Dashboard')}
                ${renderTypeOption('💻', 'Desktop')}
                ${renderTypeOption('🎮', 'Jogo')}
                ${renderTypeOption('📡', 'IoT')}
                ${renderTypeOption('⚡', 'PWA')}
                ${renderTypeOption('🧭', 'Edge')}
                ${renderTypeOption('🔩', 'Embedded')}
                ${renderTypeOption('📈', 'Data Pipeline')}
                ${renderTypeOption('🔁', 'Realtime')}
                ${renderTypeOption('🛠', 'Admin')}
                ${renderTypeOption('🔄', 'Sistema Híbrido')}
            </div>
            <div class="mt-3 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-outline-secondary" id="clear-selection">Limpar</button>
                    <div class="input-group ms-2" style="max-width:320px;">
                        <input id="custom-type-input" class="form-control form-control-sm" placeholder="Adicionar outro tipo..." />
                        <button class="btn btn-sm btn-outline-primary" id="custom-type-add">Adicionar</button>
                    </div>
                </div>
                <div>
                    <button class="btn btn-secondary me-2" id="view-details" style="display:none">Ver Detalhes</button>
                    <button class="btn btn-primary" id="next-step" disabled>Avançar</button>
                </div>
            </div>
        </div>
    `;

    function persist() {
        const tiposObj = { values: Array.from(selectedSet), primary: selectedPrimary };
        saveStoredTipos(tiposObj);
        try { mergeAndSaveDados({ tipo: tiposObj }); } catch (e) {}
    }

    function updateUI(save = true) {
        const countEl = root.querySelector('#selected-count');
        if (countEl) countEl.textContent = `${selectedSet.size} selecionado(s)`;
        const chips = root.querySelector('#selected-chips');
        if (chips) {
            chips.innerHTML = '';
            Array.from(selectedSet).forEach(t => {
                const span = document.createElement('span');
                span.className = 'badge bg-light text-dark me-2 chip';
                span.style.padding = '0.35rem 0.6rem';
                span.innerHTML = `${t} ${selectedPrimary===t? '<span class="text-warning">★</span>' : ''} <button class="btn-close ms-2 remove-chip" aria-label="Remover" data-type="${t}"></button>`;
                chips.appendChild(span);
            });
            // attach remove handlers
            chips.querySelectorAll('.remove-chip').forEach(btn => {
                btn.onclick = (e) => {
                    const t = btn.dataset.type;
                    selectedSet.delete(t);
                    if (selectedPrimary === t) selectedPrimary = null;
                    updateUI();
                };
            });
        }

        root.querySelectorAll('.card-option').forEach(card => {
            const tipo = card.getAttribute('data-type');
            if (selectedSet.has(tipo)) { card.classList.add('selected'); card.setAttribute('aria-pressed', 'true'); } else { card.classList.remove('selected'); card.setAttribute('aria-pressed', 'false'); }
            const primaryBtn = card.querySelector('.primary-btn');
            if (primaryBtn) primaryBtn.textContent = selectedPrimary === tipo ? '★' : '☆';
            if (selectedPrimary === tipo) card.classList.add('primary'); else card.classList.remove('primary');
        });

        const next = root.querySelector('#next-step');
        if (next) next.disabled = selectedSet.size === 0;
        if (save) persist();
    }

    root.querySelectorAll('.card-option').forEach(card => {
        const tipo = card.getAttribute('data-type');
        // apply preselection
        if (selectedSet.has(tipo)) { card.classList.add('selected'); card.setAttribute('aria-pressed', 'true'); } else { card.setAttribute('aria-pressed', 'false'); }

        // toggle selection on card click
        card.addEventListener('click', (e) => {
            if (e.target && e.target.classList && (e.target.classList.contains('info-btn') || e.target.classList.contains('primary-btn'))) return;
            if (selectedSet.has(tipo)) {
                selectedSet.delete(tipo);
                if (selectedPrimary === tipo) selectedPrimary = null;
                card.classList.remove('selected');
                card.setAttribute('aria-pressed', 'false');
            } else {
                selectedSet.add(tipo);
                card.classList.add('selected');
                card.setAttribute('aria-pressed', 'true');
            }
            updateUI();
        });

        // primary button
        const primaryBtn = card.querySelector('.primary-btn');
        if (primaryBtn) {
            primaryBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                if (selectedPrimary === tipo) {
                    selectedPrimary = null;
                } else {
                    selectedPrimary = tipo;
                    selectedSet.add(tipo);
                    card.classList.add('selected');
                    card.setAttribute('aria-pressed', 'true');
                }
                updateUI();
            });
        }

        // info button inside card
        const infoBtn = card.querySelector('.info-btn');
        if (infoBtn) {
            infoBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                renderTypeExplanation(tipo, { values: Array.from(selectedSet), primary: selectedPrimary }, root);
            });
        }
    });

    // clear selection
    const clearBtn = root.querySelector('#clear-selection');
    if (clearBtn) clearBtn.addEventListener('click', () => {
        selectedSet.clear();
        selectedPrimary = null;
        root.querySelectorAll('.card-option.selected').forEach(c => c.classList.remove('selected'));
        updateUI();
    });

    // add custom type
    const addCustom = root.querySelector('#custom-type-add');
    if (addCustom) addCustom.addEventListener('click', () => {
        const input = root.querySelector('#custom-type-input');
        const v = input && input.value ? input.value.trim() : '';
        if (!v) return;
        if (!selectedSet.has(v)) selectedSet.add(v);
        input.value = '';
        updateUI();
    });

    // next step
    const nextBtn = root.querySelector('#next-step');
    if (nextBtn) nextBtn.addEventListener('click', () => {
        const tipoObj = { values: Array.from(selectedSet), primary: selectedPrimary };
        persist();
        try { mergeAndSaveDados({ tipo: tipoObj }); } catch (e) {}
        import('./step2.js').then(m => m.renderStep2(tipoObj));
    });

    updateUI(false);
}

function renderTypeOption(emoji, label) {
    // includes a primary button and an info button
    return `<div class="col"><div class="card card-option text-center p-3" data-type="${label}" role="button" tabindex="0" aria-pressed="false" aria-label="${label}" style="position:relative;">
        <button class="primary-btn" aria-label="Marcar primário" title="Marcar primário" style="position:absolute;left:10px;top:8px;border:none;background:transparent;font-size:1rem;">☆</button>
        <button class="info-btn" aria-label="Ver detalhes" title="Ver detalhes" style="position:absolute;right:10px;top:8px;border:none;background:transparent;font-size:1rem;">ℹ️</button>
        <span style="font-size:2rem;">${emoji}</span><br><strong>${label}</strong>
    </div></div>`;
}

function renderTypeExplanation(tipo, preservedSelected = [], container = null) {
    const root = container || document.getElementById('etapa') || document.getElementById('app');
    if (!root) return;
    const explicacoes = {
        'Aplicação Local': '<p>Aplicações instaladas e executadas localmente no computador do usuário. Vantagens: desempenho e funcionamento offline. Desvantagens: distribuição e atualizações.</p><p><strong>Exemplos:</strong> Ferramenta de contabilidade desktop, utilitário de backup local.</p>',
        'Web App': '<p>Aplicações acessadas via navegador, fáceis de distribuir e multiplataforma, mas dependem de conexão.</p><p><strong>Exemplos:</strong> Loja virtual, plataforma de suporte ao cliente.</p>',
        'Mobile': '<p>Aplicativos para smartphones/tablets (nativos ou híbridos). Ideais para experiências móveis e notificações push.</p><p><strong>Exemplos:</strong> App bancário, app de delivery.</p>',
        'SaaS': '<p>Software entregue como serviço, multiusuário e hospedado na nuvem. Focado em assinaturas e escalabilidade.</p><p><strong>Exemplos:</strong> CRM online, ferramenta de gestão financeira.</p>',
        'Automação': '<p>Jobs e scripts automatizados para tarefas repetitivas (ETL, integração, scraping).</p><p><strong>Exemplos:</strong> Pipeline de ingestão de dados, geração automática de relatórios.</p>',
        'Bot 24h': '<p>Serviços contínuos que respondem automaticamente (chatbots, agentes de notificação). Precisam de monitoramento e escalabilidade.</p><p><strong>Exemplos:</strong> Bot de atendimento no Telegram, agente de alertas no Slack.</p>',
        'API / Backend': '<p>Serviços que expõem lógica e dados via APIs (REST/GraphQL). Normalmente consumidos por frontends ou integrações.</p><p><strong>Exemplos:</strong> Serviço de autenticação, catálogo de produtos.</p>',
        'Sistema Industrial': '<p>Sistemas integrados a equipamentos industriais (PLCs, SCADA). Requerem alta confiabilidade e compatibilidade com hardware específico.</p><p><strong>Exemplos:</strong> Supervisório de fábrica, controle de linha de produção.</p>',
        'IA': '<p>Soluções com modelos de machine learning para previsões, classificação ou automação inteligente.</p><p><strong>Exemplos:</strong> Recomendação de produtos, classificação automática de imagens.</p>',
        'Dashboard': '<p>Painéis de visualização e monitoramento de métricas (BI).</p><p><strong>Exemplos:</strong> Dashboard de vendas, painel de saúde operacional.</p>',
        'Desktop': '<p>Aplicações ricas para PC/Mac (Electron, .NET, nativas). Foco em performance e integração com o sistema operacional.</p><p><strong>Exemplos:</strong> Editor de texto avançado, software de edição de imagens.</p>',
        'Jogo': '<p>Aplicações de entretenimento com requisitos específicos de performance e gráficos.</p><p><strong>Exemplos:</strong> Jogo casual para web, jogo multiplayer para desktop.</p>',
        'IoT': '<p>Dispositivos e sensores conectados com comunicação para a nuvem ou gateways. Atenção à segurança e conectividade.</p><p><strong>Exemplos:</strong> Sensor de temperatura conectado, gateway doméstico inteligente.</p>',
        'PWA': '<p>Progressive Web Apps: sites que fornecem experiência similar a app (instalável, offline, push).</p><p><strong>Exemplos:</strong> Loja com modo offline, leitor de notícias instalável via navegador.</p>',
        'Edge': '<p>Processamento na borda (edge) para reduzir latência e tráfego ao centro de dados.</p><p><strong>Exemplos:</strong> Funções em CDN, processamento local em gateways industriais.</p>',
        'Embedded': '<p>Sistemas embarcados com firmware para hardware dedicado; exigem otimização de recursos.</p><p><strong>Exemplos:</strong> Firmware para microcontrolador, placa de controle embarcada.</p>',
        'Data Pipeline': '<p>Fluxos de ingestão, transformação e entrega de dados (ETL/ELT).</p><p><strong>Exemplos:</strong> Pipeline com Kafka + Spark, ETL agendado com Airflow.</p>',
        'Realtime': '<p>Sistemas com comunicação em tempo real e baixa latência (WebSocket, WebRTC).</p><p><strong>Exemplos:</strong> Chat em tempo real, dashboard de cotações ao vivo.</p>',
        'Admin': '<p>Interfaces de administração e backoffice para gestão interna e operações.</p><p><strong>Exemplos:</strong> Painel de gestão de usuários, console de configuração.</p>',
        'Sistema Híbrido': '<p>Arquitetura que combina múltiplos tipos (por exemplo: mobile + backend + IoT). Oferece flexibilidade, mas aumenta a complexidade.</p><p><strong>Exemplos:</strong> App mobile que sincroniza com dispositivos IoT e painel web administrativo.</p>',
    };
    root.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">${tipo}</h3>
            <div class="mb-2">${explicacoes[tipo] || '<p>Tipo não encontrado.</p>'}</div>
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-secondary" id="back">Voltar</button>
                <button class="btn btn-outline-primary" id="add-and-back">Adicionar e Voltar</button>
                <button class="btn btn-primary" id="next-single">Avançar com este tipo</button>
            </div>
        </div>
    `;
    root.querySelector('#back').onclick = () => renderStep1(preservedSelected, root);
    root.querySelector('#add-and-back').onclick = () => {
        let arr = [];
        if (Array.isArray(preservedSelected)) arr = preservedSelected.slice();
        else if (preservedSelected && typeof preservedSelected === 'object' && Array.isArray(preservedSelected.values)) arr = preservedSelected.values.slice();
        else if (preservedSelected) arr = [preservedSelected];
        if (!arr.includes(tipo)) arr.push(tipo);
        renderStep1({ values: arr, primary: preservedSelected && preservedSelected.primary ? preservedSelected.primary : null }, root);
    };
    root.querySelector('#next-single').onclick = () => {
        import('./step2.js').then(m => m.renderStep2({ values: [tipo], primary: tipo }));
    };
}
