import type { DTO } from "../core/dto.ts";

export type BuildViewResult<T = unknown> = {
    /**
     * Always returned
     */
    view: DTO<T>;

    /**
     * Present ONLY when inference was used
     */
    receiptId?: string;
    receipt?: any;

    /**
     * Stable address of the inference execution
     * (URI, not a URL)
     */
    inferenceUri?: string;
};
