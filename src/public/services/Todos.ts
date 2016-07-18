/// <reference path="../typings/index.d.ts" />

module todos {
    'use strict';

    /**
     * Interface for todo items
     */
    export interface ITodoItem {
        title: string; // displayable name
        completed: boolean; // is it completed
    }

    /**
     * The todolist stored in the back
     */
    export interface ITodoList extends ng.resrource.IResource<ITodoList> {
        items: ITodoItem[]; // the array of todo items
        name: string; // the list name
    }

    export class TodoLists {
        static Resource($resrouce: ng.resource.IResourceService): ITodoList {
            var url = "/todos";
            var resource = $resource("", {}, {
                'get': { method: 'GET', url: url, isArray: false },
                'save': { method: 'POST', url: url }
            });
            return <ITodoList>resource;
        }

        getTodos(): ng.IPromise<ITodoList> {

        }

        static $inject = ['$resource', '$q', '$http'];

        constructor($resource: ng.resource.IResourceService,
            private $q: angular.IQService,
            private $http: angular.IHttpService) {
            this.resource = todos.TodoLists.Resource($resource);
        }

    }

}
