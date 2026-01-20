export function buildInferenceUri(params) {
    const { org, domain, viewSpecId, stackSpecId, contextHash } = params;
    return `infer://${org}/${domain}/${viewSpecId}/${stackSpecId}/${contextHash}`;
}
