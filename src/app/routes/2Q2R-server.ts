/// <reference path="../../typings/index.d.ts" />

/**
 * This file exposes a method to communicate with the 2Q2R-server.
 * It takes care of all the authentication with the server. 
 */

var unirest = require('unirest');
import * as config from 'config';
import * as Promise from "bluebird";

var server2FA = config.get("2FAserver");
var token2FA = config.get("2FAtoken");
var appID = config.get("appID");

/**
 * Function to send a message to the 2Q2R sever 
 * 
 * @export
 * @param {string} subroute
 * @param {Object} obj
 * @returns Promise<any> the reply
 */
export function post(subroute: string, obj: any) {
    return new Promise((resolve, reject) => {
        // inject the authentication in the Object
        if (obj.token || obj.appID) // token cannot be a member of Object    
            reject("token or appID cannot be a member of the object");
        else {
            obj.token = token2FA;
            obj.appID = appID;
            unirest.post(server2FA + subroute)
                .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
                .send(obj)
                .end((response) => {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response.body);
                    }
                });
        }
    });
}

/**
 * Function to perform a get request from the server 
 * 
 * @export
 * @param {string} subroute
 * @returns
 */
export function get(subroute: string) {
    return new Promise((resolve, reject) => {
        unirest.get(server2FA + subroute)
            .end((response) => {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(response.body);
                }
            });
    });
}
