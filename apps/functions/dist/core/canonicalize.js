function sortKeys(obj) {
    if (Array.isArray(obj))
        return obj.map(sortKeys);
    if (obj && typeof obj === "object") {
        const out = {};
        for (const k of Object.keys(obj).sort())
            out[k] = sortKeys(obj[k]);
        return out;
    }
    return obj;
}
export function canonicalJSONStringify(obj) {
    const sorted = sortKeys(obj);
    return JSON.stringify(sorted);
}
