// summary.js - Arquitetura Final
import { tipoToString } from '../assets/tipoHelper.js';

export function renderSummary(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Arquitetura Final do Sistema</h3>
            <p class="mb-4">Resumo completo e validado da arquitetura ideal para seu projeto, incluindo recomendações, custos, limites gratuitos, gargalos e roadmap de crescimento.</p>
            <ol class="list-group list-group-numbered mb-4">
                <li class="list-group-item"><strong>Tipo real do sistema:</strong> ${tipoToString(dados.tipo)}</li>
                <li class="list-group-item"><strong>Nível de complexidade:</strong> ${dados.escala || '-'}</li>
                <li class="list-group-item"><strong>Escalabilidade:</strong> ${dados.escalabilidade || '-'}</li>
                <li class="list-group-item"><strong>Fluxo do sistema:</strong> ${dados.fluxo || '-'}</li>
                <li class="list-group-item"><strong>Arquitetura completa:</strong> ${dados.arquitetura || '-'}</li>
                <li class="list-group-item"><strong>Frontend:</strong> ${dados.frontend || '-'}</li>
                <li class="list-group-item"><strong>Backend:</strong> ${dados.backend || '-'}</li>
                <li class="list-group-item"><strong>Banco:</strong> ${dados.banco || '-'}</li>
                <li class="list-group-item"><strong>Auth:</strong> ${dados.auth || '-'}</li>
                <li class="list-group-item"><strong>Storage:</strong> ${dados.storage || '-'}</li>
                <li class="list-group-item"><strong>IA:</strong> ${dados.ia || '-'}</li>
                <li class="list-group-item"><strong>Workers:</strong> ${dados.workers || '-'}</li>
                <li class="list-group-item"><strong>Filas:</strong> ${dados.filas || '-'}</li>
                <li class="list-group-item"><strong>Logs:</strong> ${dados.logs || '-'}</li>
                <li class="list-group-item"><strong>Monitoramento:</strong> ${dados.monitoramento || '-'}</li>
                <li class="list-group-item"><strong>Backup:</strong> ${dados.backup || '-'}</li>
                <li class="list-group-item"><strong>Segurança:</strong> ${dados.seguranca || '-'}</li>
                <li class="list-group-item"><strong>Deploy:</strong> ${dados.deploy || '-'}</li>
                <li class="list-group-item"><strong>Docker:</strong> ${dados.docker || '-'}</li>
                <li class="list-group-item"><strong>CI/CD:</strong> ${dados.cicd || '-'}</li>
                <li class="list-group-item"><strong>Cloud:</strong> ${dados.cloud || '-'}</li>
                <li class="list-group-item"><strong>Infra local:</strong> ${dados.infra_local || '-'}</li>
                <li class="list-group-item"><strong>Custos:</strong> ${dados.custos || '-'}</li>
                <li class="list-group-item"><strong>Limites gratuitos:</strong> ${dados.limites || '-'}</li>
                <li class="list-group-item"><strong>Gargalos futuros:</strong> ${dados.gargalos || '-'}</li>
                <li class="list-group-item"><strong>Roadmap de crescimento:</strong> ${dados.roadmap || '-'}</li>
                <li class="list-group-item"><strong>Estrutura de pastas:</strong> ${dados.pastas || '-'}</li>
                <li class="list-group-item"><strong>Fluxo DevOps:</strong> ${dados.devops || '-'}</li>
                <li class="list-group-item"><strong>Recomendação final:</strong> ${dados.recomendacao || '-'}</li>
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
        import('./layout.js').then(m => m.renderLayout(dados));
    };
}
