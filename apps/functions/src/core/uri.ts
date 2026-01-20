export function buildInferenceUri(params: {
    org: string;
    domain: string;
    viewSpecId: string;   // ux.session_summary@1
    stackSpecId: string;  // semantic_extract@1
    contextHash: string;
}): string {
    const { org, domain, viewSpecId, stackSpecId, contextHash } = params;
    return `infer://${org}/${domain}/${viewSpecId}/${stackSpecId}/${contextHash}`;
}
