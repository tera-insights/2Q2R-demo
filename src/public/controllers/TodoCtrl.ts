/// <reference path="../services/Todos.ts" />
/// <reference path="../services/Auth.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class TodoCtrl {
        private todos: ITodoItem[] = [];
        private newTodo: string = "";

        //define an empty variable
        private alertman: any;

        addDeviceDialog() {
            this.$mdDialog.show({
                controller: 'AddDeviceCtrl',
                templateUrl: '../views/add-device-modal.html',
                controllerAs: 'cmod',
                clickOutsideToClose: true
            });
        }

        deleteDeviceDialog() {
            this.$mdDialog.show({
                controller: 'DeleteDeviceCtrl',
                templateUrl: '../views/delete-device-modal.html',
                controllerAs: 'cmod',
                clickOutsideToClose: true
            });
        }

        deleteAccountDialog() {
            this.$mdDialog.show({
                controller: 'DeleteAccountCtrl',
                templateUrl: '../views/delete-account-modal.html',
                controllerAs: 'cmod',
                clickOutsideToClose: true
            });
        }

        addTodo() {
            // TODO: push into service
            if (!this.newTodo.length) {
                return;
            }
            this.todos.push({
                title: this.newTodo,
                completed: false
            });

            this.newTodo = ""; // reset newTodo
        }

        removeTodo($index) {
            // Take out current element from todos array
            if ($index >= 0) {
                this.todos.splice($index, 1);
            }
        }

        markAllCompleted() {
            this.todos.forEach(ITodoItem => {

            });
        }

        logout() {
            this.Auth.logout();
            this.$state.go("login.main");
        }

        static $inject = ['$mdDialog', 'Auth', '$state'];

        constructor(
            private $mdDialog: ng.material.IDialogService,
            private Auth: Auth,
            private $state: angular.ui.IStateService
        ) {
            if (!this.Auth.loggedIn)
                this.$state.go("login.main");
        }

    }
}
