// step5.js - Etapa 5: Processamento
import { mergeAndSaveDados } from '../assets/tipoHelper.js';

export function renderStep5(dados) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <div class="card shadow-sm p-4 mb-4">
            <h3 class="mb-3">Processamento e Automação</h3>
            <p>Como o sistema irá processar dados? Responda cada pergunta separadamente.</p>
            <form id="proc-form">
                <div class="mb-3">
                    <label class="form-label">O sistema usará IA?</label>
                    <select class="form-select" name="ia" required>
                        <option value="nao">Não</option>
                        <option value="sim_local">Sim, modelo local/on-prem</option>
                        <option value="sim_cloud">Sim, API cloud (OpenAI, etc.)</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Precisa de processamento pesado (CPU/GPU)?</label>
                    <select class="form-select" name="cpu_gpu" required>
                        <option value="nao">Não</option>
                        <option value="cpu">Sim, CPU intensiva</option>
                        <option value="gpu">Sim, GPU (CUDA)</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Precisa executar tarefas agendadas (cron, jobs periódicos)?</label>
                    <select class="form-select" name="tarefas_agendadas" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Precisa de processamento paralelo ou distribuído (múltiplos workers simultâneos)?</label>
                    <select class="form-select" name="paralelo" required>
                        <option value="nao">Não</option>
                        <option value="paralelo">Sim, paralelo (múltiplos workers)</option>
                        <option value="distribuido">Sim, distribuído (escalonamento horizontal complexo)</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Precisa de fila de mensagens (Redis, RabbitMQ, Kafka) para comunicação entre serviços?</label>
                    <select class="form-select" name="fila_mensagens" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Precisa de atualização em tempo real (WebSocket, streaming)?</label>
                    <select class="form-select" name="realtime" required>
                        <option value="nao">Não</option>
                        <option value="sim">Sim</option>
                    </select>
                </div>
                <button type="button" class="btn btn-secondary me-2" id="back">Voltar</button>
                <button type="submit" class="btn btn-primary">Avançar</button>
            </form>
        </div>
    `;
    document.getElementById('back').onclick = () => {
        import('./step4.js').then(m => m.renderStep4(dados));
    };
    document.getElementById('proc-form').onsubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const dados5 = {
            ...dados,
            ia: form.ia.value,
            cpu_gpu: form.cpu_gpu.value,
            // automacoes = apenas tarefas agendadas, nao paralelo
            automacoes: form.tarefas_agendadas.value,
            paralelo: form.paralelo.value,
            fila_mensagens: form.fila_mensagens.value,
            realtime: form.realtime.value
        };
        try { mergeAndSaveDados(dados5); } catch (e) {}
        import('./step6_backend.js').then(m => m.renderStep6Backend(document.getElementById('app'), dados5));
    };
}