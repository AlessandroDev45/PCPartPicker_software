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

/**
 * Mark a set of keys as sourced from NLP inference.
 * Preserves any existing manual origins.
 */
export function markNlpOrigin(keys, key = 'funil:dados') {
    try {
        const cur = loadFunilDados(key) || {};
        const meta = cur._meta || {};
        for (const k of keys) {
            if (!meta[k] || meta[k] === 'default') {
                meta[k] = 'nlp';
            }
        }
        cur._meta = meta;
        saveFunilDados(cur, key);
    } catch (e) {}
}

/**
 * Mark a set of keys as explicitly chosen by the user.
 */
export function markManualOrigin(keys, key = 'funil:dados') {
    try {
        const cur = loadFunilDados(key) || {};
        const meta = cur._meta || {};
        for (const k of keys) {
            meta[k] = 'manual';
        }
        cur._meta = meta;
        saveFunilDados(cur, key);
    } catch (e) {}
}

/**
 * Get the origin for a specific key.
 * Returns 'manual', 'nlp', 'default', or null.
 */
export function getOrigin(key, dados) {
    if (!dados) return null;
    if (dados._meta && dados._meta[key]) return dados._meta[key];
    return null;
}

/* ────────────────────────────────────────────
   NLP — Lightweight entity extractor
   Uses word-boundary regex to avoid false positives
   ──────────────────────────────────────────── */
function wordMatch(text, word) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
}

function anyWordMatch(text, words) {
    return words.some(w => wordMatch(text, w));
}

export function nlpExtract(text) {
    if (!text || !String(text).trim()) return {};
    const t = String(text).toLowerCase();
    const result = {};

    // Numbers — same as before
    const usersMatch = text.match(/(\d{1,3}(?:[.,\s]?\d{3})*)\s*(?:usuário|usuários|usuarios|users?|clientes?|consumer|end.?user)/i);
    if (usersMatch) result.usuarios = usersMatch[1].replace(/[.,\s]/g, '');
    const concMatch = text.match(/(\d{1,3}(?:[.,\s]?\d{3})*)\s*(?:simultâne|simultaneos|simultâneos|concurrentes?|concurrent|simultaneous|online.?at.?once|parallel)/i);
    if (concMatch) result.simultaneos = concMatch[1].replace(/[.,\s]/g, '');
    const tpsMatch = text.match(/(\d{1,3}(?:[.,\s]?\d{3})*)\s*(?:transaçõe|transacoes|transactions|requests?|req\b)/i);
    if (tpsMatch) result.transacoes = tpsMatch[1].replace(/[.,\s]/g, '');
    const budgetMatch = text.match(/(?:orçamento|budget|custo|custo.?mensal|investimento)\s*(?:de\s*)?(?:R\$|US\$|\$)?\s*(\d{1,3}(?:[.,\s]?\d{3})*)/i);
    if (budgetMatch) result.orcamento = budgetMatch[1].replace(/[.,\s]/g, '');
    if (/(?:sla|uptime|disponibilidade)\s*(?:de\s*)?(?:99\.?\d*)/i.test(text)) {
        const slaMatch = text.match(/(?:sla|uptime|disponibilidade)\s*(?:de\s*)?(99\.?\d*)/i);
        if (slaMatch) result.sla = slaMatch[1];
    }
    const rtMatch = text.match(/(\d{1,5})\s*(?:ms|milissegundo|millisecond|segundo|second|minuto|minute)/i);
    if (rtMatch) result.tempo_resposta = rtMatch[0];

    // Databases — word boundary
    const dbMap = {
        'postgresql': 'PostgreSQL', 'postgres': 'PostgreSQL',
        'mysql': 'MySQL', 'mariadb': 'MariaDB',
        'mongodb': 'MongoDB', 'mongo': 'MongoDB',
        'redis': 'Redis', 'sqlite': 'SQLite',
        'firebase': 'Firebase / Firestore', 'firestore': 'Firebase / Firestore',
        'dynamodb': 'DynamoDB', 'cassandra': 'Cassandra',
        'elasticsearch': 'Elasticsearch',
        'prisma': 'Prisma ORM'
    };
    for (const [kw, label] of Object.entries(dbMap)) {
        if (wordMatch(t, kw)) { result.banco = label; break; }
    }

    // Auth — word boundary
    const authWords = ['oauth2', 'oauth', 'jwt', 'auth0', 'clerk', 'keycloak', 'login', 'mfa', '2fa', 'rbac'];
    if (anyWordMatch(t, authWords)) {
        result.login = 'sim';
        if (wordMatch(t, 'supabase')) result.auth = 'Supabase Auth (JWT)';
        else if (wordMatch(t, 'auth0')) result.auth = 'Auth0';
        else if (wordMatch(t, 'clerk')) result.auth = 'Clerk';
        else result.auth = 'JWT / OAuth2';
    }

    // Queues / workers — word boundary
    const queueWords = ['rabbitmq', 'kafka', 'nats', 'celery', 'bullmq', 'sqs', 'worker', 'queue', 'fila'];
    if (anyWordMatch(t, queueWords)) {
        result.automacoes = 'sim';
        if (wordMatch(t, 'rabbitmq')) result.filas = 'RabbitMQ';
        else if (wordMatch(t, 'kafka')) result.filas = 'Kafka';
        else result.filas = 'Redis / Fila';
    }

    // Monitoring — word boundary
    const monWords = ['sentry', 'prometheus', 'grafana', 'datadog', 'new relic', 'opentelemetry', 'elk'];
    if (anyWordMatch(t, monWords)) {
        result.monitoramento = 'sim';
        result.logs = 'sim';
    }

    // CI/CD — word boundary
    const cicdWords = ['github actions', 'gitlab ci', 'jenkins', 'circleci'];
    if (anyWordMatch(t, cicdWords)) result.cicd = 'GitHub Actions';

    // Cloud — word boundary
    const cloudWords = ['vercel', 'netlify', 'cloudflare', 'railway', 'render', 'heroku', 'fly.io',
        'aws', 'gcp', 'azure', 'digitalocean'];
    for (const w of cloudWords) {
        if (wordMatch(t, w)) { result.cloud = w; break; }
    }

    // Docker / K8s — word boundary
    if (wordMatch(t, 'docker')) result.docker = 'docker';
    if (wordMatch(t, 'kubernetes') || wordMatch(t, 'k8s')) result.kubernetes = 'kubernetes';

    // Real-time — word boundary
    if (anyWordMatch(t, ['websocket', 'socket.io', 'socketio'])) result.realtime = 'sim';

    // Backup — word boundary
    if (wordMatch(t, 'backup') || wordMatch(t, 'snapshot')) result.backup = 'sim';

    // Encryption — word boundary
    if (anyWordMatch(t, ['criptografia', 'encrypt', 'tls', 'ssl'])) result.criptografia = 'sim';
    if (anyWordMatch(t, ['lgpd', 'gdpr'])) result.lgpd = 'sim';

    // IA / ML — STRICT: only specific terms, NOT "ia"
    const iaStrict = ['machine learning', 'ml', 'deep learning', 'gpt', 'openai', 'llm',
        'neural network', 'tensorflow', 'pytorch', 'embedding'];
    if (anyWordMatch(t, iaStrict)) {
        const localHints = ['on-prem', 'onprem', 'local model', 'edge ai', 'edge ia'];
        result.ia = anyWordMatch(t, localHints) ? 'sim_local' : 'sim_cloud';
    }

    // GPU — only explicit terms
    if (wordMatch(t, 'gpu') || wordMatch(t, 'cuda')) result.cpu_gpu = 'gpu';

    // Storage — word boundary
    if (anyWordMatch(t, ['s3', 'minio', 'cdn', 'object storage', 'supabase storage'])) result.storage = 'sim';

    // Container
    if (wordMatch(t, 'docker')) result.docker = 'Docker + Compose';
    if (wordMatch(t, 'kubernetes') || wordMatch(t, 'k8s')) result.kubernetes = 'Kubernetes';

    return result;
}

/**
 * parseResumoAplicacao — strict mode with word-boundary regex
 */
export function parseResumoAplicacao(text) {
    if (!text || !String(text).trim()) return {};
    const partial = {};

    // Tipo detection — strict word boundary
    const tipoMap = [
        [/\bmobile\b/i, 'Mobile'],
        [/web\s*app/i, 'Web App'],
        [/\bsite\b/i, 'Web App'],
        [/website/i, 'Web App'],
        [/\bdesktop\b/i, 'Desktop'],
        [/\bpwa\b/i, 'PWA'],
        [/progressive\s*web\b/i, 'PWA'],
        [/\biot\b/i, 'IoT'],
        [/internet\s*of\s*things/i, 'IoT'],
        [/\bbot\b/i, 'Bot 24h'],
        [/chatbot/i, 'Bot 24h'],
        [/\bapi\b/i, 'API / Backend'],
        [/\bbackend\b/i, 'API / Backend'],
        [/rest\s*api/i, 'API / Backend'],
        [/graphql/i, 'API / Backend'],
        [/microservi/i, 'API / Backend'],
        [/\bsaas\b/i, 'SaaS'],
        [/automação/i, 'Automação'],
        [/automation/i, 'Automação'],
        [/etl/i, 'Data Pipeline'],
        [/data\s*pipeline/i, 'Data Pipeline'],
        [/\brealtime\b/i, 'Realtime'],
        [/tempo\s*real/i, 'Realtime'],
        [/streaming/i, 'Realtime'],
        [/\bdashboard\b/i, 'Dashboard'],
        [/painel/i, 'Dashboard'],
        [/\badmin\b/i, 'Admin'],
        [/backoffice/i, 'Admin'],
        [/machine\s*learning/i, 'IA'],
        [/deep\s*learning/i, 'IA'],
        [/\bgpt\b/i, 'IA'],
        [/openai/i, 'IA'],
        [/\bllm\b/i, 'IA'],
        [/\bedge\s*computing/i, 'Edge'],
        [/\bembedded\b/i, 'Embedded'],
        [/\bjogo\b/i, 'Jogo'],
        [/\bgame\b/i, 'Jogo'],
        [/\bindustrial\b/i, 'Sistema Industrial'],
        [/scada/i, 'Sistema Industrial'],
        [/\bplc\b/i, 'Sistema Industrial'],
    ];

    const tiposFound = [];
    for (const [regex, label] of tipoMap) {
        if (regex.test(text) && tiposFound.indexOf(label) === -1) tiposFound.push(label);
    }
    if (tiposFound.length) partial.tipo = { values: tiposFound, primary: tiposFound[0] };

    // Backend frameworks
    const backendMap = [
        [/\bnestjs\b/i, 'NestJS'], [/\bfastapi\b/i, 'FastAPI'],
        [/\bexpress\b/i, 'Express'], [/\bdjango\b/i, 'Django'],
        [/\bflask\b/i, 'Flask'], [/\bbun\b/i, 'Bun'],
        [/\bgolang\b/i, 'Go'], [/\bgo\b/i, 'Go'],
        [/spring\s*boot/i, 'Spring Boot'], [/\blaravel\b/i, 'Laravel'],
        [/\brails\b/i, 'Ruby on Rails'],
    ];
    for (const [regex, label] of backendMap) {
        if (regex.test(text)) { partial.backend = label; break; }
    }

    // Frontend
    const frontendMap = [
        [/next\.js/i, 'Next.js / React'], [/\breact\b/i, 'React'],
        [/\bvue\b/i, 'Vue'], [/\bangular\b/i, 'Angular'],
        [/\bsvelte\b/i, 'Svelte'], [/\bflutter\b/i, 'Flutter'],
    ];
    for (const [regex, label] of frontendMap) {
        if (regex.test(text)) { partial.frontend = label; break; }
    }

    // Services — word boundary
    const services = [];
    const serviceWords = ['vercel', 'netlify', 'supabase', 'neon', 'railway', 'render',
        'cloudflare', 'aws', 'gcp', 'azure', 'digitalocean', 'heroku',
        'stripe', 'twilio', 'sendgrid', 'algolia', 'auth0', 'clerk'];
    for (const w of serviceWords) {
        if (new RegExp(`\\b${w}\\b`, 'i').test(text) && services.indexOf(w) === -1) services.push(w);
    }
    if (services.length) partial.servicos = services;

    // Database mention
    const dbPatterns = [/\bpostgres\b/i, /\bmysql\b/i, /\bmongodb\b/i, /\bredis\b/i,
        /\bsqlite\b/i, /\bfirebase\b/i, /\bdynamodb\b/i, /\bbanco\b/i, /\bdatabase\b/i];
    if (dbPatterns.some(r => r.test(text))) partial.usa_banco = 'sim';

    // Real-time
    if (/\bwebsocket\b/i.test(text) || /socket\.io/i.test(text) ||
        /tempo\s*real/i.test(text) || /\brealtime\b/i.test(text)) partial.realtime = 'sim';

    // Workers
    if (/\bworker\b/i.test(text) || /\bjob\b/i.test(text) || /\bfila\b/i.test(text) ||
        /\bcron\b/i.test(text) || /\betl\b/i.test(text)) partial.automacoes = 'sim';

    // Numbers
    const usersMatch = text.match(/(\d{1,3}(?:[.,\s]?\d{3})*)\s*(?:usuário|usuários|usuarios|users|clientes?)/i);
    if (usersMatch) partial.usuarios = usersMatch[1].replace(/[.,\s]/g, '');
    const concMatch = text.match(/(\d{1,3}(?:[.,\s]?\d{3})*)\s*(?:simultâne|simultaneos|simultâneos|concurrentes|concurrent|simultaneous)/i);
    if (concMatch) partial.simultaneos = concMatch[1].replace(/[.,\s]/g, '');

    partial.resumo = String(text).trim();
    return partial;
}