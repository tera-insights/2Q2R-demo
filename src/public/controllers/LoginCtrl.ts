/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';


    /**
     * This controllers helps with logging into the system 
     * 
     * @export
     * @class LoginCtrl
     */
    export class LoginCtrl {

        static $inject = ['$mdDialog', 'email', 'device'];

        constructor(
            private $mdDialog: ng.material.IDialogService,
            private email: string,
            private device: string
        ) {

        }
    }
}
