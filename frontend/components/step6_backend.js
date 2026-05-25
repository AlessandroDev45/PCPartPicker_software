// step6_backend.js
// Etapa de Backend do Funil Técnico — Consultoria Premium

import { renderWithProgress } from '../assets/renderWithProgress.js';

const backendStacks = [
  {
    name: 'FastAPI',
    desc: 'Framework Python moderno, rápido, ideal para APIs e microserviços.',
    vantagens: [
      'Alto desempenho',
      'Tipagem forte',
      'Documentação automática',
      'Comunidade ativa',
      'Ótimo para IA e automação',
    ],
    desvantagens: [
      'Python pode ser mais lento que Node/Bun em alta escala',
      'Hospedagem gratuita limitada',
    ],
    exemplos: ['APIs REST, IA, automação, integrações'],
    riscos: ['Escalabilidade limitada em apps massivos sem tuning'],
    custo: 'Gratuito, fácil deploy em Railway/Render',
    escalabilidade: 'Boa para maioria dos projetos',
  },
  {
    name: 'NestJS',
    desc: 'Framework Node.js TypeScript, arquitetura modular, inspirado em Angular.',
    vantagens: [
      'Arquitetura enterprise',
      'TypeScript nativo',
      'Extensível',
      'Ótimo para times grandes',
    ],
    desvantagens: [
      'Curva de aprendizado',
      'Mais "boilerplate"',
    ],
    exemplos: ['APIs REST, GraphQL, microserviços'],
    riscos: ['Overengineering em projetos pequenos'],
    custo: 'Gratuito, fácil deploy em Railway/Render',
    escalabilidade: 'Excelente',
  },
  {
    name: 'Express',
    desc: 'Framework minimalista Node.js, flexível e popular.',
    vantagens: [
      'Simplicidade',
      'Grande comunidade',
      'Muitos exemplos',
    ],
    desvantagens: [
      'Pouca estrutura',
      'Menos seguro por padrão',
    ],
    exemplos: ['APIs simples, protótipos, MVPs'],
    riscos: ['Arquitetura bagunçada em projetos grandes'],
    custo: 'Gratuito',
    escalabilidade: 'Boa, depende da arquitetura',
  },
  {
    name: 'Bun',
    desc: 'Runtime ultrarrápido para JavaScript/TypeScript, ideal para APIs modernas.',
    vantagens: [
      'Performance altíssima',
      'Compatível com Node',
      'Deploy fácil',
    ],
    desvantagens: [
      'Ecossistema ainda novo',
      'Menos exemplos',
    ],
    exemplos: ['APIs modernas, microserviços'],
    riscos: ['Mudanças frequentes na plataforma'],
    custo: 'Gratuito',
    escalabilidade: 'Excelente para workloads modernos',
  },
];

export function renderStep6Backend(container, dados = {}) {
  if (!container) return;
  container.innerHTML = `
    <div class="card shadow p-4 mb-4">
      <h2 class="mb-3">Etapa 6 — Backend</h2>
      <p class="lead">Escolha e entenda o backend ideal para seu projeto. Clique em uma opção para selecioná-la; a recomendação é exibida por padrão.</p>
      <div class="row" id="backend-grid">
        ${backendStacks.map(stack => `
          <div class="col-md-6 mb-4">
            <div class="card h-100 backend-card" data-backend="${stack.name}" tabindex="0" role="button" aria-pressed="false">
              <div class="card-body">
                <h5 class="card-title">${stack.name}</h5>
                <p class="mb-2">${stack.desc}</p>
                <ul class="mb-0">
                  <li><b>Vantagens:</b> ${stack.vantagens.join(', ')}</li>
                  <li><b>Desvantagens:</b> ${stack.desvantagens.join(', ')}</li>
                  <li><b>Exemplos:</b> ${stack.exemplos.join(', ')}</li>
                  <li><b>Riscos:</b> ${stack.riscos.join(', ')}</li>
                </ul>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="mt-4 text-end">
        <button class="btn btn-primary" id="next-backend" disabled>Próxima Etapa</button>
      </div>
    </div>
  `;

  let selected = null;
  const grid = document.getElementById('backend-grid');
  const nextBtn = document.getElementById('next-backend');

  function updateSelection(newName, el) {
    // remove previous selection
    const prev = grid.querySelector('.backend-card.selected');
    if (prev) {
      prev.classList.remove('selected');
      prev.setAttribute('aria-pressed', 'false');
    }
    if (newName) {
      selected = newName;
      if (el) {
        el.classList.add('selected');
        el.setAttribute('aria-pressed', 'true');
      }
      if (nextBtn) nextBtn.disabled = false;
      // persist minimal backend selection into central funil:dados
      try { import('../assets/tipoHelper.js').then(h => h.mergeAndSaveDados({ backend: newName })); } catch(e){}
    } else {
      selected = null;
      if (nextBtn) nextBtn.disabled = true;
      try { import('../assets/tipoHelper.js').then(h => h.mergeAndSaveDados({ backend: null })); } catch(e){}
    }
  }

  // click and keyboard handlers
  grid.querySelectorAll('.backend-card').forEach(card => {
    card.addEventListener('click', (ev) => {
      const name = card.getAttribute('data-backend');
      updateSelection(name, card);
    });
    card.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        const name = card.getAttribute('data-backend');
        updateSelection(name, card);
      }
    });
  });

  // If dados already includes a backend, preselect
  if (dados && dados.backend) {
    const pre = grid.querySelector(`.backend-card[data-backend="${dados.backend}"]`);
    if (pre) updateSelection(dados.backend, pre);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const dadosComBackend = { ...dados, backend: selected };
      try { import('../assets/tipoHelper.js').then(h => h.mergeAndSaveDados(dadosComBackend)); } catch(e){}
      // Próxima etapa: Infraestrutura (step6.js)
      import('./step6.js').then(m => m.renderStep6(dadosComBackend || {}));
    });
  }
}
