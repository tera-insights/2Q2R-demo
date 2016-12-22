import * as config from 'config';
import * as softU2F from "soft-u2f";

import * as httputil from "../app/routes/2Q2R-server"

const device = softU2F.createDevice()
const baseURL = config.get("2FAserver") as string;

for (let i = 0; i < 5; i++) {
    const userID = "user-" + i;
    const p = httputil.get("/v1/register/request/" + userID)
        .then((r: registerSetupReply) => {
            httputil.post("/v1/register/wait", {
                requestID: r.id,
            }).then(() => { console.log(`${userID} created`) }).timeout(15000)

            return httputil.post("/v1/register/challenge", {
                requestID: r.id,
            })
        }).then((r: challengeReply) => {
            return device.register(baseURL, r.challenge, baseURL, userID)
        }).then((result) => {
            return httputil.post("/v1/register", {
                successful: true,
                Data: result.response,
            })
        })
}

interface IRegisterData {
    clientData: string; // serialized client data JSON
    registrationData: string; // websafe-base64-encoded U2F registration binary
}

interface RegistrationResult {
    keyID: string,
    response: IRegisterData
}

interface registerSetupReply {
    id: string
    registerUrl: string
}

interface challengeReply {
    challenge: string;
}