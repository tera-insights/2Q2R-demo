/// <reference path="../../typings/index.d.ts" />

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
    export interface ITodoList extends ng.resource.IResource<ITodoList> {
        items: ITodoItem[]; // the array of todo items
        name: string; // the list name
    }

    interface ITodoListResource extends ng.resource.IResourceClass<ITodoList> {

    }

    export class TodoLists {
        private resource: ITodoListResource; // the resource to access backend

        static Resource($resource: ng.resource.IResourceService): ITodoListResource {
            var url = "/todos";
            var resource = $resource("", {}, {
                'get': { method: 'GET', url: url, isArray: false },
                'save': { method: 'POST', url: url }
            });
            return <ITodoListResource>resource;
        }

        getTodos(): ng.IPromise<ITodoList> {
            return;
        }

        static $inject = ['$resource', '$q', '$http'];

        constructor($resource: ng.resource.IResourceService,
            private $q: angular.IQService,
            private $http: angular.IHttpService) {
            this.resource = todos.TodoLists.Resource($resource);
        }

    }

}
