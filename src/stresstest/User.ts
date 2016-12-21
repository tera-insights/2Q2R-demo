/// <reference path="../typings/index.d.ts" />

import * as httputil from "../app/routes/2Q2R-server"
import * as softU2F from "soft-u2f";
import { Converters } from "./Converters";

const device = softU2F.createDevice()

export default class User {
    constructor(appID: string, userID: string, baseURL: string) {
        httputil.get("/v1/register/request/" + userID)
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
                    device.register(appID, r.challenge, baseURL, userID).then((result) => {
                        httputil.post("/v1/register", {
                            successful: true,
                            Data: result,
                        })
                    }).catch((e: any) => {
                        throw e
                    })
                })

            }).catch((e: any) => {
                throw new Error(`Got error: ${e}`)
            });
    }
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
