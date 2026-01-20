import type { IStore } from "../stores/store.js";
import type { UiEventV1 } from "../core/types.js";

export async function ingestEvent(store: IStore, e: UiEventV1): Promise<void> {
    await store.appendEvent(e);
}
