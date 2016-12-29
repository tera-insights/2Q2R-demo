import * as config from "config";
import * as crypto from "crypto";
import * as softU2F from "soft-u2f";
import PD = require("probability-distributions")

import * as httputil from "../app/routes/2Q2R-server"

const device = softU2F.createDevice(),
    baseURL = config.get("2FAserver") as string,
    users = 10,
    registerIntervals: Array<number> = PD.rbeta(users - 1, 2, 5),
    start = Date.now(),
    speedup = 100

let registrationsDone = 0,
    authsDone = 0

register()
printStats()

function register() {
    const userID = "user-" + registrationsDone;
    let keyID: string = undefined;
    httputil.get(`/v1/register/request/${userID}`).then((r: registerSetupReply) => {
        httputil.post("/v1/register/wait", {
            requestID: r.id,
        })

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
        registrationsDone = registrationsDone + 1
        if (registrationsDone == users) {
            console.log("Registrations done")
        } else {
            setTimeout(register, 1000 * registerIntervals[registrationsDone - 1] / speedup)
        }
        setTimeout(() => {
            authenticate(userID, keyID, 0)
        }, Math.abs(PD.rnorm(1)[0]) * 1000 / speedup)
    })
}

function authenticate(userID, keyID: string, numDone: number) {
    const nonce = crypto.randomBytes(20).toString("hex")
    httputil.get(`/v1/auth/request/${userID}/${nonce}`).then((r: authSetupReply) => {
        httputil.post("/v1/auth/wait", {
            requestID: r.id,
        }).then(() => {
            authsDone = authsDone + 1 
            setTimeout(function() {
                authenticate(userID, keyID, numDone + 1)
            }, Math.abs(PD.rnorm(1)[0]) * 1000 / speedup)
        })

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

function printStats() {
    const elapsed = (Date.now() - start) / 1000
    console.log(`Elapsed time in seconds: ${elapsed}`)
    console.log(`Registrations done: ${registrationsDone}`)
    console.log(`Authentications done: ${authsDone}`)
    console.log(`Actions per second: ${(authsDone + registrationsDone) / elapsed}`)
    setTimeout(printStats, 1000)
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