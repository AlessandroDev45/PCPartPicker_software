import { normalizeTipo, mergeAndSaveDados } from '../assets/tipoHelper.js';

// step2.js - Etapa 2: Entender a escala
export function renderStep2(tipoSelecionado) {
    const tipoObj = normalizeTipo(tipoSelecionado);
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Escala e Uso Esperado</h3>
            <p>Para projetar a arquitetura ideal, precisamos entender o tamanho e o uso do sistema.</p>
            <div class="mb-3"><strong>Tipo(s) selecionado(s):</strong> ${tipoObj.values.join(', ')}${tipoObj.primary ? ' (primário: '+tipoObj.primary+')' : ''}</div>
            <form id="escala-form">
                <div class="mb-3">
                    <label class="form-label">Quantos usuários totais espera?</label>
                    <input type="number" class="form-control" name="usuarios" min="1" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Quantos simultâneos?</label>
                    <input type="number" class="form-control" name="simultaneos" min="1" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">O sistema é:</label>
                    <select class="form-select" name="tipo_uso" required>
                        <option value="interno">Interno</option>
                        <option value="comercial">Comercial</option>
                        <option value="pequena_empresa">Pequena Empresa</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="multiempresa">Multiempresa</option>
                        <option value="multiusuario">Multiusuário</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Crescimento esperado em 1 ano?</label>
                    <select class="form-select" name="crescimento" required>
                        <option value="baixo">Baixo</option>
                        <option value="medio">Médio</option>
                        <option value="alto">Alto (crescimento rápido)</option>
                        <option value="explosivo">Explosivo</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Avançar</button>
                <button type="button" class="btn btn-secondary ms-2" id="back">Voltar</button>
            </form>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./intro.js').then(m => m.renderStep1(tipoObj));
    };
    document.getElementById('escala-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const dados = {
            tipo: tipoObj,
            usuarios: form.usuarios.value,
            simultaneos: form.simultaneos.value,
            tipo_uso: form.tipo_uso.value,
            crescimento: form.crescimento.value
        };
        // Aqui você pode salvar os dados ou passar para a próxima etapa
        try { mergeAndSaveDados(dados); } catch (e) {}
        import('./step3.js').then(m => m.renderStep3(dados));
    };
}
