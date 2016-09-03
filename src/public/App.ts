/// <reference path="../typings/index.d.ts" />
/// <reference path="services/Todos.ts" />
/// <reference path="controllers/RegisterCtrl.ts" />
/// <reference path="controllers/TodoCtrl.ts" />
/// <reference path="controllers/LoginCtrl.ts" />
/// <reference path="controllers/AddDeviceCtrl.ts" />
/// <reference path="controllers/DeleteDeviceCtrl.ts" />
/// <reference path="controllers/DeleteAccountCtrl.ts" />

/**
 * The main file for Todo application.
 *
 * @type {angular.Module}
 */

module todos {
    'use strict';

    var todos = angular.module('2Q2R', ['ngAria', 'ngMaterial',
        'ngResource', 'ui.router', 'ct.ui.router.extras',
        'ngMessages', 'validation.match', 'ngDropdown', 'ja.qr'])
        .service('TodoLists', TodoLists)
        .service('Auth', Auth)
        .service('Notify', Notify)
        .controller('RegisterCtrl', RegisterCtrl)
        .controller('TodoCtrl', TodoCtrl)
        .controller('LoginCtrl', LoginCtrl)
        .controller('AddDeviceCtrl', AddDeviceCtrl)
        .controller('DeleteDeviceCtrl', DeleteDeviceCtrl)
        .controller('DeleteAccountCtrl', DeleteAccountCtrl)
        .config((
            $stateProvider: angular.ui.IStateProvider,
            $urlRouterProvider: angular.ui.IUrlRouterProvider
        ) => {
            $urlRouterProvider.otherwise("/register");
            $stateProvider
                .state('register', {
                    url: "/register",
                    template: "<ui-view />",
                    controller: 'RegisterCtrl',
                    controllerAs: "ctrl",
                    deepStateRedirect: {
                        default: { state: 'register.main' }
                    }
                })
                .state('register.main', {
                    url: '',
                    templateUrl: "views/register.html",

                })
                .state('register.2q2r', {
                    url: "/2q2r",
                    templateUrl: "views/iframe.html"
                })
                .state('register.return', {
                    url: "/return",
                    templateUrl: "views/register.return.html"
                })
                .state('login', {
                    url: "/login",
                    template: "<ui-view />",
                    controller: "LoginCtrl",
                    controllerAs: "ctrl",
                    deepStateRedirect: {
                        default: { state: 'login.main' },
                        fn: ($dsr$) => {
                            return { state: 'login.main' };
                        }
                    }
                })
                .state('login.main', {
                    url: '',
                    templateUrl: "views/login.html"
                })
                .state('login.2q2r', {
                    url: "/2q2r",
                    templateUrl: "views/iframe.html"
                })
                .state('todos', {
                    url: "/todos",
                    templateUrl: "views/todo.html",
                    controller: "TodoCtrl",
                    controllerAs: "ctrl"
                })
                ;
        })
        ;
}
