/**
 * Canonical Data Transfer Object (DTO)
 *
 * This represents a *verifiable, structured output* of a ViewSpec.
 * It is intentionally minimal and serializable.
 */
export type DTO<T = unknown> = {
    /**
     * Stable identifier of the view contract
     * Example: "ux.session_summary@1"
     */
    viewSpecId: string;

    /**
     * Primary payload produced by the view
     */
    data: T;

    /**
     * Optional metadata that does NOT affect determinism
     */
    meta?: {
        generatedAt?: string;
        version?: string;
        [key: string]: any;
    };
};
