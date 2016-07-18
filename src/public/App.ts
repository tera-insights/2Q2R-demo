/// <reference path="./typings/index.d.ts" />
/**
 * The main file for Todo application.
 *
 * @type {angular.Module}
 */

module todos {
    'use strict';

    var admin = angular.module('2Q2R', ['ngAria', 'ngMaterial', 'ngResource'])
        //      .controller('AdminCtrl', AdminCtrl)
        .service('TodoLists', TodoLists)
        ;

}
