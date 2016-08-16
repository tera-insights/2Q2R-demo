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
        private challenge: string; // last challenge
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
        getKeys(){
            return this.$http.get('/keys');
        }

        /**
         * Method to get a challenge for a specific key 
         * 
         * @param {string} keyID
         * @returns {Promise<challenge>}
         */
        getChallenge(username: string, keyID: string) {
            var self = this;
            return this.$http.post('/challenge', {
                username: username,
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
                return data.keys;
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
        login(username: string, challenge: string, keyID: string) {
            var self = this;
            return self.$http.post('/login', {
                username: username,
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
                    that.challenge = reply.challenge;
                    return reply;
                });
        }

        register() {
            var that = this;
            console.log("State: ", that);
            return this.$http.post('/register',
                {
                    userID: that.user,
                    password: that.regPasswd,
                    challenge: that.challenge
                }).then(
                (rep: any) => {
                    return "User " + that.user + " registerred";
                }
                )
        }

        static $inject = ['$http'];

        constructor(private $http: ng.IHttpService) {

        }

    }

}
