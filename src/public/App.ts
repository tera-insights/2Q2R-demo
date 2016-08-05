/// <reference path="../typings/index.d.ts" />
/// <reference path="services/Todos.ts" />
/// <reference path="controllers/MainCtrl.ts" />
/// <reference path="controllers/TodoCtrl.ts" />
/// <reference path="controllers/SignupCtrl.ts" />
/// <reference path="controllers/LoginCtrl.ts" />

/**
 * The main file for Todo application.
 *
 * @type {angular.Module}
 */

module todos {
    'use strict';

    var todos = angular.module('2Q2R', ['ngAria', 'ngMaterial', 'ngResource', 'ngMessages', 'validation.match', 'ngDropdown'])
        .service('TodoLists', TodoLists)
        .service('Auth', Auth)
        .controller('MainCtrl', MainCtrl)
        .controller('TodoCtrl', TodoCtrl)
        .controller('SignupCtrl', SignupCtrl)
        .controller('LoginCtrl', LoginCtrl)
        ;
}
