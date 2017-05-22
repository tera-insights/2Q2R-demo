/// <reference path="../../typings/index.d.ts" />

/**
 * This file exposes a method to communicate with the 2Q2R-server.
 * It takes care of all the authentication with the server. 
 */

var unirest = require('unirest');
import * as config from 'config';
import * as Promise from "bluebird";
import * as crypto from "crypto";
import * as URLSafeBase64 from "urlsafe-base64";

var server2FA = config.get("2FAserver");
var token2FA = <string>config.get("2FAtoken");
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
        var objStr = JSON.stringify(obj);

        var hmac = crypto.createHmac('sha256', token2FA);
        hmac.update(subroute);
        hmac.update(objStr);

        unirest.post(server2FA + subroute)
            .headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authentication': appID + ':' + hmac.digest('base64')
            })
            .send(objStr)
            .end((response) => {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(response.body);
                }
            });
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
        var hmac = crypto.createHmac('sha256', token2FA);
        hmac.update(subroute);

        // console.log(hmac.digest('base64'))
        unirest.get(server2FA + subroute)
            .headers({
                'x-authentication': appID + ':' + URLSafeBase64.encode(hmac.digest('base64'))
            })
            .end((response) => {
                if (response.error) {
                    reject({ error: response.error, message: response.body });
                } else {
                    resolve(response.body);
                }
            });
    });
}

/**
 * Function to perform a delete request from the server 
 * 
 * @export
 * @param {string} subroute
 * @returns
 */
export function _delete(subroute: string) {
    return new Promise((resolve, reject) => {
        var hmac = crypto.createHmac('sha256', token2FA);
        hmac.update(subroute);

        unirest.delete(server2FA + subroute)
            .headers({
                'Authentication': appID + ':' + hmac.digest('base64')
            })
            .end((response) => {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(response.body);
                }
            });
    });
}
