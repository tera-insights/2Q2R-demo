/// <reference path="../services/Todos.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class TodoCtrl {
        private todos: ITodoItem[] = [];
        private newTodo: string = "";
        private logged: boolean = false;

        signup(email: string, device: string) {
            this.$mdDialog.show({
                controller: SignupCtrl,
                controllerAs: 'cmod',
                templateUrl: 'views/signup-modal.html',
                clickOutsideToClose: true,
                locals: {
                    device: device,
                    email: email
                }
            });
        }

        login(email: string, device: string) {
            this.$mdDialog.show({
                controller: LoginCtrl,
                controllerAs: 'ctrl',
                templateUrl: 'views/login-modal.html',
                clickOutsideToClose: true,
                locals: {
                    device: device,
                    email: email
                }
            });
            this.logged = true;
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

        static $inject = ['$mdDialog'];

        constructor(
            private $mdDialog: ng.material.IDialogService
        ) { }

    }
}
