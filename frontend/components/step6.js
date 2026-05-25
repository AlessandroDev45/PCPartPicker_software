// step6.js - Etapa 6: Infraestrutura
import { mergeAndSaveDados } from '../assets/tipoHelper.js';

export function renderStep6(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Infraestrutura e Ambiente</h3>
            <p>Onde o sistema será hospedado e como será a infraestrutura?</p>
            <form id="infra-form">
                <div class="mb-3">
                    <label class="form-label">Preferência de ambiente?</label>
                    <select class="form-select" name="ambiente" required>
                        <option value="gratis">Quero tudo grátis</option>
                        <option value="vps">Aceito VPS</option>
                        <option value="cloud">Cloud pública</option>
                        <option value="local">Infraestrutura local</option>
                        <option value="hibrido">Híbrido</option>
                        <option value="raspberry">Raspberry/Orange Pi</option>
                        <option value="nas">NAS</option>
                        <option value="proprio">Servidor próprio/PC gamer</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Serviços desejados:</label>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="servicos" value="vercel" id="vercel">
                        <label class="form-check-label" for="vercel">Vercel (frontend moderno)</label>
                        <div class="form-text text-muted">Plataforma ótima para sites e frontends modernos (Next.js), com deploys automáticos, previews e CDN integrado.</div>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="servicos" value="supabase" id="supabase">
                        <label class="form-check-label" for="supabase">Supabase (Postgres, Auth, Storage, Realtime)</label>
                        <div class="form-text text-muted">BaaS construído sobre Postgres com autenticação, storage e APIs em tempo real — ideal para protótipos e apps full-stack.</div>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="servicos" value="neon" id="neon">
                        <label class="form-check-label" for="neon">Neon (Postgres serverless)</label>
                        <div class="form-text text-muted">Postgres serverless gerenciado, escalonamento por demanda e cobrança por uso — compatível com workloads SQL.</div>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="servicos" value="railway" id="railway">
                        <label class="form-check-label" for="railway">Railway (backend simples)</label>
                        <div class="form-text text-muted">PaaS simples para deploy rápido de serviços e bancos — facilidade semelhante ao Heroku para pequenos projetos.</div>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="servicos" value="render" id="render">
                        <label class="form-check-label" for="render">Render (containers cloud)</label>
                        <div class="form-text text-muted">Hospedagem para containers e serviços com suporte a web services, workers e bancos gerenciados.</div>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="servicos" value="cloudflare" id="cloudflare">
                        <label class="form-check-label" for="cloudflare">Cloudflare (DNS, CDN, Tunnel)</label>
                        <div class="form-text text-muted">Rede global para DNS e CDN, com recursos de borda (Workers), segurança e túneis para acesso seguro.</div>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="servicos" value="docker" id="docker">
                        <label class="form-check-label" for="docker">Docker/Docker Compose</label>
                        <div class="form-text text-muted">Containerização e orquestração local; <code>docker-compose</code> facilita ambientes multi-containers durante desenvolvimento.</div>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="servicos" value="kubernetes" id="kubernetes">
                        <label class="form-check-label" for="kubernetes">Kubernetes</label>
                        <div class="form-text text-muted">Orquestração de containers para produção em larga escala — deploys, autoscaling e resiliência, porém com complexidade operacional.</div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Avançar</button>
                <button type="button" class="btn btn-secondary ms-2" id="back">Voltar</button>
            </form>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./step5.js').then(m => m.renderStep5(dados));
    };
    document.getElementById('infra-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const servicosSelecionados = Array.from(form.querySelectorAll('input[name="servicos"]:checked')).map(cb => cb.value);
        const dados6 = {
            ...dados,
            ambiente: form.ambiente.value,
            servicos: servicosSelecionados
        };
        try { mergeAndSaveDados(dados6); } catch (e) {}
        // Chama a próxima etapa: Segurança
        import('./step7.js').then(m => m.renderStep7(dados6));
    };
}
