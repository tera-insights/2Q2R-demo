/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';


    /**
     * This controller manages the account deletion modal
     * 
     * @export
     * @class DeleteAccountCtrl
     */
    export class DeleteAccountCtrl {

        deleteAccount() {
            // delete account here
            console.log('you did it');

            this.$mdDialog.hide();
        }

        cancel() {
            this.$mdDialog.cancel();
        }

        static $inject = ['$mdDialog'];

        constructor(
            private $mdDialog: ng.material.IDialogService
        ) {

        }
    }
}
