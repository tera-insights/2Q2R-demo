/// <reference path="../services/Auth.ts" />
/// <reference path="../services/Notify.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';


    /**
     * This controllers manages the login process
     * 
     * @export
     * @class LoginCtrl
     */
    export class LoginCtrl {
        private challengeInfo: any;
        private URL: string; // the URL we need to render in iframes

        // Skip past signup phases
        login(username: string, password: string) {
            var that = this;
            this.Auth.preLogin(username, password)
                .then((rep) => {
                    that.URL = that.$sce.trustAsResourceUrl(rep.authUrl);
                    console.log("Signup: ", rep);
                    that.$state.go("login.2q2r");
                    that.Auth.login()
                        .then(() => {
                            console.log("Logged in");
                            that.$state.go("todos");
                            that.Notify.info('Login Successful');
                        });
                }, (error) => {
                    console.log(error);
                    this.Notify.error("Login failed. Reason: " + error.statusText);
                });
        }

        static $inject = ['$sce', '$mdDialog', 'Notify', 'Auth', '$state'];

        constructor(
            private $sce: ng.ISCEService,
            private $mdDialog: ng.material.IDialogService,
            private Notify: Notify,
            private Auth: Auth,
            private $state: angular.ui.IStateService
        ) { }
    }
}
