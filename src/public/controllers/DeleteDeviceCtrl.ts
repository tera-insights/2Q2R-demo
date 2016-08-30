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
        private URL: string;

        // flip a switch to setup
        accept() {
            this.$mdDialog.hide();
        }

        cancel() {
            this.$mdDialog.cancel();
        }

        static $inject = ['$mdDialog', '$timeout', '$http', '$sce'];

        constructor(
            private $mdDialog: ng.material.IDialogService,
            private $timeout: ng.ITimeoutService,
            private $http: ng.IHttpService,
            private $sce: ng.ISCEService,
            private Auth: Auth
        ) {
            var that = this;
            this.$http.get('/device/delete')
                .then((rep: any) => {
                    console.log("Reply:", rep);
                    that.URL = that.$sce.trustAsResourceUrl(rep.data.deleteUrl);

                    // todo: wait for the message from iframe
                    /*that.$http.get(rep.data.waitUrl)
                        .then(() => { that.accept(); },
                        () => { that.cancel() })*/
                });
        }
    }
}
