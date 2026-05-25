// htmlcss.js - Etapa visual: HTML, CSS e Bootstrap
export function renderHtmlCss(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Layout HTML, CSS & Bootstrap</h3>
            <p class="mb-4">Veja como ficaria a estrutura visual do seu sistema, com exemplos de código HTML, CSS e uso de Bootstrap para prototipação rápida e responsiva.</p>
            <div class="row mb-4">
                <div class="col-md-6">
                    <h5>Exemplo de HTML (com Bootstrap)</h5>
                    <pre class="bg-light p-2 rounded"><code>&lt;div class="container"&gt;
  &lt;div class="row justify-content-center"&gt;
    &lt;div class="col-md-8"&gt;
      &lt;div class="card shadow-sm p-4 mb-4"&gt;
        &lt;h3 class="mb-3"&gt;Dashboard do Sistema&lt;/h3&gt;
        &lt;button class="btn btn-primary"&gt;Ação Principal&lt;/button&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
                </div>
                <div class="col-md-6">
                    <h5>Exemplo de CSS customizado</h5>
                    <pre class="bg-light p-2 rounded"><code>.card {
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.btn-primary {
  background: linear-gradient(90deg, #007bff 60%, #00c6ff 100%);
  border: none;
}</code></pre>
                </div>
            </div>
            <div class="mb-4">
                <h5>Preview Responsivo</h5>
                <div class="container border p-3 bg-white" style="max-width:600px;">
                    <div class="card shadow-sm p-4 mb-4">
                        <h3 class="mb-3">Dashboard do Sistema</h3>
                        <button class="btn btn-primary">Ação Principal</button>
                    </div>
                </div>
            </div>
            <button class="btn btn-secondary" id="back">Voltar</button>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./layout.js').then(m => m.renderLayout(dados));
    };
}
