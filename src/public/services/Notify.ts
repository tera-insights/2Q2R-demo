/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';


    export class Notify {

        info(msg: string) {
            this.$mdToast.show(
                this.$mdToast.simple()
                    .textContent(msg)
                    .hideDelay(3000)
            );
        }

        error(msg: string) {
            this.$mdToast.show(
                this.$mdToast.simple()
                    .textContent(msg)
                    .hideDelay(3000)
            );
        }

        static $inject = ["$mdToast"];

        constructor(
            private $mdToast: ng.material.IToastService
        ) { }

    }

}
