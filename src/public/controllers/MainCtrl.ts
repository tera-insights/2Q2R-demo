/// <reference path="../services/Auth.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class MainCtrl {
        // State defined as a bunch of potential strings
        private state: string = "signLog" || "registerDeviceSelect" || "deviceSelectConfirm" || "login" || "returnSignlog";
        private keys: IKeys; // the available keys

        // enables some debug stuff
        private debug: boolean = true;

        // list for dropdown
        private deviceDrop = [
            { "id": "2q2r", "value": "2Q2R App" },
            { "id": "u2f", "value": "U2F Device" }
        ];

        // set 2q2r as default value for select
        private deviceSelecter = "2q2f";

        // Skip past signup phases
        login(username: string, password: string) {
            var self = this;
            this.Auth.preLogin(username, password)
                .then((keys: IKeys) => {
                    self.keys = keys;
                    self.state = "deviceSelect";
                });
        }

        // Go to actual todo app. For now, only redirects to todo app.
        deviceSelect(keyID: string) {
            console.log(keyID, this.keys[keyID]);
            this.Auth.loggedIn = true;
        }

        // Redirect to signup page
        loginRedirect() {
            this.state = "login";
        }

        //Return back to login
        returnSignlog() {
            this.state = "signLog"
        }

        // Actual signup process
        signup() {
            this.state = "registerDeviceSelect";
        }

        // Confirm device
        confirmDevice() {
            console.log(this.deviceDrop);
        }

        // Select the device you want to register with
        registerDeviceSelect(device: string) {
            // register device
            this.state = "deviceSelectConfirm";
        }

        static $inject = ['$mdDialog', 'Auth'];

        constructor(
            private $mdDialog: ng.material.IDialogService,
            private Auth: Auth
        ) {
            this.state = "signLog";
        }
    }

}
