/*
 tipoHelper.js - helpers para normalizar e persistir o objeto `tipo`
 Credit: Alessandro Souza <aaswilel@gmail.com>
*/
export function normalizeTipo(input) {
    if (!input) return { values: [], primary: null };
    if (Array.isArray(input)) return { values: input.slice(), primary: null };
    if (typeof input === 'object') {
        if (Array.isArray(input.values)) return { values: input.values.slice(), primary: input.primary || null };
    }
    return { values: [String(input)], primary: null };
}

export function loadStoredTipos(key = 'funil:tipos') {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const obj = JSON.parse(raw);
        if (obj && Array.isArray(obj.values)) return { values: obj.values.slice(), primary: obj.primary || null };
        if (Array.isArray(obj)) return { values: obj.slice(), primary: null };
    } catch (e) {
        // ignore
    }
    return null;
}

export function saveStoredTipos(obj, key = 'funil:tipos') {
    try {
        let values = [];
        let primary = null;
        if (!obj) return;
        if (Array.isArray(obj)) values = obj.slice();
        else if (obj && Array.isArray(obj.values)) { values = obj.values.slice(); primary = obj.primary || null; }
        else values = [String(obj)];
        localStorage.setItem(key, JSON.stringify({ values, primary }));
    } catch (e) {
        // ignore
    }
}

export function tipoToString(input) {
    const t = normalizeTipo(input);
    const txt = t.values.join(', ');
    return txt ? (t.primary ? `${txt} (primário: ${t.primary})` : txt) : '-';
}

export function loadFunilDados(key = 'funil:dados') {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

export function saveFunilDados(obj, key = 'funil:dados') {
    try {
        if (!obj) return;
        localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
        // ignore
    }
}

export function mergeAndSaveDados(partial, key = 'funil:dados') {
    try {
        const cur = loadFunilDados(key) || {};
        const merged = Object.assign({}, cur, partial);
        saveFunilDados(merged, key);
        return merged;
    } catch (e) {
        try { saveFunilDados(partial, key); } catch (e2) {}
        return partial;
    }
}

export function parseResumoAplicacao(text) {
    if (!text || !String(text).trim()) return {};
    const t = String(text).toLowerCase();
    const partial = {};

    // detect tipos
    const tipoMap = [
        ['mobile', 'Mobile'],
        ['web app', 'Web App'],
        ['web', 'Web App'],
        ['desktop', 'Desktop'],
        ['pwa', 'PWA'],
        ['iot', 'IoT'],
        ['bot', 'Bot 24h'],
        ['api', 'API / Backend'],
        ['backend', 'API / Backend'],
        ['saas', 'SaaS'],
        ['automação', 'Automação'],
        ['automation', 'Automação'],
        ['data pipeline', 'Data Pipeline'],
        ['pipeline', 'Data Pipeline'],
        ['realtime', 'Realtime'],
        ['tempo real', 'Realtime'],
        ['dashboard', 'Dashboard'],
        ['admin', 'Admin'],
        ['ia', 'IA'],
        ['inteligência artificial', 'IA'],
        ['edge', 'Edge'],
        ['embedded', 'Embedded'],
        ['jogo', 'Jogo'],
        ['game', 'Jogo'],
        ['industrial', 'Sistema Industrial'],
        ['híbrido', 'Sistema Híbrido'],
        ['hibrido', 'Sistema Híbrido']
    ];
    const tiposFound = [];
    for (const [kw, label] of tipoMap) {
        if (t.indexOf(kw) !== -1 && tiposFound.indexOf(label) === -1) tiposFound.push(label);
    }
    if (tiposFound.length) partial.tipo = { values: tiposFound, primary: tiposFound[0] };

    // detect backend frameworks
    const backendMap = {
        'nestjs': 'NestJS',
        'fastapi': 'FastAPI',
        'express': 'Express',
        'django': 'Django',
        'flask': 'Flask',
        'bun': 'Bun',
        'spring': 'Spring',
        'go': 'Go',
        'golang': 'Go'
    };
    for (const k in backendMap) if (t.indexOf(k) !== -1) { partial.backend = backendMap[k]; break; }

    // frontend hints
    const frontendMap = {
        'next.js': 'Next.js / React',
        'nextjs': 'Next.js / React',
        'react': 'React',
        'vue': 'Vue',
        'angular': 'Angular',
        'svelte': 'Svelte',
        'flutter': 'Flutter',
        'react native': 'React Native',
        'electron': 'Electron',
        'tauri': 'Tauri'
    };
    for (const k in frontendMap) if (t.indexOf(k) !== -1) { partial.frontend = frontendMap[k]; break; }

    // services / providers
    const services = [];
    ['vercel','supabase','neon','railway','render','cloudflare','aws','gcp','azure','sentry','prometheus','grafana'].forEach(s => { if (t.indexOf(s)!==-1) services.push(s); });
    if (services.length) partial.servicos = services;

    // auth
    if (t.indexOf('oauth') !== -1 || t.indexOf('jwt') !== -1 || t.indexOf('autent') !== -1 || t.indexOf('login') !== -1) {
        partial.login = 'sim';
        partial.auth = t.indexOf('supabase') !== -1 ? 'Supabase Auth (JWT)' : 'JWT / OAuth2';
    }

    // banco
    if (t.indexOf('postgres') !== -1 || t.indexOf('postgresql') !== -1 || t.indexOf('mysql') !== -1 || t.indexOf('mongo') !== -1 || t.indexOf('mongodb') !== -1 || t.indexOf('banco') !== -1 || t.indexOf('database') !== -1) {
        partial.usa_banco = 'sim';
        if (t.indexOf('postgres') !== -1 || t.indexOf('supabase') !== -1 || t.indexOf('neon') !== -1) partial.banco = 'Postgres (recomendado)';
        else if (t.indexOf('mysql') !== -1) partial.banco = 'MySQL';
        else if (t.indexOf('mongo') !== -1) partial.banco = 'MongoDB';
        else partial.banco = 'Banco de dados necessário';
    }

    // realtime
    if (t.indexOf('websocket') !== -1 || t.indexOf('tempo real') !== -1 || t.indexOf('realtime') !== -1) partial.realtime = 'sim';

    // automações / filas / workers
    if (t.indexOf('cron') !== -1 || t.indexOf('job') !== -1 || t.indexOf('fila') !== -1 || t.indexOf('queue') !== -1 || t.indexOf('worker') !== -1 || t.indexOf('etl') !== -1) {
        partial.automacoes = 'sim';
        partial.workers = 'Workers/Jobs necessários';
        partial.filas = 'Redis/RabbitMQ (provável)';
    }

    // ia / gpu
    if (t.indexOf('machine learning') !== -1 || t.indexOf('ml') !== -1 || t.indexOf('ia') !== -1 || t.indexOf('inteligência artificial') !== -1 || t.indexOf('gpu') !== -1) {
        partial.ia = t.indexOf('local') !== -1 || t.indexOf('on-prem') !== -1 ? 'sim_local' : 'sim_cloud';
        if (t.indexOf('gpu') !== -1) partial.cpu_gpu = 'gpu';
    }

    // storage
    if (t.indexOf('s3') !== -1 || t.indexOf('storage') !== -1 || t.indexOf('minio') !== -1) partial.storage = 'S3 / MinIO / Supabase Storage';

    // docker / k8s
    if (t.indexOf('docker') !== -1) partial.docker = 'docker';
    if (t.indexOf('kubernetes') !== -1 || t.indexOf('k8s') !== -1) partial.kubernetes = 'kubernetes';

    // ci/cd
    if (t.indexOf('github actions') !== -1 || t.indexOf('cicd') !== -1 || t.indexOf('ci/cd') !== -1 || t.indexOf('pipeline') !== -1) partial.cicd = 'GitHub Actions';

    // backups / monitoring
    if (t.indexOf('backup') !== -1) partial.backup = 'sim';
    if (t.indexOf('sentry') !== -1 || t.indexOf('prometheus') !== -1 || t.indexOf('grafana') !== -1 || t.indexOf('monitor') !== -1 || t.indexOf('monitoramento') !== -1) {
        partial.logs = 'Sentry/ELK/CloudLogs';
        partial.monitoramento = 'Prometheus + Grafana / Sentry';
    }

    // usuarios / simultaneos (simples regex)
    const usersMatch = text.match(/(\d{1,3}(?:[.,\s]?\d{3})*)\s*(?:usuário|usuários|usuarios|users|clientes)/i);
    if (usersMatch) partial.usuarios = usersMatch[1].replace(/[.,\s]/g, '');
    const concMatch = text.match(/(\d{1,3}(?:[.,\s]?\d{3})*)\s*(?:simultâne|simultaneos|simultâneos|simultaneos|concurrentes|concurrent)/i);
    if (concMatch) partial.simultaneos = concMatch[1].replace(/[.,\s]/g, '');

    partial.resumo = String(text).trim();
    return partial;
}
