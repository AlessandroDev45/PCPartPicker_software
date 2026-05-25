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
