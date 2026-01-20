export async function ingestEvent(store, e) {
    await store.appendEvent(e);
}
