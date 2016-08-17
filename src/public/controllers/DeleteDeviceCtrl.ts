/// <reference path="../../typings/index.d.ts" />
/// <reference path="../services/Auth.ts" />

module todos {
    'use strict';

    /**
     * This controller manages the device deletion modal
     * 
     * @export
     * @class DeleteDeviceCtrl
     */
    export class DeleteDeviceCtrl {
        private keys: IKeyInfo[]; // the available keys gotten from Auth

        deleteDevice(keyID: string) {
            console.log(keyID, this.keys[keyID]);
            console.log('mission success (maybe)');
        }

        test() {
            console.log(this.keys);
        }

        static $inject = ['$mdDialog', 'Auth'];

        constructor(
            private $mdDialog: ng.material.IDialogService,
            private Auth: Auth
        ) {

        }
    }
}
