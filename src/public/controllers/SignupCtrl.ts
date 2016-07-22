/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class SignupCtrl {
        private testqr: string = 'hey hey hey';

        static $inject = ['$mdDialog', 'email', 'device'];

        constructor(
            private $mdDialog: ng.material.IDialogService,
            private email: string,
            private device: string
        ) {

        }
    }
}
