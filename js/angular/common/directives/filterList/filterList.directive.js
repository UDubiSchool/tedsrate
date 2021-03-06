'use strict';
var app = angular.module('teds.directives.filterList', [])
.constant('pathConst',{
    pathToDir: 'js/angular/common/directives/filterList/'
})
.directive('tedsFilterList', function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            list: '=',
            passback: '='
        },
        controller: ['$scope', '$timeout', function($scope, $timeout) {
            $scope.options= {};
            $scope.specialOptions= {};
            $scope.filters= {};
            $scope.table = $scope.list;
            angular.forEach($scope.table, function(listItem, rowKey){
                // console.log(listItem);
                angular.forEach(listItem.listData, function(paramValue, paramKey){
                    if($scope.options[paramKey] !== undefined) {
                        if($scope.options[paramKey].indexOf(paramValue) === -1) {
                            $scope.options[paramKey].push(paramValue);
                        }
                    } else {
                        $scope.options[paramKey] = [paramValue];
                    }
                });
                angular.forEach(listItem.specialFields, function(field, fieldKey){
                    // console.log(field);
                    if(field.type === 'date') {
                        if($scope.specialOptions[fieldKey] !== undefined) {
                            // if($scope.options[fieldKey].indexOf(field) === -1) {
                            //     $scope.options[fieldKey].push(field);
                            // }
                        } else {
                            $scope.specialOptions[fieldKey] = {
                                'true': true,
                                'false': false
                            };

                        }
                        field.filterCheck = field.value !== null;
                    } else {
                        if($scope.specialOptions[fieldKey] !== undefined) {
                            // if($scope.options[fieldKey].indexOf(field) === -1) {
                            //     $scope.options[fieldKey].push(field);
                            // }
                        } else {
                            $scope.specialOptions[fieldKey] = {
                            };

                        }
                    }

                });
            });

            $scope.select = function(item, index){
                $scope.selected = item;
                $scope.passback = item.details;
                $scope.passback.listIndex = index;
            }

            $scope.unsetSelected = function() {
                delete $scope.selected;
                delete $scope.passback;
            }
        }],
        templateUrl: 'js/angular/common/directives/filterList/filterList.html'
    }
})
