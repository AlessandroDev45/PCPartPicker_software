// step3.js - Etapa 3: Online, Offline e Sincronização
import { mergeAndSaveDados, loadFunilDados } from '../assets/tipoHelper.js';

export function renderStep3(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Conectividade e Sincronização</h3>
            <p>Como o sistema deve funcionar em relação à internet e sincronização de dados?</p>
            <form id="conect-form">
                <div class="mb-3">
                    <label class="form-label">Precisa de internet para funcionar?</label>
                    <select class="form-select" name="internet" required>
                        <option value="online">Sim, totalmente online</option>
                        <option value="offline">Não, funciona offline</option>
                        <option value="offline-first">Offline-first (sincroniza depois)</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Precisa de atualização em tempo real?</label>
                    <select class="form-select" name="realtime" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim, realtime (websocket/streaming)</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Acesso remoto ou edge computing?</label>
                    <select class="form-select" name="edge" required>
                        <option value="nao">Não</option>
                        <option value="acesso_remoto">Acesso remoto</option>
                        <option value="edge">Edge computing</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Avançar</button>
                <button type="button" class="btn btn-secondary ms-2" id="back">Voltar</button>
            </form>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        const stored = loadFunilDados();
        const tipoArg = (dados && dados.tipo) ? dados.tipo : (stored && stored.tipo) ? stored.tipo : null;
        import('./step2.js').then(m => m.renderStep2(tipoArg));
    };
    document.getElementById('conect-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const dados3 = {
            ...dados,
            internet: form.internet.value,
            realtime: form.realtime.value,
            edge: form.edge.value
        };
        try { mergeAndSaveDados(dados3); } catch (e) {}
        // Chama a próxima etapa: Dados e Banco
        import('./step4.js').then(m => m.renderStep4(dados3));
    };
}
