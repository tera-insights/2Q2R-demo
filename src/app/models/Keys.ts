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
  
    // for infividual key manipulation, use sever iframes

    exists(userID: string) {
        return server2Q2R.get("/v1/users/"+userID)
        .then((rep: any) => {
            return rep.exists;
        });
    }

    deleteAll(userID: string){
        return server2Q2R._delete("/v1/users/"+userID)
    }

    getInfo() {
        return this.info;
    }

    constructor() {
        var that = this;
        server2Q2R.get("/v1/info/" + appID).then((reply) => {
            that.info = reply;
            console.log("INFO: ", reply);
        });
    }
}
