'use strict';
var app = angular.module('teds.directives.dropdown', [])
.constant('pathConst',{
    pathToDir: 'js/angular/common/directives/dropdown/'
})
.directive('tedsDropdown', function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            headerStats: '='
        },
        controller: ['$scope', function($scope) {
            $scope.collapsed = true;
            $scope.stats = $scope.headerStats;
        }],
        templateUrl: 'js/angular/common/directives/dropdown/dropdown.html'
    }
}).filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
