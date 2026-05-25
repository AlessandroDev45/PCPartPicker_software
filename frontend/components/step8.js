// step8.js - Etapa 8: Capacitação e Ajuda
export function renderStep8(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Capacitação e Ajuda</h3>
            <p>Esta etapa é dedicada a explicar, ensinar e tirar dúvidas sobre as tecnologias e decisões arquiteturais sugeridas para o seu projeto.</p>
            <div class="alert alert-info">
                <strong>Você pode perguntar:</strong><br>
                - Por que usar Supabase?<br>
                - Quando Neon é melhor?<br>
                - Quando usar Redis?<br>
                - Docker realmente vale?<br>
                - Preciso Kubernetes?<br>
                - Vale usar local?<br>
                - Cloud ou edge?<br>
                - Qual gargalo futuro?<br>
                - Quanto escala?<br>
                - Quanto custa crescer?
            </div>
            <form id="ajuda-form">
                <div class="mb-3">
                    <label class="form-label">Tem alguma dúvida ou gostaria de uma explicação detalhada sobre alguma tecnologia ou decisão?</label>
                    <textarea class="form-control" name="duvida" rows="3" placeholder="Digite sua dúvida ou deixe em branco para avançar..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Avançar</button>
                <button type="button" class="btn btn-secondary ms-2" id="back">Voltar</button>
            </form>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./step7.js').then(m => m.renderStep7(dados));
    };
    document.getElementById('ajuda-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const dados8 = {
            ...dados,
            duvida: form.duvida.value
        };
        // Chama a próxima etapa: Arquitetura Final
        import('./summary.js').then(m => m.renderSummary(dados8));
    };
}
