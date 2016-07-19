/// <reference path="../services/Todos.ts" />

module todos {
    'use strict';

    export class TodoCtrl {
        private todos: ITodoItem[] = [];
        private newTodo: string = "";

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
            this.todos.splice($index, 1);
        }
    }
}
