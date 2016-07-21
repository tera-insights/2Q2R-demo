/// <reference path="../typings/index.d.ts" />
/**
 * The main file for Todo application.
 *
 * @type {angular.Module}
 */

module todos {
    'use strict';

    var todos = angular.module('2Q2R', ['ngAria', 'ngMaterial', 'ngResource', 'ngMessages'])
        //.controller('AdminCtrl', AdminCtrl)
        .service('TodoLists', TodoLists)
        .controller('TodoCtrl', TodoCtrl)
        .controller('SignupCtrl', SignupCtrl)
        ;

}
