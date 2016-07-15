/// <reference path="./typings/index.d.ts" />
/**
 * The main file for Admin application.
 *
 * @type {angular.Module}
 */

module admin {
    'use strict';

    var admin = angular.module('BeAGator', ['ngAria', 'ngMaterial', 'ngResource', 'mdDataTable', 'ngFileUpload', 'ngMdIcons', 'pdf'])
        .controller('AdminCtrl', AdminCtrl)
        .controller('AdmissionsCtrl', AdmissionsCtrl)
        .controller('DefaultCtrl', DefaultCtrl)
        .controller('FacultyCtrl', FacultyCtrl)
        .controller('SemestersCtrl', SemestersCtrl)
        .controller('AboutCtrl', AboutCtrl)
        .controller('StudentEditCtrl', StudentEditCtrl)
        .controller('StudentUploadCtrl', StudentUploadCtrl)
        .service('Semesters', Semesters)
        .service('Faculty', Faculty)
        .service('Region', Region)
        .filter('bytes', () => {
            return (bytes, precision) => {
                if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
                if (typeof precision === 'undefined') precision = 1;
                var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                    number = Math.floor(Math.log(bytes) / Math.log(1024));
                return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
            }
        })
        .filter('cut', () => {
            return (value: string, mStr: string) => {
                var max = parseInt(mStr);
                if (!max || value.length <= max) {
                    return value;
                } else {
                    var val = value.substr(0, max);
                    return val + "...";
                }
            }
        })
        /** Filter that allows  the specification of this for the filter function */
        .filter('tfilter', () => {
            return (items: Object[], fct: (val: Object, that?: Object) => boolean, that: Object) => {
                return items.filter(function(value: Object, index: number, array: Object[]) {
                    return fct(value, that);
                });
            };
        })
        ;

}
