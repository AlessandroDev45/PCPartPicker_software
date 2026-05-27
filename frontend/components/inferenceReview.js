/*
 inferenceReview.js - UI Component for reviewing NLP-inferred fields
 Shows detected items with accept/edit/reject capabilities
 */

const INFERRED_FIELDS_META = [
    { key: 'tipo', label: 'Tipo(s) de aplicação', type: 'tags' },
    { key: 'backend', label: 'Backend', type: 'text' },
    { key: 'frontend', label: 'Frontend', type: 'text' },
    { key: 'banco', label: 'Banco de dados', type: 'text' },
    { key: 'auth', label: 'Autenticação', type: 'text' },
    { key: 'servicos', label: 'Serviços detectados', type: 'tags' },
    { key: 'realtime', label: 'Tempo real', type: 'boolean' },
    { key: 'automacoes', label: 'Automações/Workers', type: 'boolean' },
    { key: 'ia', label: 'IA / Machine Learning', type: 'text' },
    { key: 'storage', label: 'Armazenamento', type: 'text' },
    { key: 'docker', label: 'Docker', type: 'text' },
    { key: 'kubernetes', label: 'Kubernetes', type: 'text' },
    { key: 'cicd', label: 'CI/CD', type: 'text' },
    { key: 'backup', label: 'Backup', type: 'boolean' },
    { key: 'monitoramento', label: 'Monitoramento', type: 'text' },
    { key: 'logs', label: 'Logs', type: 'text' },
    { key: 'internet', label: 'Conectividade', type: 'text' },
    { key: 'ambiente', label: 'Ambiente', type: 'text' },
    { key: 'cloud', label: 'Cloud', type: 'text' },
    { key: 'crescimento', label: 'Crescimento', type: 'text' },
    { key: 'tipo_uso', label: 'Tipo de uso', type: 'text' },
    { key: 'usuarios', label: 'Usuários', type: 'text' },
    { key: 'simultaneos', label: 'Simultâneos', type: 'text' },
    { key: 'orcamento', label: 'Orçamento estimado', type: 'text' },
    { key: 'sla', label: 'SLA / Uptime', type: 'text' },
    { key: 'tempo_resposta', label: 'Tempo de resposta', type: 'text' },
    { key: 'transacoes', label: 'Transações estimadas', type: 'text' },
];

/**
 * Renders a modal/dialog to review all inferred fields.
 * Returns a Promise that resolves with the final reviewed data object.
 *
 * @param {Object} inferredData - The data inferred from NLP
 * @param {Object} originalData - The user's original/explicit data
 * @param {Object} mergedData - The combined data (for context)
 * @returns {Promise<Object>} - Resolves with the user-approved final data
 */
export function renderInferenceReview(inferredData, originalData, mergedData) {
    return new Promise((resolve) => {
        const app = document.getElementById('inference-modal-area');
        if (!app) {
            // If no modal area, resolve directly with merged data
            resolve(mergedData);
            return;
        }

        // Filter to only fields that were actually inferred
        const inferredEntries = INFERRED_FIELDS_META
            .filter(meta => inferredData[meta.key] !== undefined && inferredData[meta.key] !== null)
            .map(meta => ({
                ...meta,
                inferredValue: inferredData[meta.key],
                originalValue: originalData[meta.key],
                accepted: true,
                editedValue: null
            }));

        if (inferredEntries.length === 0) {
            resolve(mergedData);
            return;
        }

        app.innerHTML = `
            <div class="modal-backdrop fade show" style="z-index:1055"></div>
            <div class="modal fade show d-block" tabindex="-1" role="dialog" style="z-index:1060">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <span class="me-2">🔍</span> Inferências Detectadas
                            </h5>
                            <div class="ms-auto">
                                <span class="badge bg-light text-dark me-2" id="accepted-count">${inferredEntries.length} detectado(s)</span>
                            </div>
                        </div>
                        <div class="modal-body">
                            <p class="text-muted mb-3">
                                Analisamos automaticamente sua descrição e identificamos alguns campos.
                                <strong>Revise cada item abaixo</strong> — aceite, edite ou rejeite antes de continuar.
                            </p>
                            <div id="inference-items" class="mb-3">
                                ${inferredEntries.map((entry, idx) => renderInferenceItem(entry, idx)).join('')}
                            </div>
                            <div class="alert alert-info mb-0">
                                <small>
                                    <strong>💡 Dica:</strong> Itens que você já preencheu manualmente não serão sobrescritos.
                                    Se a inferência detectou algo que você já havia escolhido, ele aparecerá como já aceito.
                                </small>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" id="inference-reject-all">
                                Rejeitar Todas
                            </button>
                            <button type="button" class="btn btn-outline-primary" id="inference-accept-all">
                                Aceitar Todas
                            </button>
                            <button type="button" class="btn btn-primary" id="inference-confirm">
                                Confirmar Selecionadas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Build a reactive state
        const itemsState = inferredEntries.map((entry, idx) => {
            return {
                ...entry,
                idx,
                accepted: true,
                editedValue: null
            };
        });

        function updateCounts() {
            const countAccepted = itemsState.filter(s => s.accepted).length;
            const badge = document.getElementById('accepted-count');
            if (badge) badge.textContent = `${countAccepted} aceito(s) de ${itemsState.length}`;
        }

        function getItemState(item) {
            // Returns the final value for this item (edited or original)
            if (!item.accepted) return undefined;
            return item.editedValue !== null ? item.editedValue : item.inferredValue;
        }

        // Individual item interactions
        itemsState.forEach((state) => {
            const itemEl = document.querySelector(`[data-inference-idx="${state.idx}"]`);
            if (!itemEl) return;

            const toggleBtn = itemEl.querySelector('.inference-toggle');
            const editBtn = itemEl.querySelector('.inference-edit');
            const editArea = itemEl.querySelector('.inference-edit-area');
            const editInput = itemEl.querySelector('.inference-edit-input');
            const valueDisplay = itemEl.querySelector('.inference-value');
            const editConfirmBtn = itemEl.querySelector('.inference-edit-confirm');
            const editCancelBtn = itemEl.querySelector('.inference-edit-cancel');

            // Toggle accept/reject
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    state.accepted = !state.accepted;
                    itemEl.classList.toggle('inference-rejected', !state.accepted);
                    const icon = toggleBtn.querySelector('.toggle-icon');
                    if (icon) icon.textContent = state.accepted ? '✅' : '❌';
                    toggleBtn.title = state.accepted ? 'Clique para rejeitar' : 'Clique para aceitar';
                    updateCounts();
                });
            }

            // Edit value
            if (editBtn && editArea && editInput) {
                editBtn.addEventListener('click', () => {
                    if (!state.accepted) return;
                    editArea.style.display = 'block';
                    editInput.value = state.editedValue !== null ? state.editedValue :
                        (Array.isArray(state.inferredValue) ? state.inferredValue.join(', ') : String(state.inferredValue));
                    editInput.focus();
                });
                if (editConfirmBtn) {
                    editConfirmBtn.addEventListener('click', () => {
                        const val = editInput.value.trim();
                        if (val) {
                            // Try to parse if original was array
                            if (Array.isArray(state.inferredValue)) {
                                state.editedValue = val.split(',').map(s => s.trim()).filter(Boolean);
                            } else {
                                state.editedValue = val;
                            }
                            if (valueDisplay) {
                                valueDisplay.textContent = Array.isArray(state.editedValue) ?
                                    state.editedValue.join(', ') : state.editedValue;
                                valueDisplay.classList.add('text-primary', 'fw-bold');
                            }
                        }
                        editArea.style.display = 'none';
                    });
                }
                if (editCancelBtn) {
                    editCancelBtn.addEventListener('click', () => {
                        editArea.style.display = 'none';
                    });
                }
            }
        });

        // Batch actions
        document.getElementById('inference-accept-all')?.addEventListener('click', () => {
            itemsState.forEach(s => { s.accepted = true; });
            document.querySelectorAll('.inference-item').forEach(el => el.classList.remove('inference-rejected'));
            document.querySelectorAll('.inference-toggle .toggle-icon').forEach(icon => icon.textContent = '✅');
            updateCounts();
        });

        document.getElementById('inference-reject-all')?.addEventListener('click', () => {
            itemsState.forEach(s => { s.accepted = false; });
            document.querySelectorAll('.inference-item').forEach(el => el.classList.add('inference-rejected'));
            document.querySelectorAll('.inference-toggle .toggle-icon').forEach(icon => icon.textContent = '❌');
            updateCounts();
        });

        // Confirm and build final data
        document.getElementById('inference-confirm')?.addEventListener('click', () => {
            // Build final data from original + accepted inferred items
            const finalData = { ...originalData };

            itemsState.forEach(state => {
                const val = getItemState(state);
                if (val === undefined) return;

                // Special handling for 'tipo' object: merge values, don't replace
                if (state.key === 'tipo' && val && typeof val === 'object') {
                    const inferredArr = Array.isArray(val.values) ? val.values :
                        (Array.isArray(val) ? val : []);
                    const baseArr = Array.isArray(finalData.tipo && finalData.tipo.values) ? finalData.tipo.values :
                        (Array.isArray(finalData.tipo) ? finalData.tipo : []);
                    const combined = Array.from(new Set([...baseArr, ...inferredArr]));
                    finalData.tipo = {
                        values: combined,
                        primary: (finalData.tipo && finalData.tipo.primary) || (val.primary || null)
                    };
                    return;
                }

                // For arrays (like servicos, tipos_dados), merge unique
                if (Array.isArray(finalData[state.key]) && Array.isArray(val)) {
                    const merged = new Set([...finalData[state.key], ...val]);
                    finalData[state.key] = Array.from(merged);
                } else if (Array.isArray(finalData[state.key]) && !Array.isArray(val)) {
                    // scalar to array field - replace
                    finalData[state.key] = val;
                } else {
                    finalData[state.key] = val;
                }
            });

            // Clean up modal
            app.innerHTML = '';
            resolve(finalData);
        });
    });
}

/**
 * Converts an inferred value to a human-readable display string.
 * Handles objects (e.g. tipo = { values: [...], primary: ... }),
 * arrays, booleans, and scalars.
 */
function displayValue(val) {
    if (val === null || val === undefined) return '-';
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object') {
        // e.g. { values: ['Web App', 'Mobile'], primary: 'Web App' }
        if (Array.isArray(val.values)) {
            const base = val.values.join(', ');
            return val.primary ? `${base} (primário: ${val.primary})` : base;
        }
        return JSON.stringify(val);
    }
    return String(val);
}

/**
 * Renders a single inference review item card
 */
function renderInferenceItem(entry, idx) {
    const val = entry.inferredValue;
    const valDisplay = displayValue(val);
    const originalDisplay = entry.originalValue !== undefined ? displayValue(entry.originalValue) : null;

    return `
        <div class="card inference-item mb-2" data-inference-idx="${idx}" style="border-left: 4px solid #0d6efd;">
            <div class="card-body py-2 px-3">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm inference-toggle" title="Clique para rejeitar" style="padding:0;border:none;background:none;">
                            <span class="toggle-icon" style="font-size:1.2rem;">✅</span>
                        </button>
                        <strong class="me-2">${entry.label}:</strong>
                        <span class="inference-value badge bg-light text-dark">${valDisplay}</span>
                        ${originalDisplay ? `<small class="text-muted ms-2">(antes: ${originalDisplay})</small>` : ''}
                    </div>
                    <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-secondary inference-edit" title="Editar valor">
                            ✏️
                        </button>
                    </div>
                </div>
                <div class="inference-edit-area mt-2" style="display:none;">
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control inference-edit-input" placeholder="Editar valor...">
                        <button class="btn btn-sm btn-primary inference-edit-confirm">OK</button>
                        <button class="btn btn-sm btn-outline-secondary inference-edit-cancel">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Inject minimal CSS once
(function injectStyles() {
    if (document.getElementById('inference-review-styles')) return;
    const style = document.createElement('style');
    style.id = 'inference-review-styles';
    style.textContent = `
        .inference-item.inference-rejected {
            border-left-color: #dc3545 !important;
            opacity: 0.65;
        }
        .inference-item.inference-rejected .inference-edit {
            pointer-events: none;
            opacity: 0.4;
        }
        .inference-item .inference-edit:hover {
            background-color: #e9ecef;
        }
        @keyframes inference-pulse {
            0% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(13, 110, 253, 0); }
            100% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0); }
        }
        .inference-item[data-new="true"] {
            animation: inference-pulse 1.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);
})();