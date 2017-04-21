import * as config from "config"
import * as crypto from "crypto"
import * as softU2F from "soft-u2f"
import * as path from "path"
import * as os from "os"
import PD = require("probability-distributions")
import * as httputil from "../app/routes/2Q2R-server"

const scenario = require(path.join(__dirname, process.argv.slice(2)[0])),
    speedup = parseFloat(process.argv.slice(2)[1]),
    userPrefix = process.argv.slice(2)[3] || "";

const device = softU2F.createDevice(),
    baseURL = config.get("2FAserver") as string,
    users = scenario["users"] as number,
    registerIntervals = PD.rbeta(users - 1, 2, 5).map((n) => {
        return n * 1000 / speedup
    }),
    start = Date.now()

let averageAuthOffset: number = 24 * 60 * 60 * 1000 / speedup
if (!isNaN(scenario["averageAuthsPerDay"])) {
    averageAuthOffset /= scenario["averageAuthsPerDay"]
} else {
    averageAuthOffset /= 1
    console.log("Scenario does not have key 'averageAuthsPerDay'. Assuming 1")
}

let regsDone = 0,
    regsLastInterval = 0,
    authsDone = 0,
    authsLastInterval = 0,
    pendingAuths = 0

register()
printStats()

function register() {
    const userID = userPrefix + "user-" + regsDone
    let keyID: string = undefined
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
        // ??? Sam, this needs to be set inside the softU2F library
        (r as any).response.deviceName = "Stresstest";
        (r as any).response.type = "soft-u2f";
        keyID = r.keyID
        return httputil.post("/v1/register", {
            successful: true,
            data: r.response
        })
    }).then(() => {
        regsDone += 1
        regsLastInterval += 1
        if (regsDone == users) {
            console.log(os.EOL + "Registrations done" + os.EOL)
        } else {
            setTimeout(register, registerIntervals[regsDone - 1])
        }
        setTimeout(() => {
            authenticate(userID, keyID, 0)
        }, Math.abs(PD.rnorm(1)[0]) * averageAuthOffset)
    }).catch((e) => {
        console.error("Register", e);
    })
}

function authenticate(userID, keyID: string, numDone: number) {
    const nonce = crypto.randomBytes(20).toString("hex");
    pendingAuths++;
    httputil.get(`/v1/auth/request/${userID}/${nonce}`).then((r: authSetupReply) => {
        console.log("ID:", r.id);
        httputil.post("/v1/auth/wait", {
            requestID: r.id,
        }).then(() => {
            authsDone += 1
            authsLastInterval += 1
            pendingAuths--;
            setTimeout(function() {
                authenticate(userID, keyID, numDone + 1)
            }, Math.abs(PD.rnorm(1)[0]) * averageAuthOffset)
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
    }).catch((e) => {
        console.error("Auth: ", e);
    })
}

function printStats() {
    const elapsed = (Date.now() - start) / 1000
    console.log(`Elapsed time in seconds: ${elapsed}`)
    console.log(`Total registrations done: ${regsDone}`)
    console.log(`Total authentications done: ${authsDone}`)
    console.log(`Registrations done last second: ${regsLastInterval}`)
    console.log(`Authentications done last second: ${authsLastInterval}`)
    console.log(`Actions done in last second: ${authsLastInterval + regsLastInterval}`)
    console.log(`Average actions per second: ${(authsDone + regsDone) / elapsed}`)
    console.log(`Pendign Auths: ${pendingAuths}`)
    console.log(os.EOL)
    regsLastInterval = 0
    authsLastInterval = 0
    setTimeout(printStats, 1000)
}

interface registerSetupReply {
    id: string
    registerUrl: string
}

interface challengeReply {
    challenge: string
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