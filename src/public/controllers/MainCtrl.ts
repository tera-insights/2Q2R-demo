/// <reference path="../services/Auth.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class MainCtrl {
        // State defined as a bunch of potential strings
        private state: string = "signLog" || "registerDeviceSelect" || "deviceSelectConfirm" || "deviceRegister" || "login" || "returnSignlog";
        private keys: IKeyInfo[]; // the available keys
        private challengeInfo: any;

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
                            self.state = "deviceSelect";
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

        // Go to actual todo app with device selected, for now only redirects
        deviceSelect(key: IKeyInfo) {
            var that = this;
            console.log(key);
            this.Auth.getChallenge(key.keyID)
                .then((rep) => {
                    switch (key.type) {
                        case '2q2r':
                            // set the qrString
                            that.qrString = "A " + rep.appID + " " + rep.challenge + " "
                                + key.keyID;

                            that.state = 'deviceLogin';
                            break;

                        case 'u2f':
                            console.log('WOOORKIN ON IT');
                            break;
                    }

                    this.Auth.login(rep.challenge, key.keyID)
                        .then(() => {
                            this.Auth.loggedIn = true;
                        })
                });
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
                    that.state = "registerDeviceSelect";
                }, (err) => {
                    console.log("Signap failed: ", err);
                });
        }

        // Accept button on the device registration throughout the entire process
        acceptDeviceRegistration() {
            var that = this;
            this.state = "deviceRegister";

            switch (this.deviceSelecter) {
                // if app
                case '2q2r':
                    // set the qrString
                    this.qrString = "R " + that.challengeInfo.challenge + " " +
                        that.challengeInfo.baseURL + "/info " + that.Auth.getUser();

                    this.Auth.register()
                        .then(() => {
                            that.state = "returnSignlog";

                            this.$mdToast.show(
                                this.$mdToast.simple()
                                    .textContent('Registration Succesful')
                                    .hideDelay(3000)
                            );
                        });

                    break;

                // if u2f device    
                case 'u2f':
                    console.log('WOOORKIN ON IT');
                    break;
            }
        }

        // Select the device you want to register with
        registerDeviceSelect(device: string) {
            // register device
            this.state = "deviceSelectConfirm";
        }

        static $inject = ['$mdDialog', '$mdToast', 'Auth', '$timeout'];

        constructor(
            private $mdDialog: ng.material.IDialogService,
            private $mdToast: ng.material.IToastService,
            private Auth: Auth,
            private $timeout: ng.ITimeoutService
        ) {
            this.state = "signLog";
        }
    }

}
