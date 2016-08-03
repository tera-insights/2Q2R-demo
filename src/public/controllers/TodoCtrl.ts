/// <reference path="../services/Todos.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class TodoCtrl {
        private todos: ITodoItem[] = [];
        private newTodo: string = "";
        private logged: boolean = false;

        // State defined as a bunch of potential strings
        private state: string = "signLog" || "deviceSelect" || "signup" || "returnSignlog";

        // Skip past signup phases
        login() {
            this.state = "deviceSelect";
        }

        // Go to actual todo app. For now, only redirects to todo app.
        deviceSelect(device) {
            this.logged = true;
            console.log(device);
        }

        // Redirect to signup page
        signupRedirect() {
            this.state = "signup";
        }

        //Return back to login
        returnSignlog() {
            this.state = "signLog"
        }

        // Actual signup process
        signup() {
            this.state = "returnSignlog";
        }

        close() {
            this.$mdDialog.hide();
        }

        accept() {
            this.$mdDialog.hide();
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
