/// <reference path="../services/Todos.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class TodoCtrl {
        private todos: ITodoItem[] = [];
        private newTodo: string = "";
        private logged: boolean = false;

        // State defined as a bunch of potential strings
        private state: string = "deviceSelect" || "2q2rSignLog" || "u2fSignLog" || "2q2rSignup" || "u2fSignup";

        // Cannot have a number in function name
        twoQtwoR() {
            // Change state to 2q2r signup/login
            this.state = "2q2rSignLog";
        }

        // Same problem
        utwof() {
            // Change state to u2f signup/login
            this.state = "u2fSignLog";
        }

        // 2Q2R signup
        twoQtwoRSignup() {
            this.state = "2q2rSignup";
        }

        // U2F signup
        utwofSignup() {
            this.state = "u2fSignup";
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
