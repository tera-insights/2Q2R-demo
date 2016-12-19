/// <reference path="../services/Todos.ts" />
/// <reference path="../services/Auth.ts" />
/// <reference path="../services/Notify.ts" />
/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    export class TodoCtrl {
        private todos: ITodoItem[] = [];
        private newTodo: string = "";
        private URL: string; // the iframe URL
        private openModal = false; // controls the modal
        private Todo: ITodoResource;

        accept(msg) {
            this.Notify.info(msg);
            this.openModal = false;
        }

        cancel(msg) {
            this.Notify.error(msg);
            this.openModal = false;
        }

        addDeviceDialog() {
            var that = this;
            this.$http.get('/device/add')
                .then((rep: any) => {
                    that.URL = that.$sce.trustAsResourceUrl(rep.data.registerUrl);
                    that.openModal = true;

                    that.$http.get(rep.data.waitUrl)
                        .then(() => {
                            that.accept("Device added successfully.");
                        },
                        () => {
                            that.cancel("Device adding failed.")
                        })
                }, (error) => {
                    that.cancel('Add device failed. ' + error.statusText);
                });
        }

        deleteDeviceDialog() {
            var that = this;
            this.$http.get('/device/delete')
                .then((rep: any) => {
                    that.URL = that.$sce.trustAsResourceUrl(rep.data.deleteUrl);
                    that.openModal = true;

                    that.$http.get(rep.data.waitUrl)
                        .then(() => {
                            that.accept("Device deleted successfully.");
                        },
                        () => {
                            that.cancel("Device deletion failed.")
                        })
                }, (error) => {
                    that.cancel('Delete device failed. ' + error.statusText);
                });
        }

        deleteAccountDialog() {
            // TODO.
        }

        addTodo() {
            // TODO: push into service
            if (!this.newTodo.length) {
                return;
            }
            var todo = new this.Todo({
                title: this.newTodo,
                completed: false
            });
            todo.$save();
            this.todos.push(todo);

            this.newTodo = ""; // reset newTodo
        }

        updateTodo(todo) {
            todo.$update();
        }

        removeTodo(todo) {
            var $index = -1;
            this.todos.forEach((t, i, a) => {
                if (t.id == todo.id)
                    $index = i;
            });
            // Take out current element from todos array
            if ($index >= 0) {
                todo.$delete();
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

        static $inject = ['Auth', 'Notify', '$state', '$http', '$sce', 'Todos'];

        constructor(
            private Auth: Auth,
            private Notify: Notify,
            private $state: angular.ui.IStateService,
            private $http: ng.IHttpService,
            private $sce: ng.ISCEService,
            TodoSrvc: Todos
        ) {
            this.Todo = TodoSrvc.resource;

            if (!this.Auth.loggedIn)
                this.$state.go("login.main");

            // asynchronously fill in todos
            this.todos = this.Todo.query();
        }

    }
}
