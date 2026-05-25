// htmlfull.js - Protótipo HTML completo do sistema
export function renderHtmlFull(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="container-fluid p-0">
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="#">${dados.nomeProjeto || 'Sistema Profissional'}</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item"><a class="nav-link active" href="#">Dashboard</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Usuários</a></li>
                            <li class="nav-item"><a class="nav-link" href="#">Configurações</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <main class="container my-5">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="card shadow-sm p-4 mb-4">
                            <h2 class="mb-3">Dashboard do Sistema</h2>
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card bg-light mb-3">
                                        <div class="card-body">
                                            <h5 class="card-title">Usuários Ativos</h5>
                                            <p class="card-text display-6">128</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card bg-light mb-3">
                                        <div class="card-body">
                                            <h5 class="card-title">Status do Backend</h5>
                                            <span class="badge bg-success">Online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h5>Últimas Ações</h5>
                            <ul class="list-group mb-4">
                                <li class="list-group-item">Novo usuário cadastrado</li>
                                <li class="list-group-item">Backup realizado</li>
                                <li class="list-group-item">Deploy atualizado</li>
                            </ul>
                            <button id="main-action-btn" class="btn btn-primary">Ação Principal</button>
                        </div>
                    </div>
                </div>
            </main>
            <!-- Modal para Ação Principal -->
            <div class="modal fade" id="mainActionModal" tabindex="-1" aria-labelledby="mainActionModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="mainActionModalLabel">Ação Principal</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">Processando...</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
            <footer class="bg-light text-center py-3 border-top">
                <small class="text-muted">&copy; ${new Date().getFullYear()} ${dados.nomeProjeto || 'Sistema Profissional'} | Arquitetura Premium</small>
            </footer>
            <button class="btn btn-secondary position-fixed bottom-0 end-0 m-4" id="back">Voltar</button>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./htmlcss.js').then(m => m.renderHtmlCss(dados));
    };
    // Ligar ação ao botão principal para demonstrar comportamento
    const mainBtn = document.getElementById('main-action-btn');
    if (mainBtn) {
        mainBtn.addEventListener('click', () => {
            const modalEl = document.getElementById('mainActionModal');
            if (modalEl && typeof bootstrap !== 'undefined') {
                const body = modalEl.querySelector('.modal-body');
                if (body) body.textContent = 'Ação principal executada — este é um placeholder.';
                const bsModal = new bootstrap.Modal(modalEl);
                bsModal.show();
            } else {
                alert('Ação principal executada — placeholder.');
            }
        });
    }
}
