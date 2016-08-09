/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    /**
     * This controllers manages the account deletion process and modal
     * 
     * @export
     * @class AddDeviceCtrl
     */
    export class AddDeviceCtrl {
        // is it generating?
        private generating = false;

        // is it finished?
        private finished = false;

        // qr or u2f
        private qrGen = false;
        private u2fGen = false;
        // list for dropdown
        private addDeviceDrop = [
            { "id": "2q2r", "value": "2Q2R App" },
            { "id": "u2f", "value": "U2F Device" }
        ];

        // set a string for the qr
        private qrString: string = '';

        // set 2q2r as default value for select
        private addDeviceSelector = "2q2r";

        // flip a switch to setup
        accept() {
            var that = this;

            this.generating = true;

            switch (this.addDeviceSelector) {
                case '2q2r':
                    this.qrGen = true;
                    break;

                case 'u2f':
                    this.u2fGen = true;
                    break;

                default:
            }

            // wait 2s and display success message without actions at bottom
            this.$timeout(2000)
                .then(() => {
                    // set both to false
                    that.qrGen = false;
                    that.u2fGen = false;

                    // this is true to display message
                    that.finished = true;
                });

            // wait 4s and close modal
            this.$timeout(4000)
                .then(() => {
                    that.$mdDialog.hide();
                });
        }

        cancel() {
            this.$mdDialog.cancel();
        }

        static $inject = ['$mdDialog', '$timeout'];

        constructor(
            private $mdDialog: ng.material.IDialogService,
            private $timeout: ng.ITimeoutService
        ) {

        }
    }
}
