// step4.js - Etapa 4: Dados e Banco
import { mergeAndSaveDados } from '../assets/tipoHelper.js';

export function renderStep4(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Dados e Banco de Dados</h3>
            <p>Quais tipos de dados o sistema irá manipular e como devem ser armazenados?</p>
            <form id="dados-form">
                <div class="mb-3">
                    <label class="form-label">O sistema precisa de banco de dados?</label>
                    <select class="form-select" name="usa_banco" required>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Quais tipos de dados?</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="tipos_dados" value="imagens" id="imagens">
                        <label class="form-check-label" for="imagens">Imagens</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="tipos_dados" value="videos" id="videos">
                        <label class="form-check-label" for="videos">Vídeos</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="tipos_dados" value="arquivos" id="arquivos">
                        <label class="form-check-label" for="arquivos">Arquivos</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="tipos_dados" value="logs" id="logs">
                        <label class="form-check-label" for="logs">Logs</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="tipos_dados" value="ia" id="ia">
                        <label class="form-check-label" for="ia">IA</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="tipos_dados" value="vetores" id="vetores">
                        <label class="form-check-label" for="vetores">Vetores (IA/embeddings)</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="tipos_dados" value="telemetria" id="telemetria">
                        <label class="form-check-label" for="telemetria">Telemetria</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="tipos_dados" value="historico" id="historico">
                        <label class="form-check-label" for="historico">Histórico</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="tipos_dados" value="industriais" id="industriais">
                        <label class="form-check-label" for="industriais">Arquivos industriais</label>
                    </div>
                </div>
                <button type="button" class="btn btn-secondary me-2" id="back">Voltar</button>
                <button type="submit" class="btn btn-primary">Avançar</button>
            </form>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./step3.js').then(m => m.renderStep3(dados));
    };
    document.getElementById('dados-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const tiposSelecionados = Array.from(form.querySelectorAll('input[name="tipos_dados"]:checked')).map(cb => cb.value);
        const dados4 = {
            ...dados,
            usa_banco: form.usa_banco.value,
            tipos_dados: tiposSelecionados
        };
        try { mergeAndSaveDados(dados4); } catch (e) {}
        // Chama a próxima etapa: Processamento
        import('./step5.js').then(m => m.renderStep5(dados4));
    };
}
