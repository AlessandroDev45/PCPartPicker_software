// summary.js - Arquitetura Final
// REGRA DE PRIORIDADE: 1. Escolha manual do usuario  2. Inferencia NLP  3. Default seguro
import { tipoToString, getOrigin } from '../assets/tipoHelper.js';

function includes(arr, v) {
    return Array.isArray(arr) && arr.indexOf(v) !== -1;
}

function computeFinal(dados = {}) {
    const final = {};
    const tipos = (dados.tipo && dados.tipo.values) ? dados.tipo.values : [];
    const tipoPrimary = dados.tipo ? dados.tipo.primary : null;
    const servicos = Array.isArray(dados.servicos) ? dados.servicos : [];
    const tiposDados = Array.isArray(dados.tipos_dados) ? dados.tipos_dados : [];

    // Nível de complexidade
    if (dados.crescimento) {
        const map = { baixo: 'Baixo', medio: 'Médio', alto: 'Alto', explosivo: 'Muito alto' };
        final.escala = map[dados.crescimento] || dados.crescimento;
    } else if (dados.usuarios) {
        const u = parseInt(dados.usuarios, 10) || 0;
        final.escala = u < 1000 ? 'Baixo' : u < 10000 ? 'Médio' : 'Alto';
    } else {
        final.escala = '-';
    }

    // Frontend — prioridade: primary > tipos > NLP > default
    const feOrigin = getOrigin('frontend', dados);
    if (feOrigin === 'manual' && dados.frontend) {
        final.frontend = dados.frontend;
    } else if (tipoPrimary === 'Mobile') {
        final.frontend = 'React Native / Flutter (mobile)';
    } else if (tipoPrimary === 'Desktop') {
        final.frontend = 'Electron ou Tauri (desktop)';
    } else if (tipos.some(t => ['Web App','PWA','Admin','Dashboard'].includes(t))) {
        final.frontend = 'Next.js / React';
    } else if (tipos.includes('Desktop')) {
        final.frontend = 'Electron ou Tauri (desktop)';
    } else if (tipos.includes('Mobile')) {
        final.frontend = 'React Native / Flutter (mobile)';
    } else if (dados.frontend) {
        final.frontend = dados.frontend;
    } else {
        final.frontend = 'Next.js / React';
    }

    // Backend
    final.backend = dados.backend || 'NestJS (recomendado)';

    // Banco
    if (dados.usa_banco === 'sim' || includes(servicos, 'neon') || includes(servicos, 'supabase')) {
        if (includes(servicos, 'neon')) final.banco = 'Postgres (Neon)';
        else if (includes(servicos, 'supabase')) final.banco = 'Postgres (Supabase)';
        else if (dados.banco) final.banco = dados.banco;
        else final.banco = 'Postgres (recomendado)';

        // Vector DB — apenas se IA ativa E vetores selecionados
        const iaAtiva = dados.ia && dados.ia !== 'nao' && dados.ia !== '';
        if (iaAtiva && tiposDados.includes('vetores')) {
            final.banco += ' + pgvector';
        }
    } else {
        final.banco = dados.usa_banco === 'nao' ? 'Não exige banco relacional' : '-';
    }

    // Auth
    if (dados.login === 'sim') {
        if (dados.auth) final.auth = dados.auth;
        else if (includes(servicos, 'supabase')) final.auth = 'Supabase Auth (JWT)';
        else final.auth = 'JWT / OAuth2 (Auth0, Clerk)';
    } else {
        final.auth = 'Sem autenticação';
    }

    // Storage — apenas se usuario explicitamente quer ou tem dados de midia
    const needsStorage = tiposDados.includes('imagens') || tiposDados.includes('videos') || tiposDados.includes('arquivos');
    const storageOrigin = getOrigin('storage', dados);
    if (storageOrigin === 'manual' && dados.storage) {
        final.storage = dados.storage;
    } else if (needsStorage) {
        final.storage = includes(servicos, 'supabase') ? 'Supabase Storage' : 'MinIO / Cloud Storage';
    } else if (dados.storage && dados.storage !== 'nao') {
        final.storage = dados.storage;
    } else {
        final.storage = '-';
    }

    // IA
    if (dados.ia && dados.ia !== 'nao' && dados.ia !== '') {
        final.ia = dados.ia === 'sim_local' ? 'Sim (inference local/edge)' : 'Sim (APIs de IA na nuvem)';
    } else {
        final.ia = 'Não';
    }

    // Workers & Filas — ativado APENAS se paralelo OU distribuido
    if (dados.paralelo === 'paralelo' || dados.paralelo === 'distribuido') {
        final.workers = 'Workers paralelos necessários';
        final.filas = dados.fila_mensagens === 'sim' ? 'Redis / RabbitMQ' : '-';
    } else if (dados.fila_mensagens === 'sim') {
        final.workers = '-';
        final.filas = 'Redis / RabbitMQ';
    } else {
        final.workers = '-';
        final.filas = '-';
    }

    // Logs & Monitoramento
    final.logs = (dados.auditoria === 'sim' || dados.monitoramento) ? 'Centralizado (Sentry + provider logs)' : '-';
    final.monitoramento = dados.monitoramento || dados.auditoria === 'sim' ? 'Prometheus + Grafana (métricas) e Sentry (erros)' : '-';

    // Backup
    const backupOrigin = getOrigin('backup', dados);
    if (backupOrigin === 'manual' || backupOrigin === 'nlp') {
        final.backup = 'Backups automáticos (snapshots via provider)';
    } else if (dados.backup === 'sim') {
        final.backup = 'Backups automáticos (snapshots via provider)';
    } else {
        final.backup = 'Nenhum backup automático configurado';
    }

    // Segurança
    const seg = [];
    if (dados.login === 'sim') seg.push('Autenticação');
    if (dados.mfa === 'sim') seg.push('MFA');
    if (dados.criptografia === 'sim') seg.push('Criptografia-at-rest/in-transit');
    if (dados.lgpd === 'sim') seg.push('LGPD/GDPR');
    if (dados.rbac === 'sim') seg.push('RBAC');
    final.seguranca = seg.length ? seg.join(', ') : 'Básica';

    // Docker — apenas se explicitamente "sim"
    if (dados.docker === 'sim' || includes(servicos, 'docker')) {
        final.docker = 'Docker + Compose (recomendado)';
    } else {
        final.docker = 'Opcional (Docker recomendado)';
    }

    // Cloud — prioridade: ambiente > servicos
    if (dados.ambiente === 'local' || dados.ambiente === 'proprio' || dados.ambiente === 'raspberry' || dados.ambiente === 'nas') {
        final.cloud = 'Infraestrutura local';
    } else if (dados.ambiente === 'vps') {
        final.cloud = 'VPS';
    } else if (dados.ambiente === 'cloud' || dados.ambiente === 'gratis' || dados.ambiente === 'hibrido') {
        final.cloud = 'Cloud pública (provedores gerenciados)';
    } else if (includes(servicos, 'supabase') || includes(servicos, 'neon') || includes(servicos, 'vercel')) {
        final.cloud = 'Cloud pública (provedores gerenciados)';
    } else {
        final.cloud = 'Híbrido / Gerenciado';
    }

    // Deploy
    if (includes(servicos, 'vercel')) {
        final.deploy = 'Vercel (frontend) + Render/Railway (backend)';
    } else if (dados.ambiente === 'cloud') {
        final.deploy = 'Deploy em cloud pública (Render/Railway/AWS/GCP)';
    } else if (dados.ambiente === 'local' || dados.ambiente === 'proprio' || dados.ambiente === 'raspberry' || dados.ambiente === 'nas') {
        final.deploy = 'Infra local/servidor próprio';
    } else if (dados.ambiente === 'vps') {
        final.deploy = 'VPS';
    } else {
        final.deploy = 'Deploy em provider gerenciado';
    }

    final.cicd = dados.cicd || 'GitHub Actions (CI) -> Deploy automático';
    final.infra_local = (dados.ambiente === 'local' || dados.ambiente === 'proprio') ? 'Servidor próprio / NAS' : '-';

    // Custos
    final.custos = 'Comece com free-tiers (Vercel, Supabase, Neon). Escalonamento aumenta custos conforme uso.';
    final.limites = 'Limites gratuitos variam por provedor — consulte docs. Monitore uso e configure alertas.';

    // Gargalos
    const garg = [];
    if (tiposDados.includes('imagens') || tiposDados.includes('videos')) garg.push('Storage e banda');
    if (dados.realtime === 'sim') garg.push('Conexões simultâneas / WebSocket scale');
    if (dados.ia && dados.ia !== 'nao' && dados.ia !== '') garg.push('CPU/GPU e custo de inferência');
    garg.push('Banco de dados (conexões, consultas pesadas)');
    final.gargalos = garg.join(', ');

    // Roadmap
    final.roadmap = '<ol><li>MVP com serviços gerenciados (Vercel + Supabase + Railway/Render)</li><li>Redis para cache se necessário</li><li>Escalonar DB e separar serviços críticos</li><li>Observabilidade, testes e hardening de segurança</li></ol>';

    // Estrutura de pastas
    final.pastas = `<pre>src/
  frontend/
  backend/
  infra/
  scripts/
  docs/
  tests/
</pre>`;

    // DevOps
    final.devops = '<ul><li>CI: GitHub Actions (unit + e2e)</li><li>CD: deploy automatizado para staging/prod</li><li>Backup/monitoring/alertas</li></ul>';

    // Recomendação final
    final.recomendacao = `Comece com ${final.frontend} + ${final.backend} + ${final.banco}. Use serviços gerenciados para reduzir tempo de infra.`;

    // Fluxo
    final.fluxo = (() => {
        const parts = [];
        parts.push(`${final.frontend} (UI)`);
        if (final.backend && final.backend !== '-') parts.push(`${final.backend} (API)`);
        if (final.banco && final.banco !== '-') parts.push(`${final.banco}`);
        if (final.storage && final.storage !== '-') parts.push(`Storage: ${final.storage}`);
        if (final.workers && final.workers !== '-') parts.push(`Workers: ${final.workers}`);
        if (dados.realtime === 'sim') parts.push('Realtime: WebSocket/Streaming');
        return parts.join(' → ');
    })();

    // Arquitetura curta
    final.arquitetura = `Frontend: ${final.frontend}; Backend: ${final.backend}; DB: ${final.banco}; Auth: ${final.auth}; Storage: ${final.storage}.`;

    return final;
}

export function renderSummary(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    const final = computeFinal(dados || {});
    const fullDados = Object.assign({}, dados || {}, final);
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Arquitetura Final do Sistema</h3>
            <p class="mb-4">Resumo completo e validado da arquitetura ideal para seu projeto.</p>
            <ol class="list-group list-group-numbered mb-4">
                <li class="list-group-item"><strong>Tipo real do sistema:</strong> ${tipoToString(dados.tipo)}</li>
                <li class="list-group-item"><strong>Resumo da aplicação:</strong> ${dados.resumo || '-'}</li>
                <li class="list-group-item"><strong>Nível de complexidade:</strong> ${final.escala || '-'}</li>
                <li class="list-group-item"><strong>Fluxo do sistema:</strong> ${final.fluxo || '-'}</li>
                <li class="list-group-item"><strong>Arquitetura completa:</strong> ${final.arquitetura || '-'}</li>
                <li class="list-group-item"><strong>Frontend:</strong> ${final.frontend || '-'}</li>
                <li class="list-group-item"><strong>Backend:</strong> ${final.backend || '-'}</li>
                <li class="list-group-item"><strong>Banco:</strong> ${final.banco || '-'}</li>
                <li class="list-group-item"><strong>Auth:</strong> ${final.auth || '-'}</li>
                <li class="list-group-item"><strong>Storage:</strong> ${final.storage || '-'}</li>
                <li class="list-group-item"><strong>IA:</strong> ${final.ia || '-'}</li>
                <li class="list-group-item"><strong>Workers:</strong> ${final.workers || '-'}</li>
                <li class="list-group-item"><strong>Filas:</strong> ${final.filas || '-'}</li>
                <li class="list-group-item"><strong>Logs:</strong> ${final.logs || '-'}</li>
                <li class="list-group-item"><strong>Monitoramento:</strong> ${final.monitoramento || '-'}</li>
                <li class="list-group-item"><strong>Backup:</strong> ${final.backup || '-'}</li>
                <li class="list-group-item"><strong>Segurança:</strong> ${final.seguranca || '-'}</li>
                <li class="list-group-item"><strong>Deploy:</strong> ${final.deploy || '-'}</li>
                <li class="list-group-item"><strong>Docker:</strong> ${final.docker || '-'}</li>
                <li class="list-group-item"><strong>CI/CD:</strong> ${final.cicd || '-'}</li>
                <li class="list-group-item"><strong>Cloud:</strong> ${final.cloud || '-'}</li>
                <li class="list-group-item"><strong>Custos:</strong> ${final.custos || '-'}</li>
                <li class="list-group-item"><strong>Limites gratuitos:</strong> ${final.limites || '-'}</li>
                <li class="list-group-item"><strong>Gargalos futuros:</strong> ${final.gargalos || '-'}</li>
                <li class="list-group-item"><strong>Roadmap de crescimento:</strong> ${final.roadmap || '-'}</li>
                <li class="list-group-item"><strong>Estrutura de pastas:</strong> ${final.pastas || '-'}</li>
                <li class="list-group-item"><strong>Recomendação final:</strong> ${final.recomendacao || '-'}</li>
            </ol>
            <div class="mb-3">
                <h5>Capacitação e dúvidas</h5>
                <div class="border rounded p-2 bg-light">${dados.duvida || 'Nenhuma dúvida registrada.'}</div>
            </div>
            <div class="alert alert-success mt-3">Consulte um arquiteto para validação final antes de ir para produção real.</div>
            <button class="btn btn-secondary" id="back">Voltar</button>
            <button class="btn btn-primary ms-2" id="layout">Ver Layout Visual</button>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./step8.js').then(m => m.renderStep8(dados));
    };
    document.getElementById('layout').onclick = () => {
        import('./layout.js').then(m => m.renderLayout(fullDados));
    };
}