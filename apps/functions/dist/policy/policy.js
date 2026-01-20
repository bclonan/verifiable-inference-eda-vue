export function enforcePolicy(view, ctx) {
    // Demo policy: if piiAllowed is false, reject contexts marked PII:present
    const piiPresent = ctx.inputDTOs.some(d => JSON.stringify(d.data).includes("PII:present"));
    if (!view.constraints.piiAllowed && piiPresent) {
        throw new Error("Policy violation: PII present but not allowed");
    }
}
