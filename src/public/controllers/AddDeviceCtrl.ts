/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    /**
     * This controllers manages the account deletion process and modal
     * 
     * @export
     * @class AddDeviceModal
     */
    export class AddDeviceModal {

        static $inject = ['$mdDialog'];

        constructor(
            private $mdDialog: ng.material.IDialogService
        ) {

        }
    }
}
