// step7.js - Etapa 7: Segurança
export function renderStep7(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Segurança e Conformidade</h3>
            <p>Quais requisitos de segurança e conformidade o sistema deve atender?</p>
            <form id="seguranca-form">
                <div class="mb-3">
                    <label class="form-label">O sistema precisa de login/autenticação?</label>
                    <select class="form-select" name="login" required>
                        <option value="sim">Sim</option>
                        <option value="nao">Não</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Precisa de autenticação MFA (2 fatores)?</label>
                    <select class="form-select" name="mfa" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Auditoria e logs de acesso?</label>
                    <select class="form-select" name="auditoria" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Backup automático?</label>
                    <select class="form-select" name="backup" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Criptografia de dados?</label>
                    <select class="form-select" name="criptografia" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">LGPD/GDPR (proteção de dados)?</label>
                    <select class="form-select" name="lgpd" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Controle de permissões (RBAC)?</label>
                    <select class="form-select" name="rbac" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Isolamento de ambientes?</label>
                    <select class="form-select" name="isolamento" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Acesso remoto seguro?</label>
                    <select class="form-select" name="acesso_remoto" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Avançar</button>
                <button type="button" class="btn btn-secondary ms-2" id="back">Voltar</button>
            </form>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./step6.js?v=2').then(m => m.renderStep6(dados));
    };
    document.getElementById('seguranca-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const dados7 = {
            ...dados,
            login: form.login.value,
            mfa: form.mfa.value,
            auditoria: form.auditoria.value,
            backup: form.backup.value,
            criptografia: form.criptografia.value,
            lgpd: form.lgpd.value,
            rbac: form.rbac.value,
            isolamento: form.isolamento.value,
            acesso_remoto: form.acesso_remoto.value
        };
        // Chama a próxima etapa: Capacitação e Ajuda
        import('./step8.js').then(m => m.renderStep8(dados7));
    };
}
