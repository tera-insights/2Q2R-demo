/**
 * Typings for elliptic.js.
 * 
 * @author Sam Claus
 * @version 11/23/16
 * @copyright Tera Insights, LLC
 */
export class ECDSA {
    keyPair(options?: ECOptions): ECKeyPair
    keyFromPrivate(priv: any, encoding: string): ECKeyPair
    keyFromPublic(pub: any, encoding: string): ECKeyPair
    genKeyPair(options?: ECOptions): ECKeyPair
    sign(message: ArrayBuffer | string, key: ECKeyPair | any, encoding: string, options: SignatureOptions): Signature
    verify(message: ArrayBuffer | string, signature: Signature, key: ECKeyPair | any, encoding: string): boolean
    recoverPubKey(message: ArrayBuffer | string, signature: Signature | SignatureOptions, j: any, encoding: string): any
    getKeyRecoveryParam(e: any, signature: Signature | SignatureOptions, Q: any, encoding: string): any
    constructor(curve: string)
}

export type ECOptions = {
    curve?: string
}

export class Signature {
    toDER(encoding?: string): Uint8Array
}

export type SignatureOptions = {
    r: any,
    s: any,
    recoveryParam: any
}

export class ECKeyPair {
    getPublic(encoding: string): string
    getPrivate(encoding: string): string
    sign(message: ArrayBuffer | Uint8Array | string, encoding?: string, options?: SignatureOptions): Signature
    verify(message: ArrayBuffer | string, signature: Signature): boolean
}

export class EdDSA {

}

export interface EdKeyPair {

}