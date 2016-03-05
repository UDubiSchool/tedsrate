var app = angular.module('ratingsApp', [])
   .controller('MainController', ['$scope', '$http' , function($scope, $http) {

      $scope.projectOptions = [];
      $scope.artifactOptions = [];
      $scope.personaOptions = [];
      $scope.scenarioOptions = [];
      $scope.userOptions = [];
      $scope.configOptions = [];

      $http.get("models/admin_rp_model.php").then(function(response) {
        // var temp = JSON.parse(response.data);
        $scope.ratings = response.data;
        angular.forEach($scope.ratings, function(value, key) {
          if($scope.projectOptions.indexOf(value.project) === -1) {
            $scope.projectOptions.push(value.project);
          }
          if($scope.artifactOptions.indexOf(value.artifact) === -1) {
            $scope.artifactOptions.push(value.artifact);
          }
          if($scope.personaOptions.indexOf(value.persona) === -1) {
            $scope.personaOptions.push(value.persona);
          }
          if($scope.scenarioOptions.indexOf(value.scenario) === -1) {
            $scope.scenarioOptions.push(value.scenario);
          }
          if($scope.userOptions.indexOf(value.name) === -1) {
            $scope.userOptions.push(value.name);
          }
          if($scope.configOptions.indexOf(value.configurationName) === -1) {
            $scope.configOptions.push(value.configurationName);
          }
        });
        // console.log(response.data);
      });
      // console.log($scope.ratings);

   }]);