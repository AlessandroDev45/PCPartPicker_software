// summary.js - Arquitetura Final
import { tipoToString } from '../assets/tipoHelper.js';

function includes(arr, v) {
    return Array.isArray(arr) && arr.indexOf(v) !== -1;
}

function computeFinal(dados = {}) {
    const final = {};
    const tipos = (dados.tipo && dados.tipo.values) ? dados.tipo.values : [];
    const servicos = Array.isArray(dados.servicos) ? dados.servicos : [];

    // Nível de complexidade (baseado em crescimento e tipos)
    if (dados.crescimento) {
        const map = { baixo: 'Baixo', medio: 'Médio', alto: 'Alto', explosivo: 'Muito alto' };
        final.escala = map[dados.crescimento] || dados.crescimento;
    } else if (dados.usuarios) {
        const u = parseInt(dados.usuarios, 10) || 0;
        final.escala = u < 1000 ? 'Baixo' : u < 10000 ? 'Médio' : 'Alto';
    } else {
        final.escala = '-';
    }

    // Frontend suggestion
    if (tipos.includes('Mobile')) final.frontend = 'React Native / Flutter (mobile)';
    else if (tipos.includes('Desktop')) final.frontend = 'Electron ou Tauri (desktop)';
    else final.frontend = includes(servicos, 'vercel') ? 'Next.js / React (Vercel)' : 'Next.js / React';

    // Backend
    final.backend = dados.backend || 'NestJS (recomendado para projetos TypeScript)';

    // Banco
    if (dados.usa_banco === 'sim' || includes(servicos, 'neon') || includes(servicos, 'supabase')) {
        if (includes(servicos, 'neon')) final.banco = 'Postgres (Neon)';
        else if (includes(servicos, 'supabase')) final.banco = 'Postgres (Supabase)';
        else final.banco = 'Postgres (recomendado)';
        // vector DB if IA/vetores
        if (Array.isArray(dados.tipos_dados) && dados.tipos_dados.includes('vetores')) final.banco += ' + Vector DB (Pinecone/Weaviate)';
    } else {
        final.banco = dados.usa_banco === 'nao' ? 'Não exige banco relacional' : '-';
    }

    // Auth
    final.auth = dados.login === 'sim' ? (includes(servicos, 'supabase') ? 'Supabase Auth (JWT)' : 'JWT / OAuth2 (Auth0, Clerk)') : 'Sem autenticação';

    // Storage
    const tiposDados = Array.isArray(dados.tipos_dados) ? dados.tipos_dados : [];
    if (tiposDados.includes('imagens') || tiposDados.includes('videos') || tiposDados.includes('arquivos')) {
        final.storage = includes(servicos, 'supabase') ? 'Supabase Storage (S3-compatible)' : 'S3 / MinIO / Cloud Storage';
    } else final.storage = '-';

    // IA
    if (dados.ia) {
        final.ia = dados.ia === 'nao' ? 'Não' : (dados.ia === 'sim_local' ? 'Sim (inference local/edge)' : 'Sim (APIs de IA na nuvem)');
    } else final.ia = 'Não';

    // Workers & Filas
    if (dados.automacoes === 'sim' || dados.paralelo === 'paralelo' || dados.paralelo === 'distribuido') {
        final.workers = final.backend && final.backend.toLowerCase().includes('fastapi') ? 'Celery / RQ + Redis/RabbitMQ' : 'BullMQ / Bee-Queue + Redis';
        final.filas = 'Redis (ou RabbitMQ se mensagens complexas)';
    } else {
        final.workers = '-';
        final.filas = '-';
    }

    // Logs & Monitoramento
    final.logs = 'Centralizado (Sentry + provider logs / ELK / Datadog)';
    final.monitoramento = 'Prometheus + Grafana (métricas) e Sentry (erros)';

    // Backup
    final.backup = dados.backup === 'sim' ? 'Backups automáticos (snapshots via provider)' : 'Nenhum backup automático configurado';

    // Segurança resumo
    const seg = [];
    if (dados.login === 'sim') seg.push('Autenticação');
    if (dados.mfa === 'sim') seg.push('MFA');
    if (dados.criptografia === 'sim') seg.push('Criptografia-at-rest/in-transit');
    if (dados.lgpd === 'sim') seg.push('LGPD/GDPR');
    if (dados.rbac === 'sim') seg.push('RBAC');
    final.seguranca = seg.length ? seg.join(', ') : 'Básica';

    // Deploy, Docker, CI/CD, Cloud
    final.docker = includes(servicos, 'docker') ? 'Docker + Compose (recomendado)' : 'Opcional (Docker recomendado)';
    final.deploy = includes(servicos, 'vercel') ? 'Vercel (frontend) + Render/Railway (backend)' : (dados.ambiente === 'cloud' ? 'Deploy em cloud pública (Render/Railway/AWS/GCP)' : (dados.ambiente === 'local' ? 'Infra local/servidor próprio' : 'Deploy em provider gerenciado'));
    final.cicd = 'GitHub Actions (CI) -> Deploy automático para staging/produção';
    final.cloud = (dados.ambiente === 'cloud' || includes(servicos, 'supabase') || includes(servicos, 'neon') || includes(servicos, 'vercel')) ? 'Cloud pública (provedores gerenciados)' : (dados.ambiente === 'local' ? 'Infra local' : 'Híbrido/gerenciado');
    final.infra_local = dados.ambiente === 'local' || dados.ambiente === 'proprio' ? 'Servidor próprio / NAS' : '-';

    // Custos e limites (genérico)
    final.custos = 'Comece com free-tiers (Vercel, Supabase, Neon). Escalonamento aumenta custos conforme uso; prever custos de DB, storage e workers.';
    final.limites = 'Limites gratuitos variam por provedor — consulte docs do Supabase/Neon/Vercel. Monitore uso e configure alertas.';

    // Gargalos
    const garg = [];
    if (tiposDados.includes('imagens') || tiposDados.includes('videos')) garg.push('Storage e banda');
    if (dados.realtime === 'sim') garg.push('Conexões simultâneas / WebSocket scale');
    if (dados.ia && dados.ia !== 'nao') garg.push('CPU/GPU e custo de inferência');
    garg.push('Banco de dados (conexões, consultas pesadas)');
    final.gargalos = garg.join(', ');

    // Roadmap
    final.roadmap = '<ol><li>MVP com serviços gerenciados (Vercel + Supabase + Railway/Render)</li><li>Adicionar Redis para filas e cache</li><li>Escalonar DB e separar serviços críticos</li><li>Observabilidade, testes e hardening de segurança</li></ol>';

    // Estrutura de pastas exemplo
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
    final.recomendacao = `Comece com ${final.frontend} + ${final.backend} + ${final.banco}. Use serviços gerenciados para reduzir tempo de infra. Adicione Redis/filas para automações e Prometheus+Sentry para observabilidade.`;

    // Fill simple summary fields
    final.fluxo = (() => {
        const parts = [];
        parts.push(`${final.frontend} (UI)`);
        parts.push(`${final.backend} (API)`);
        parts.push(`${final.banco}`);
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
    // merge computed values back to dados for layout consumption
    const fullDados = Object.assign({}, dados || {}, final);
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Arquitetura Final do Sistema</h3>
            <p class="mb-4">Resumo completo e validado da arquitetura ideal para seu projeto, incluindo recomendações, custos, limites gratuitos, gargalos e roadmap de crescimento.</p>
            <ol class="list-group list-group-numbered mb-4">
                <li class="list-group-item"><strong>Tipo real do sistema:</strong> ${tipoToString(dados.tipo)}</li>
                <li class="list-group-item"><strong>Nível de complexidade:</strong> ${final.escala || '-'}</li>
                <li class="list-group-item"><strong>Escalabilidade:</strong> ${final.escalabilidade || '-'} </li>
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
                <li class="list-group-item"><strong>Infra local:</strong> ${final.infra_local || '-'}</li>
                <li class="list-group-item"><strong>Custos:</strong> ${final.custos || '-'}</li>
                <li class="list-group-item"><strong>Limites gratuitos:</strong> ${final.limites || '-'}</li>
                <li class="list-group-item"><strong>Gargalos futuros:</strong> ${final.gargalos || '-'}</li>
                <li class="list-group-item"><strong>Roadmap de crescimento:</strong> ${final.roadmap || '-'}</li>
                <li class="list-group-item"><strong>Estrutura de pastas:</strong> ${final.pastas || '-'}</li>
                <li class="list-group-item"><strong>Fluxo DevOps:</strong> ${final.devops || '-'}</li>
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
