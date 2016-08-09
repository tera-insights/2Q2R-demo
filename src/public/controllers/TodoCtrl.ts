/// <reference path="../services/Todos.ts" />
/// <reference path="../services/Auth.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class TodoCtrl {
        private todos: ITodoItem[] = [];
        private newTodo: string = "";

        addDeviceDialog() {
            this.$mdDialog.show({
                controller: 'AddDeviceCtrl',
                templateUrl: '../views/add-device-modal.html',
                controllerAs: 'cmod',
                clickOutsideToClose: true
            });
        }

        deleteAccountDialog() {
            this.$mdDialog.confirm()
                .title('Would you like to delete your debt?')
                .textContent('All of the banks have agreed to forgive you your debts.')
                .ariaLabel('Lucky day')
                .ok('Please do it!')
                .cancel('Sounds like a scam');
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

        static $inject = ['$mdDialog', 'Auth'];

        constructor(
            private $mdDialog: ng.material.IDialogService,
            private Auth: Auth
        ) { }

    }
}
