/// <reference path="../services/Auth.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class MainCtrl {
        // State defined as a bunch of potential strings
        private state: string = "signLog" || "registerDeviceSelect" || "signup" || "returnSignlog";
        private keys: IKeys; // the available keys

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
        }

        // Redirect to signup page
        signupRedirect() {
            this.state = "signup";
        }

        //Return back to login
        returnSignlog() {
            this.state = "signLog"
        }

        // Actual signup process
        signup() {
            this.state = "registerDeviceSelect";
        }

        // Select the device you want to register with
        registerDeviceSelect(device: string) {
            // register device
            this.state = "returnSignlog";
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
