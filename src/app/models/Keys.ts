/// <reference path="../../typings/index.d.ts" />

import * as server2Q2R from '../routes/2Q2R-server';
import * as config from 'config';

var appID = config.get("appID");

export interface IKeyInfo {
    type: "2q2r" | "u2f"; // key type
    name: string; // displayable name 
}

// Maps from keyID => key description
export type IKeys =
    { [keyID: string]: IKeyInfo };

export class KeysSchema {
    private info: any; // info object from the server 

    get(userID: string) {
        return server2Q2R.post("/keys/list/" + userID, {});
    }

    delete(keyID: string) {
        return server2Q2R.post("/keys/delete/" + keyID, {});
    }

    exists(userID: string) {
        return server2Q2R.post("/users/exists", {
            userID: userID
        }).then((rep: any) => {
            return rep.exists;
        });
    }

    getInfo() {
        return this.info;
    }

    constructor() {
        var that = this;
        server2Q2R.get("/info/" + appID).then((reply) => {
            that.info = reply;
            console.log("INFO: ", reply);
        });
    }
}
