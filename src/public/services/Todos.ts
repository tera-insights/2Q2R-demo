/// <reference path="../../typings/index.d.ts" />

module todos {
    'use strict';

    /**
     * Interface for todo items
     */
    export interface ITodoItem extends ng.resource.IResource<ITodoItem> {
        title: string; // displayable name
        completed: boolean; // is it completed
        id: string; // the item ID
        $update?: Function; // just so the compiler leaves us alone 
    }

    export interface ITodoResource extends ng.resource.IResourceClass<ITodoItem> {
        update(params: Object, data: ITodoItem, success?: Function, error?: Function): ITodoItem;
    }

    export class Todos {
        public resource: ITodoResource; // the resource to access backend

        static Resource($resource: ng.resource.IResourceService): ITodoResource {
            var resource = $resource("/todo/:id", { id: '@id' }, {
                'update': { method: 'PUT', params: { id: '@id' } }
            });
            return <ITodoResource>resource;
        }

        static $inject = ['$resource', '$q', '$http'];

        constructor($resource: ng.resource.IResourceService,
            private $q: angular.IQService,
            private $http: angular.IHttpService) {
            this.resource = todos.Todos.Resource($resource);
        }

    }

}
