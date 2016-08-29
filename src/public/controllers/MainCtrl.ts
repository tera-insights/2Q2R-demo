/// <reference path="../services/Auth.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class MainCtrl {
        // State defined as a bunch of potential strings
        private state: string =
        "signLog" || // main register page
        "2q2rRegister" || // iframe register page
        "login" || // login main page
        "2q2rLogin" || // iframe login page  
        "returnSignlog"; // return to signin

        private keys: IKeyInfo[]; // the available keys
        private challengeInfo: any;
        private URL: string; // the URL we need to render in iframes

        // enables some debug stuff
        private debug: boolean = true;

        // list for dropdown
        private deviceDrop = [
            { "id": "2q2r", "value": "2Q2R App" },
            { "id": "u2f", "value": "U2F Device" }
        ];

        // set 2q2r as default value for select
        private deviceSelecter = "2q2r";

        // set a temporary qr code, empty
        private qrString = "";

        // Skip past signup phases
        login(username: string, password: string) {
            var self = this;
            this.Auth.preLogin(username, password)
                .then(() => {
                    self.Auth.getKeys()
                        .then((keys: IKeyInfo[]) => {
                            self.keys = keys;
                            self.state = "2q2rLogin";
                        })
                });

            this.$mdToast.show(
                this.$mdToast.simple()
                    .textContent('Login Successful')
                    .hideDelay(3000)
            );
        }

        test() {
            console.log(this.keys);
        }

        // Redirect to signup page
        loginRedirect() {
            this.state = "login";
        }

        //Return back to login
        returnSignlog() {
            this.state = "signLog"

            this.$mdToast.show(
                this.$mdToast.simple()
                    .textContent('Signup successful')
                    .hideDelay(3000)
            );
        }

        // Actual signup process
        signup(username: string, password: string) {
            var that = this;
            this.Auth.preRegister(username, password)
                .then((rep: any) => {
                    that.challengeInfo = rep;
                    that.URL = that.$sce.trustAsResourceUrl(rep.registerUrl);
                    console.log("Signup: ", rep);
                    that.state = "2q2rRegister";
                    that.Auth.waitPreRegister()
                        .then(() => {
                            // finish the registration
                            this.Auth.register()
                                .then(() => {
                                    that.state = "returnSignlog";

                                    this.$mdToast.show(
                                        this.$mdToast.simple()
                                            .textContent('Registration Succesful')
                                            .hideDelay(3000)
                                    );
                                });
                        }, (err) => {
                            that.state = "signLog";
                            this.$mdToast.show(
                                this.$mdToast.simple()
                                    .textContent('Registration Failed')
                                    .hideDelay(3000)
                            );
                        });
                }, (err) => {
                    console.log("Sigup failed: ", err);
                });
        }

        static $inject = ['$sce', '$mdDialog', '$mdToast', 'Auth', '$timeout'];

        constructor(
            private $sce: ng.ISCEService,
            private $mdDialog: ng.material.IDialogService,
            private $mdToast: ng.material.IToastService,
            private Auth: Auth,
            private $timeout: ng.ITimeoutService
        ) {
            this.state = "signLog";
        }
    }

}
