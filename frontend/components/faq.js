// faq.js - Respostas automáticas para dúvidas frequentes
export function getFaqAnswer(pergunta) {
    const faqs = {
        'Por que usar Supabase?': 'Supabase oferece Postgres gerenciado, autenticação, storage e realtime com limites gratuitos generosos. Ideal para MVPs e projetos modernos.',
        'Quando Neon é melhor?': 'Neon é Postgres serverless, ideal para workloads variáveis e custos baixos em projetos que escalam sob demanda.',
        'Quando usar Redis?': 'Redis é excelente para cache, filas, sessões e realtime. Use quando precisar de alta performance e baixa latência.',
        'Docker realmente vale?': 'Docker padroniza ambientes, facilita deploy e CI/CD. Vale para times, microserviços e ambientes replicáveis.',
        'Preciso Kubernetes?': 'Kubernetes só vale para projetos enterprise, multi-serviços e que exigem escala automática. Para MVPs, use Docker Compose.',
        'Vale usar local?': 'Ambientes locais são bons para prototipação, mas limitam escalabilidade e acesso remoto.',
        'Cloud ou edge?': 'Cloud é padrão para escala global. Edge é útil para latência baixa e processamento próximo ao usuário.',
        'Qual gargalo futuro?': 'Gargalos comuns: banco subdimensionado, falta de cache, deploy manual, ausência de monitoramento.',
        'Quanto escala?': 'Depende da arquitetura. Serverless e containers escalam bem. Bancos tradicionais exigem sharding/replicação.',
        'Quanto custa crescer?': 'Crescimento em cloud pode ser barato no início, mas custos sobem com uso intenso. Use limites gratuitos e monitore.'
    };
    return faqs[pergunta] || 'Pergunta não encontrada. Consulte um arquiteto para análise personalizada.';
}
