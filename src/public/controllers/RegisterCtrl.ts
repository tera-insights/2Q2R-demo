/// <reference path="../services/Auth.ts" />
/// <reference path="../services/Notify.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class RegisterCtrl {
        private URL: string; // the URL we need to render in iframes
        private challengeInfo: any;

        signup(username: string, password: string) {
            var that = this;
            this.Auth.preRegister(username, password)
                .then((rep: any) => {
                    that.challengeInfo = rep;
                    that.URL = that.$sce.trustAsResourceUrl(rep.registerUrl);
                    that.$state.go("register.2q2r");

                    // finish the registration
                    this.Auth.register()
                        .then(() => {
                            that.$state.go("register.return");
                            that.Notify.info('Registration Successful');
                        }, () => {
                            that.$state.go("register");
                            that.Notify.error('Registration Failed');
                        });
                }, (err) => {
                    console.log("Sign up failed: ", err);
                    that.Notify.error("Registration Failed. " + err.data);
                });
        }
        static $inject = ['$sce', 'Notify', 'Auth', '$state'];

        constructor(
            private $sce: ng.ISCEService,
            private Notify: Notify,
            private Auth: Auth,
            private $state: angular.ui.IStateService
        ) {
            this.$state.go('register.main');
        }

    }
}
