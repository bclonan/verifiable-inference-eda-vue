import nacl from "tweetnacl";
import { sha256Hex } from "./hash.js";

function hexToBytes(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) throw new Error("Invalid hex");
    const arr = new Uint8Array(hex.length / 2);
    for (let i = 0; i < arr.length; i++) arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return arr;
}

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

export function keypairFromSeedHex(seedHex: string) {
    const seed = hexToBytes(seedHex.padEnd(64, "0").slice(0, 64));
    const kp = nacl.sign.keyPair.fromSeed(seed);
    return { publicKeyHex: bytesToHex(kp.publicKey), secretKey: kp.secretKey };
}

export function signPayloadHex(secretKey: Uint8Array, payload: string): { signatureHex: string; payloadHash: string } {
    const payloadHash = sha256Hex(payload);
    const sig = nacl.sign.detached(new TextEncoder().encode(payload), secretKey);
    return { signatureHex: bytesToHex(sig), payloadHash };
}

export function verifyPayloadHex(publicKeyHex: string, payload: string, signatureHex: string): boolean {
    const pk = hexToBytes(publicKeyHex);
    const sig = hexToBytes(signatureHex);
    return nacl.sign.detached.verify(new TextEncoder().encode(payload), sig, pk);
}

export { bytesToHex, hexToBytes };
