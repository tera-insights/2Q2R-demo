/// <reference path="../services/Todos.ts" />

module todos {
    'use strict';

    export class TodoCtrl {
        private todos: ITodoItem[] = [];
        private newTodo: string = "";
        private logged: boolean = false;

        logIn() {
            this.logged = true;
        }

        showDialog() {
            this.$mdDialog.show({

            })
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

        markAllCompleted(completed: boolean) {
            this.todos.forEach(todoItem => {
                // this is from tastejs' todomvc app
                todoItem.completed = completed;
            });
        }
        constructor(
            private $mdDialog: ng.material.IDialogService
        ) { }

    }
}
