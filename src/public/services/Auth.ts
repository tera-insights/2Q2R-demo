/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export interface IChallengeResponse {
        user: string; // the user whose challenge this is
        challenge: string; // the challenge
        appID: string; // authentication server ID
        keyID: string; // the keyID for this challenge
        counter: number; // the counter value in the request
    }


    export interface IKeyInfo {
        name: string; // the device name
        type: "2q2r" | "u2f"; // the device type
        keyID: string;
    }

    /**
     * Authentication service 
     * 
     * @export
     * @class Auth
     */
    export class Auth {
        private user: string; // username/email of current user
        private request: string; // last request ID
        private waitUrl: string; // the url to wait for a confirmation of last request
        private regPasswd: string; // last password; deleted when no longer needed
        public loggedIn: boolean = false;

        /**
         * Get user email
         */
        getUser() {
            return this.user;
        }

        /**
         * Get the available user keys. Only works if we are preLoggedin 
         * 
         * @returns
         */
        getKeys() {
            return this.$http.get('/keys')
                .then((rep: any) => { return rep.data; });
        }

        /**
         * Method to get a pre-session so we can complete the login with 2FA 
         * 
         * @param {string} email
         * @param {string} password
         * @returns Promise<string>
         */
        preLogin(username: string, password: string) {
            var self = this;
            this.user = username;
            return self.$http.post('/prelogin', {
                username: username,
                password: password
            }).then((reply: any) => {
                self.request = reply.data.id;
                return reply.data;
            });
        }

        /**
         * Main login. By now, we have selected a key and we have a challenge.
         * 
         * @param {string} email
         * @param {string} challenge
         * @param {string} keyID
         * @returns
         */
        login() {
            var self = this;
            return self.$http.post('/login', {
                username: self.user,
                request: self.request
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

        /**
         * Method to start the registration process. To make is less confusing,
         * we remember in Auth all the parts we need 
         * 
         * @param {string} username
         * @param {string} password
         */
        preRegister(username: string, password: string) {
            var that = this;
            this.regPasswd = password;
            this.user = username;
            return this.$http.get('/preregister/' + username)
                .then((rep: any) => {
                    var reply = rep.data;
                    that.request = reply.id;
                    that.waitUrl = reply.waitUrl;
                    return reply;
                });
        }

        register() {
            return this.$http.post('/register',
                {
                    userID: this.user,
                    password: this.regPasswd,
                    request: this.request
                }).then((rep: any) => {
                    return `User ${this.user} registerred`;
                })
        }

        static $inject = ['$http'];

        constructor(private $http: ng.IHttpService) {

        }

    }

}
