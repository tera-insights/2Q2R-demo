/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export interface IChallengeResponse {
        user: string; // the user whose challenge this is
        challenge: string; // the challenge
        appID: string; // authentication server ID
        keyID: string; // the keyID for this challenge
    }


    export interface IKeyInfo {
        name: string; // the device name
        type: "2q2r" | "u2f"; // the device type
    }

    // Maps from keyID => key description
    export type IKeys =
        { [keyID: string]: IKeyInfo };

    /**
     * Authentication service 
     * 
     * @export
     * @class Auth
     */
    export class Auth {
        private user: string; // username/email of current user
        private preloginToken: string; // we need this to complete login
        public loggedIn: boolean = false;

        /**
         * Get user emaile
         */
        email() {
            return this.user;
        }

        /**
         * Method to get a challenge for a specific key 
         * 
         * @param {string} keyID
         * @returns {Promise<challenge>}
         */
        getChallenge(email: string, keyID: string) {
            var that = this;
            return this.$http.post('/challenge', {
                email: email,
                keyID: keyID
            }).then((response: any) => {
                return <IChallengeResponse>response.data;
            });
        }

        /**
         * Method to get a pre-session so we can complete the login with 2FA 
         * 
         * @param {string} email
         * @param {string} password
         * @returns Promise<IKeys>
         */
        preLogin(username: string, password: string) {
            var self = this;
            return self.$http.post('/prelogin', {
                username: username,
                password: password
            }).then((reply: any) => {
                var data: { token: string, keys: IKeys } = reply.data;
                self.preloginToken = data.token;
                return data.keys;
            });

        }

        /**
         * Main login. By now, we have selected a key and we have a chellenge.
         * 
         * @param {string} email
         * @param {string} challenge
         * @param {string} keyID
         * @returns
         */
        login(email: string, challenge: string, keyID: string) {
            var self = this;
            return self.$http.post('/login', {
                email: email,
                challenge: challenge,
                keyID: keyID
            }).then((data: Object) => {
                self.user = <string>data['data'];
                self.loggedIn = true;
                return;
            })
        }

        /**
         * Logout method. 
         * 
         * @returns
         */
        logout() {
            var self = this;
            return self.$http.get('/logout')
                .then(() => {
                    self.loggedIn = false;
                });
        }

        static $inject = ['$http'];

        constructor(private $http: ng.IHttpService) {

        }


    }

}
