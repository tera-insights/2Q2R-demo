import * as config from "config";
import * as crypto from "crypto";
import * as softU2F from "soft-u2f";

import * as httputil from "../app/routes/2Q2R-server"

const device = softU2F.createDevice()
const baseURL = config.get("2FAserver") as string;

for (let i = 0; i < 100; i++) {
    const userID = "user-" + i;
    let keyID: string = undefined;

    httputil.get(`/v1/register/request/${userID}`).then((r: registerSetupReply) => {
        httputil.post("/v1/register/wait", {
            requestID: r.id,
        }).then(() => { console.log(`${userID} created`) }).timeout(15 * 1000)

        return httputil.post("/v1/register/challenge", {
            requestID: r.id,
        })
    }).then((r: challengeReply) => {
        return device.register(baseURL, r.challenge, baseURL, userID)
    }).then((r: softU2F.RegistrationResult) => {
        keyID = r.keyID
        return httputil.post("/v1/register", {
            successful: true,
            Data: r.response,
        })
    }).then(() => {
        const nonce = crypto.randomBytes(20).toString("hex")
        return httputil.get(`/v1/auth/request/${userID}/${nonce}`)
    }).then((r: authSetupReply) => {
        httputil.post("/v1/auth/wait", {
            requestID: r.id,
        }).then(() => { console.log(`${userID} authenticated`)}).timeout(30 * 1000)

        return httputil.post("/v1/auth/challenge", {
            keyID,
            requestID: r.id,
        })
    }).then((r: setKeyReply) => {
        return device.authenticate(keyID, baseURL, r.challenge, r.counter)
    }).then((r: softU2F.ISignatureData) => {
        return httputil.post("/v1/auth", {
            successful: true,
            data: r,
        })
    })
}

interface registerSetupReply {
    id: string
    registerUrl: string
}

interface challengeReply {
    challenge: string;
}

interface authSetupReply {
    id: string
    authUrl: string
}

interface setKeyReply {
    keyID: string
    challenge: string
    counter: number
    AppID: string
}