import { normalizeTipo, mergeAndSaveDados, loadFunilDados, parseResumoAplicacao, nlpExtract } from '../assets/tipoHelper.js';
import { renderInferenceReview } from './inferenceReview.js?v=2';

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
                    <label class="form-label">Resumo da aplicação (opcional)</label>
                    <textarea class="form-control" name="resumo" rows="3" placeholder="Descreva em poucas linhas o objetivo e funcionalidades principais da aplicação (opcional)"></textarea>
                </div>
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
                <button type="button" class="btn btn-secondary me-2" id="back">Voltar</button>
                <button type="submit" class="btn btn-primary">Avançar</button>
            </form>
        </div>
    `;
    // prefill resumo if previously saved
    try {
        const saved = loadFunilDados();
        if (saved && saved.resumo) {
            const ta = document.querySelector('#escala-form textarea[name="resumo"]');
            if (ta) ta.value = saved.resumo;
        }
    } catch (e) {}
    document.getElementById('back').onclick = () => {
        import('./intro.js').then(m => m.renderStep1(tipoObj));
    };
    document.getElementById('escala-form').onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const resumoText = form.resumo && form.resumo.value ? form.resumo.value.trim() : '';

        // --- Original inferred data (legacy parseResumoAplicacao) ---
        const legacyInferred = parseResumoAplicacao(resumoText || '');
        // --- New NLP extractor for additional entities ---
        const nlpInferred = nlpExtract(resumoText || '');

        // Merge both inferrers, with legacy taking precedence for overlapping keys
        const inferred = { ...nlpInferred, ...legacyInferred };

        // --- Build original explicit data from form fields ---
        const originalData = {
            tipo: tipoObj,
            usuarios: form.usuarios.value.trim() || '',
            simultaneos: form.simultaneos.value.trim() || '',
            tipo_uso: form.tipo_uso.value,
            crescimento: form.crescimento.value,
            resumo: resumoText
        };

        // --- Merge with proper priority: explicit fields NEVER overwritten by inference ---
        // Fields that are explicitly set by the user in this form
        const explicitFormFields = ['usuarios', 'simultaneos', 'tipo_uso', 'crescimento'];
        const mergedData = { ...originalData };

        // Apply inference, but ONLY for fields NOT explicitly filled by the user
        for (const k of Object.keys(inferred)) {
            if (k === 'resumo') continue; // resumo is set explicitly
            if (explicitFormFields.includes(k)) {
                // Don't override form fields with inference
                continue;
            }
            // For 'tipo': merge inferred tipos with existing, don't replace
            if (k === 'tipo' && inferred.tipo) {
                const inferredArr = Array.isArray(inferred.tipo.values) ? inferred.tipo.values :
                    (Array.isArray(inferred.tipo) ? inferred.tipo : []);
                const baseArr = Array.isArray(originalData.tipo && originalData.tipo.values) ? originalData.tipo.values :
                    (Array.isArray(originalData.tipo) ? originalData.tipo : []);
                const combined = Array.from(new Set([...inferredArr, ...baseArr]));
                mergedData.tipo = { values: combined, primary: originalData.tipo.primary || (inferred.tipo.primary || null) };
                continue;
            }

            // For array fields (servicos, tipos_dados): merge unique, don't replace
            if (Array.isArray(inferred[k])) {
                const existing = Array.isArray(originalData[k]) ? originalData[k] : [];
                const merged = new Set([...existing, ...inferred[k]]);
                mergedData[k] = Array.from(merged);
                continue;
            }

            // Scalar fields: only apply if not already set
            if (mergedData[k] === undefined || mergedData[k] === null || mergedData[k] === '') {
                mergedData[k] = inferred[k];
            }
        }

        // Save merged data immediately
        try { mergeAndSaveDados(mergedData); } catch (e) {}

        // --- Show Inference Review UI if we have inferences and a description ---
        if (resumoText && Object.keys(inferred).length > 0) {
            // Ensure modal area exists
            let modalArea = document.getElementById('inference-modal-area');
            if (!modalArea) {
                modalArea = document.createElement('div');
                modalArea.id = 'inference-modal-area';
                document.body.appendChild(modalArea);
            }

            // Remove backdrop/overlay before rendering modal to avoid duplicates
            modalArea.innerHTML = '';

            const finalData = await renderInferenceReview(inferred, originalData, mergedData);

            // Save final reviewed data
            try { mergeAndSaveDados(finalData); } catch (e) {}

            // Navigate to next step
            import('./step3.js').then(m => m.renderStep3(finalData));
        } else {
            // No inference — proceed directly
            import('./step3.js').then(m => m.renderStep3(mergedData));
        }
    };
}