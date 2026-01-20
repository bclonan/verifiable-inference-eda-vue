import type { ViewSpec } from "../../core/types.js";

export function needsInference(view: ViewSpec): boolean {
    return view.inferenceRequired === true;
}
