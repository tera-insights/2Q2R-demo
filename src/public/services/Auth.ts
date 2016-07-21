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
        type: string; // the device type
    }

    export interface IKeys {
        user: string;
        keys: { [keyID: string]: IKeyInfo }
    }

    /**
     * Authentication service 
     * 
     * @export
     * @class Auth
     */
    export class Auth {
        private user: string; // username/email of current user
        public loggedIn: boolean = false;

        /**
         * Get user emaile
         */
        email() {
            return this.user;
        }

        getKeys(email: string) {
            return this.$http.get('/keys/' + email)
                .then((result) => {
                    return <IKeys>result.data;
                });
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
