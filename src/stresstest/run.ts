import * as config from 'config';
import * as softU2F from "soft-u2f";

import * as httputil from "../app/routes/2Q2R-server"

const device = softU2F.createDevice()
const baseURL = config.get("2FAserver") as string;
const users: Array<PromiseLike<any>> = [];

for (let i = 0; i < 100; i++) {
    const userID = "user-" + i;
    users.push(httputil.get("/v1/register/request/" + userID)
        .then((r: registerSetupReply) => {
            httputil.post("/v1/register/wait", {
                requestID: r.id,
            }).then(() => {
                console.log("Registration complete")
            }).catch((e: Error) => {
                throw e
            })

            httputil.post("/v1/register/challenge", {
                requestID: r.id,
            }).then((r: challengeReply) => {
                device.register(baseURL, r.challenge, baseURL, userID).then((result) => {
                    httputil.post("/v1/register", {
                        successful: true,
                        Data: result.response,
                    }).catch((e: any) => {
                        throw e
                    })
                }).catch((e: any) => {
                    throw e
                })
            })
        }).catch((e: any) => {
            throw new Error(`Got error: ${e}`)
        }));
}

Promise.all(users)
    .then(() => { console.log("Users created") })
    .catch((e) => { throw e })

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