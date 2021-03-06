'use strict';
var app = angular.module('administrator', ['ngAnimate', 'ui.bootstrap', 'bootstrapLightbox', 'ui.validate', 'ngCookies', 'ngFileUpload', 'teds.models', 'ui.router', 'teds.directives.dropdown', 'teds.directives.filterList', 'teds.directives.pivotTable', 'AngularPrint', 'toArray', 'nvd3', 'angularSpinners', 'ui.grid', 'ui.grid.selection', 'textAngular']);

app.service('alertService', function(){
    this.alerts = [];

    this.addAlert = function (msg,type) {
        this.alerts.push({
            type: type,
            msg: msg
        });
    }

    this.closeAlert = function(index) {
        this.alerts.splice(index, 1);
    };
});

app.controller('adminCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'alertService', function($scope, $rootScope, $state, $stateParams, alertService){
    $scope.alerts = alertService.alerts;
    // $rootScope.$state = $state;
    // $rootScope.$stateParams = $stateParams;

    $scope.addAlert = alertService.addAlert;
    $scope.closeAlert = alertService.closeAlert;

    $scope.$on('$locationChangeStart', function(event) {
        window.nv.charts = {};
        window.nv.graphs = [];
        window.nv.logs = {};
        // remove resize listeners
        window.onresize = null;
    });

}]);

app.controller('projectsCtrl', ['$scope', '$http', '$animate', 'projectService', '$q', 'Upload', '$uibModal', 'languageService', 'alertService', 'userService', 'statService', 'Lightbox', 'assessmentService', 'uiGridConstants', '$interval', function($scope, $http, $animate, projectService, $q, Upload, $uibModal, languageService, alertService, userService, statService, Lightbox, assessmentService, uiGridConstants, $interval) {

    languageService.getAll();

    // get initial project data for page load
    if(!projectService.hasBasics) {
        projectService.getBasic().then(function(response){
            // var deferred = $q.defer();
            // var tmp = response.data;
            // angular.forEach(tmp, function(project, projectKey){
            //     project.collapsed = true;
            //     project.loaded = false;
            //     project.loading = false;
            // });
            // deferred.resolve(tmp);
            // return deferred.promise;
            $scope.projects = response.data;
            console.log(projectService.projects);
            // console.log(response.data);


        });
    } else {
            console.log("we have basics, not reloading");
            console.log(projectService.projects);
            $scope.projects = projectService.projects;
    }

    var modalTemplates = {
        project: 'partials/admin/modals/add_project.html',
    };

    var modalControllers = {
        project: 'addProjectCtrl',
    };

    $scope.modals = {
        open: function(target) {
            var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: modalTemplates[target],
                  controller: modalControllers[target],
                  size: 'lg',
                  // resolve: {
                  //   project: project,
                  // },
                  scope: $scope
            });

            modalInstance.result.then(function () {
              $scope.projects = projectService.projects;
            }, function () {});
        }
    };





}]).controller('projectCtrl', ['$scope', '$http', '$animate', 'projectService', '$q', 'Upload', '$uibModal', 'languageService', 'alertService', 'userService', 'statService', 'Lightbox', 'assessmentService', 'uiGridConstants', '$interval', '$stateParams', function($scope, $http, $animate, projectService, $q, Upload, $uibModal, languageService, alertService, userService, statService, Lightbox, assessmentService, uiGridConstants, $interval, $stateParams) {
    $scope.Lightbox = Lightbox;
    $scope.pivotOptions = {
        colorize: true,
        min: 1,
        max: 5,
        minColor: 'yellow',
        maxColor: 'green'
    };
    $scope.loaded = false;



    projectService.load($stateParams.id).then(function(response){
        var deferred = $q.defer();
        var project = response;

        $scope.$watch(function () {
            return project.grids.artifact.selected;
        }, function(artifact){
            if(artifact != undefined && artifact !=null && artifact !='') {
                statService.byArtifact(project.projectID, artifact.artifactID).then(function(stats){
                    project.grids.artifact.selected.stats = stats.data;
                    // project.grids.artifact.selected = formatStats(project.grids.artifact.selected);
                });
                console.log('a change happened!');
            }
        }, false);

        $scope.$watch(function () {
            return project.grids.scenario.selected;
        }, function(scenario){
            if(scenario != undefined && scenario !=null && scenario !='') {
                statService.byScenario(project.projectID, scenario.scenarioID).then(function(stats){
                    project.grids.scenario.selected.stats = stats.data;
                });
                console.log('a change happened!');
            }
        }, false);

        $scope.$watch(function () {
            return project.grids.configuration.selected;
        }, function(configuration){
            if(configuration != undefined && configuration !=null && configuration !='') {
                statService.byConfiguration(project.projectID, configuration.configurationID).then(function(stats){
                    project.grids.configuration.selected.stats = stats.data;
                });
                console.log('a change happened!');
            }
        }, false);

        $scope.$watch(function () {
            return project.grids.configuration.selected;
        }, function(configuration){
            if(configuration != undefined && configuration !=null && configuration !='') {
                statService.byConfiguration(project.projectID, configuration.configurationID).then(function(stats){
                    project.grids.configuration.selected.stats = stats.data;
                });
                console.log('a change happened!');
            }
        }, false);

        project.grids = {
            artifact: {},
            scenario: {},
            assessment: {},
            configuration: {},
            group: {}
        };

        var selectOptions = {
            artifact: {
                name: [],
                desc: [],
                type: [],
                url: [],
            },
            scenario: {
                name: [],
                desc: [],
            },
            assessment: {
                artifact: [],
                scenario: [],
                persona: [],
                role: [],
                user: [],
                confID: []
            },
            configuration: {
                atrConf: [],
                queConf: [],
                uiConf: [],
                artifact: [],
                scenario: [],
                persona: [],
                role: []
            },
            group: {
                type: []
            }
        };

        project.grids.artifact.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowHeaderSelection: false,
            multiSelect: false
        };
        project.grids.artifact.gridOptions.onRegisterApi = function(gridApi){
          project.grids.artifact.gridApi = gridApi;
          // $interval( function() {
          //     project.grids.artifact.gridApi.core.handleWindowResize();
          // }, 500, 10);
          gridApi.selection.on.rowSelectionChanged($scope,function(row){
            var msg = 'row selected ' + row.isSelected;
            project.grids.artifact.selected = row.entity;
            project.grids.artifact.selected.passback = {};
          });
        };

        project.grids.artifact.gridOptions.columnDefs = [
            {
                name: 'Name',
                field: 'artifactName',
                filter: {}
            },
            {
                name: 'Description',
                field: 'artifactDescription',
                filter: {}
            },
            {
                name: 'Type',
                field: 'artifactTypeName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.artifact.type
                }
            },
            {
                name: 'URL',
                field: 'artifactURL',
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"> <a href="{{COL_FIELD CUSTOM_FILTERS}}">Link</a></div>',
                enableFiltering: false,
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.artifact.url
                }
            }
        ];




        project.grids.scenario.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowHeaderSelection: false,
            multiSelect: false
        };
        project.grids.scenario.gridOptions.onRegisterApi = function(gridApi){
          project.grids.scenario.gridApi = gridApi;
          // $interval( function() {
          //     project.grids.scenario.gridApi.core.handleWindowResize();
          // }, 500, 10);
          gridApi.selection.on.rowSelectionChanged($scope,function(row){
            var msg = 'row selected ' + row.isSelected;
            project.grids.scenario.selected = row.entity;
            project.grids.scenario.selected.passback = {};
          });
        };

        project.grids.scenario.gridOptions.columnDefs = [
            {
                name: 'Name',
                field: 'scenarioName',
                filter: {}
            },
            {
                name: 'Description',
                field: 'scenarioDescription',
                filter: {}
            },
        ];


        project.grids.configuration.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowHeaderSelection: false,
            multiSelect: false
        };
        project.grids.configuration.gridOptions.onRegisterApi = function(gridApi){
          project.grids.configuration.gridApi = gridApi;
          // $interval( function() {
          //     project.grids.configuration.gridApi.core.handleWindowResize();
          // }, 500, 10);
          gridApi.selection.on.rowSelectionChanged($scope,function(row){
            var msg = 'row selected ' + row.isSelected;
            project.grids.configuration.selected = row.entity;
            project.grids.configuration.selected.passback = {};
          });
        };

        project.grids.configuration.gridOptions.columnDefs = [
            {
                name: 'Attributes',
                field: 'attributeConfigurationName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.configuration.atrConf
                }
            },
            {
                name: 'Questions',
                field: 'questionConfigurationName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.configuration.queConf
                }
            },
            {
                name: 'Interface',
                field: 'uiConfigurationName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.configuration.uiConf
                }
            },
            {
                name: 'Artifact',
                field: 'artifactName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.configuration.artifact
                }
            },
            {
                name: 'Scenario',
                field: 'scenarioName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.configuration.scenario
                }
            },
            {
                name: 'Persona',
                field: 'personaName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.configuration.persona
                }
            },
            {
                name: 'Role',
                field: 'roleName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.configuration.role
                }
            },
            {
                name: 'Start Link',
                field: 'configurationIDHashed',
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"> <a href="start.php?c={{COL_FIELD CUSTOM_FILTERS}}" target="_blank">Link</a></div>'
            }
        ];



        project.grids.group.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowHeaderSelection: false,
            multiSelect: false
        };
        project.grids.group.gridOptions.onRegisterApi = function(gridApi){
          project.grids.group.gridApi = gridApi;
          // $interval( function() {
          //     project.grids.configuration.gridApi.core.handleWindowResize();
          // }, 500, 10);
          gridApi.selection.on.rowSelectionChanged($scope,function(row){
            var msg = 'row selected ' + row.isSelected;
            project.grids.group.selected = row.entity;
            project.grids.group.selected.passback = {};
          });
        };

        project.grids.group.gridOptions.columnDefs = [
            {
                name: 'Group ID',
                field: 'groupID',
            },
            {
                name: 'Group Name',
                field: 'groupName',
            },
            {
                name: 'Group Type',
                field: 'groupTypeName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.group.type
                }
            },
            {
                name: 'Lottery Start Date',
                field: 'lotteryStartDate',
                cellFilter: 'date',
                filters: [
                    {
                      condition: uiGridConstants.filter.GREATER_THAN,
                      placeholder: 'greater than'
                    },
                    {
                      condition: uiGridConstants.filter.LESS_THAN,
                      placeholder: 'less than'
                    }
                ]
            },
            {
                name: 'Lottery End Date',
                field: 'lotteryEndDate',
                cellFilter: 'date',
                filters: [
                    {
                      condition: uiGridConstants.filter.GREATER_THAN,
                      placeholder: 'greater than'
                    },
                    {
                      condition: uiGridConstants.filter.LESS_THAN,
                      placeholder: 'less than'
                    }
                ]
            },
            {
                name: 'Welcome Link',
                field: 'groupID',
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"> <a href="welcome.php?g={{COL_FIELD CUSTOM_FILTERS}}" target="_blank">Link</a></div>'
            }
        ];

        project.groupStats = {
            Count: project.groups.length
        };

        project.grids.assessment.gridOptions = {
            enableFiltering: true,
            enableSorting: true,
            enableRowHeaderSelection: false,
            multiSelect: false
        };
        project.grids.assessment.gridOptions.onRegisterApi = function(gridApi){
            project.grids.assessment.gridApi = gridApi;
            // $interval( function() {
            //     project.grids.assessment.gridApi.core.handleWindowResize();
            // }, 500, 10);
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
                var msg = 'row selected ' + row.isSelected;
                project.grids.assessment.selected = row.entity;
                project.grids.assessment.selected.passback = {};
            });
        };

        project.grids.assessment.gridOptions.columnDefs = [
            {
                name: 'Artifact',
                field: 'artifactName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.assessment.artifact
                }
            },
            {
                name: 'Scenario',
                field: 'scenarioName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.assessment.scenario
                }
            },
            {
                name: 'Persona',
                field: 'personaName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.assessment.persona
                }
            },
            {
                name: 'Role',
                field: 'roleName',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.assessment.role
                }
            },
            {
                name: 'User',
                field: 'email',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.assessment.user
                }
            },
            {
                name: 'Configuration ID',
                field: 'configurationID',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: selectOptions.assessment.confID
                }
            },
            {
                name: 'Asessment Link',
                field: 'assessmentIDHashed',
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"> <a href="assessment.php?a={{COL_FIELD CUSTOM_FILTERS}}" target="_blank">Link</a></div>'
            },
            {
                name: 'Issued',
                field: 'issuanceDate',
                cellFilter: 'date',
                filters: [
                    {
                      condition: uiGridConstants.filter.GREATER_THAN,
                      placeholder: 'greater than'
                    },
                    {
                      condition: uiGridConstants.filter.LESS_THAN,
                      placeholder: 'less than'
                    }
                ]
            },
             {
                name: 'Edited',
                field: 'lastEditDate',
                cellFilter: 'date',
                filters: [
                    {
                      condition: uiGridConstants.filter.GREATER_THAN,
                      placeholder: 'greater than'
                    },
                    {
                      condition: uiGridConstants.filter.LESS_THAN,
                      placeholder: 'less than'
                    }
                ]
            },
             {
                name: 'Completed',
                field: 'completionDate',
                cellFilter: 'date',
                filters: [
                    {
                      condition: uiGridConstants.filter.GREATER_THAN,
                      placeholder: 'greater than'
                    },
                    {
                      condition: uiGridConstants.filter.LESS_THAN,
                      placeholder: 'less than'
                    }
                ]
            },
        ];





        project.artifactsStats = {
            Count: project.artifacts.length
        };
        angular.forEach(project.artifacts, function(artifact, artifactKey) {
            if(artifact !== undefined && artifact !== null && artifact !== '') {
                var type = {value:artifact.artifactTypeName, label: artifact.artifactTypeName};
                if(selectOptions.artifact.type.selectOptionIndex(type) == -1) {
                    selectOptions.artifact.type.push(type);
                }
            }
        });

        project.scenariosStats = {
            Count: project.scenarios.length
        };

        project.assessmentsStats = {
            Count: project.assessments.length
        };
        angular.forEach(project.assessments, function(assessment, assessmentKey) {
            if(assessment !== undefined && assessment !== null && assessment !== '') {
                var artifact = {value:assessment.artifactName, label: assessment.artifactName};
                var scenario = {value:assessment.scenarioName, label: assessment.scenarioName};
                var persona = {value:assessment.personaName, label: assessment.personaName};
                var role = {value:assessment.roleName, label: assessment.roleName};
                var user = {value:assessment.email, label: assessment.email};
                var confID = {value:assessment.configurationID, label: assessment.configurationID};
                if(selectOptions.assessment.artifact.selectOptionIndex(artifact) == -1) {
                    selectOptions.assessment.artifact.push(artifact);
                }
                if(selectOptions.assessment.scenario.selectOptionIndex(scenario) == -1) {
                    selectOptions.assessment.scenario.push(scenario);
                }
                if(selectOptions.assessment.persona.selectOptionIndex(persona) == -1) {
                    selectOptions.assessment.persona.push(persona);
                }
                if(selectOptions.assessment.role.selectOptionIndex(role) == -1) {
                    selectOptions.assessment.role.push(role);
                }
                if(selectOptions.assessment.user.selectOptionIndex(user) == -1) {
                    selectOptions.assessment.user.push(user);
                }
                 if(selectOptions.assessment.confID.selectOptionIndex(confID) == -1) {
                    selectOptions.assessment.confID.push(confID);
                }
            }
        });

        project.configurationsStats = {
            Count: project.configurations.length
        };
        angular.forEach(project.configurations, function(configuration, configurationKey) {
            if(configuration !== undefined && configuration !== null && configuration !== '') {
                var atrConf = {value:configuration.attributeConfigurationName, label: configuration.attributeConfigurationName};
                var queConf = {value:configuration.questionConfigurationName, label: configuration.questionConfigurationName};
                var uiConf = {value:configuration.uiConfigurationName, label: configuration.uiConfigurationName};
                var artifact = {value:configuration.artifactName, label: configuration.artifactName};
                var scenario = {value:configuration.scenarioName, label: configuration.scenarioName};
                var persona = {value:configuration.personaName, label: configuration.personaName};
                var role = {value:configuration.roleName, label: configuration.roleName};
                if(selectOptions.configuration.atrConf.selectOptionIndex(atrConf) == -1) {
                    selectOptions.configuration.atrConf.push(atrConf);
                }
                if(selectOptions.configuration.queConf.selectOptionIndex(queConf) == -1) {
                    selectOptions.configuration.queConf.push(queConf);
                }
                if(selectOptions.configuration.uiConf.selectOptionIndex(uiConf) == -1) {
                    selectOptions.configuration.uiConf.push(uiConf);
                }
                if(selectOptions.configuration.artifact.selectOptionIndex(artifact) == -1) {
                    selectOptions.configuration.artifact.push(artifact);
                }
                if(selectOptions.configuration.scenario.selectOptionIndex(scenario) == -1) {
                    selectOptions.configuration.scenario.push(scenario);
                }
                if(selectOptions.configuration.persona.selectOptionIndex(persona) == -1) {
                    selectOptions.configuration.persona.push(persona);
                }
                if(selectOptions.configuration.role.selectOptionIndex(role) == -1) {
                    selectOptions.configuration.role.push(role);
                }
            }
        });


        angular.forEach(project.groups, function(group, groupKey) {
            if(group !== undefined && group !== null && group !== '') {
                var type = {value:group.groupTypeName, label: group.groupTypeName};
                if(selectOptions.group.type.selectOptionIndex(type) == -1) {
                    selectOptions.group.type.push(type);
                }
            }
        });


        project.grids.artifact.gridOptions.data = project.artifacts;
        project.grids.scenario.gridOptions.data = project.scenarios;
        project.grids.assessment.gridOptions.data = project.assessments;
        project.grids.configuration.gridOptions.data = project.configurations;
        project.grids.group.gridOptions.data = project.groups;

        project.loaded = true;
        project.loading = false;

        deferred.resolve(project);
        return deferred.promise;

    }).then(function(processed) {
        $scope.project = processed;
        $scope.loaded = true;
    });



    userService.getAll().then(function(response){
        $scope.users = response.data;
    });

    $scope.addAlert = alertService.addAlert;

    $scope.closeAlert = alertService.closeAlert;

    languageService.getAll().then(function(response){
        $scope.languages = response.data;
    })

    var modalTemplates = {
        project: 'partials/admin/modals/add_project.html',
        artifact: 'partials/admin/modals/add_artifact.html',
        scenario: 'partials/admin/modals/add_scenario.html',
        persona: 'partials/admin/modals/add_persona.html',
        role: 'partials/admin/modals/add_role.html',
        configuration: 'partials/admin/modals/add_configuration.html',
        assessment: 'partials/admin/modals/add_assessment.html',
        group: 'partials/admin/modals/add_group.html'
    };

    var modalControllers = {
        project: 'addProjectCtrl',
        artifact: 'addArtifactCtrl',
        scenario: 'addScenarioCtrl',
        persona: 'addPersonaCtrl',
        role: 'addRoleCtrl',
        configuration: 'addConfigurationCtrl',
        assessment: 'addAssessmentCtrl',
        group: 'addGroupCtrl'
    };

    $scope.modals = {
        open: function(target, project, options) {
            var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: modalTemplates[target],
                  controller: modalControllers[target],
                  size: 'lg',
                  resolve: {
                    project: project,
                    options: options
                  },
                  scope: $scope
            });

            modalInstance.result.then(function (newProject) {
              $scope.project = newProject;
            }, function () {});
        }
    };

    $scope.deleteAssessment = function(assessment, list, key) {
        console.log(key);
        assessmentService.delete(assessment.assessmentID).then(function(response){
            console.log(response);
            assessment.popoverOpen = false;
            delete list[assessment.listIndex];
            assessment = null;
        });
    };

}]).controller('assessmentsCtrl', ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams){
    // $scope.assessment = $stateParams.assessment;
    // console.log('opened assessmentCtrl');
    // console.log($state);
    // console.log($stateParams);
}]).controller('addAssessmentCtrl', function($scope, $uibModalInstance, project, assessmentService){
    var newProject = project;
    $scope.project = project;
    $scope.assessment = {};

    $scope.$watch(function () {
        return $scope.project.grids.configuration.selected;
    }, function(configuration){
        if(configuration != undefined && configuration !=null && configuration !='') {
            $scope.assessment.configurationID = configuration.configurationID;
        }
    }, false);

    $scope.ok = function () {
      $scope.assessment.projectID = project.projectID;
      var filteredData = {
        configurationID: $scope.assessment.configurationID,
        userID: $scope.assessment.userID
      };
      // add configuration to db and to project then return altered project to main ctrl to add to DOM
      assessmentService.post(filteredData).then(function(response){
          if(response.status) {

              var id = response.data.data.id;
              assessmentService.get(id).then(function(response){
                  var assessment = response.data[0];
                  newProject.assessments.push(assessment);
                  newProject.assessmentsStats.Count++;
                  $scope.$parent.addAlert('The assessment has successfully been added to the database.', 'success');
                  $uibModalInstance.close(newProject);
              });


          } else {
              $scope.$parent.addAlert('The assessment could not be added to the database.', 'danger');
              $uibModalInstance.dismiss('cancel');

          }
      });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});

app.controller('addProjectCtrl', function ($scope, $uibModalInstance, projectService, languageService) {
  $scope.languages = languageService.languages;
  $scope.ok = function () {

    // add project to db and to project list then return
    projectService.post($scope.project).then(function(response){
        if(response.status) {
            projectService.getBasic(response.data);
            // projectService.hasBasics = false;
            $scope.$parent.addAlert('The project has successfully been added to the database.', 'success');
            $uibModalInstance.close();
        } else {
            $scope.$parent.addAlert('The project could not be added to the database.', 'danger');
            $uibModalInstance.dismiss('cancel');
        }
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}).controller('addArtifactCtrl', function ($scope, $uibModalInstance, project, artifactService, artifactTypeService) {

  var newProject = project;
  $scope.project = project;
  artifactTypeService.getAll().then(function(response){
    $scope.artifactTypes = response.data;
  });
  artifactService.getAll().then(function(response){
    $scope.artifacts = response.data;
  });

  $scope.ok = function () {
    $scope.artifact.projectID = project.projectID;
    // $scope.artifact.artifactURL = encodeURI($scope.artifact.artifactURL);
    // console.log($scope.artifact);

    // add artifact to db and to project then return altered project to main ctrl to add to DOM
    artifactService.post($scope.artifact).then(function(response){
        if(response.status) {
            if ($scope.artifact.artifactID) {
                artifactService.get($scope.artifact.artifactID).then(function(response){
                    newProject.artifacts.push(response.data[0]);
                    $scope.$parent.addAlert('The artifact has successfully been associated with the project.', 'success');
                    $uibModalInstance.close(newProject);
                });
            } else {
                newProject.artifacts.push($scope.artifact);
                $scope.$parent.addAlert('The artifact has successfully been added to the database.', 'success');
                $uibModalInstance.close(newProject);
            }
        } else {
            $scope.$parent.addAlert('The artifact could not be added to the database.', 'danger');
            $uibModalInstance.dismiss('cancel');

        }
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}).controller('addScenarioCtrl', function ($scope, $uibModalInstance, project, scenarioService) {

  var newProject = project;
  $scope.project = project;
  scenarioService.getAll().then(function(response){
    $scope.scenarios = response.data;
  });

  $scope.ok = function () {
    $scope.scenario.projectID = project.projectID;
    // console.log($scope.scenario);
    // add scenario to db and to project then return altered project to main ctrl to add to DOM
    scenarioService.post($scope.scenario).then(function(response){
        if(response.status) {
            if ($scope.scenario.scenarioID) {
                scenarioService.get($scope.scenario.scenarioID).then(function(response){
                    newProject.scenarios.push(response.data[0]);
                    $scope.$parent.addAlert('The scenario has successfully been associated with the project.', 'success');
                    $uibModalInstance.close(newProject);
                });
            } else {
                newProject.scenarios.push($scope.scenario);
                $scope.$parent.addAlert('The scenario has successfully been added to the database.', 'success');
                $uibModalInstance.close(newProject);
            }
        } else {
            $scope.$parent.addAlert('The scenario could not be added to the database.', 'danger');
            $uibModalInstance.dismiss('cancel');

        }
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}).controller('addPersonaCtrl', function ($scope, $uibModalInstance, project, personaService) {

  var newProject = project;
  $scope.project = project;
  personaService.getAll().then(function(response){
    $scope.personas = response.data;
  });

  $scope.ok = function () {
    $scope.persona.projectID = project.projectID;
    // add persona to db and to project then return altered project to main ctrl to add to DOM
    personaService.post($scope.persona).then(function(response){
        if(response.status) {
            if ($scope.persona.personaID) {
                personaService.get($scope.persona.personaID).then(function(response){
                    newProject.personas.push(response.data[0]);
                    $scope.$parent.addAlert('The persona has successfully been associated with the project.', 'success');
                    $uibModalInstance.close(newProject);
                });
            } else {
                newProject.personas.push($scope.persona);
                $scope.$parent.addAlert('The persona has successfully been added to the database.', 'success');
                $uibModalInstance.close(newProject);
            }
        } else {
            $scope.$parent.addAlert('The persona could not be added to the database.', 'danger');
            $uibModalInstance.dismiss('cancel');

        }
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}).controller('addRoleCtrl', function ($scope, $uibModalInstance, project, roleService) {

  var newProject = project;
  $scope.project = project;
  roleService.getAll().then(function(response){
    $scope.roles = response.data;
  });

  $scope.ok = function () {
    $scope.role.projectID = project.projectID;
    // add role to db and to project then return altered project to main ctrl to add to DOM
    roleService.post($scope.role).then(function(response){
        if(response.status) {
            if ($scope.role.roleID) {
                roleService.get($scope.role.roleID).then(function(response){
                    newProject.roles.push(response.data[0]);
                    $scope.$parent.addAlert('The role has successfully been associated with the project.', 'success');
                    $uibModalInstance.close(newProject);
                });
            } else {
                newProject.roles.push($scope.role);
                $scope.$parent.addAlert('The role has successfully been added to the database.', 'success');
                $uibModalInstance.close(newProject);
            }
        } else {
            $scope.$parent.addAlert('The role could not be added to the database.', 'danger');
            $uibModalInstance.dismiss('cancel');

        }
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}).controller('addConfigurationCtrl', function ($scope, $uibModalInstance, project, configurationService) {
    // console.log($scope.$parent);

  var newProject = project;
  $scope.project = project;
  configurationService.getAttributeConfigurations().then(function(response){
    $scope.attributeConfigurations = response.data;
  });
  configurationService.getAssessmentConfigurations().then(function(response){
    $scope.assessmentConfigurations = response.data;
  });
  configurationService.getQuestionConfigurations().then(function(response){
    $scope.questionConfigurations = response.data;
  });
  configurationService.getUiConfigurations().then(function(response){
    $scope.uiConfigurations = response.data;
  });

  $scope.ok = function () {
    $scope.configuration.projectID = project.projectID;

    // add configuration to db and to project then return altered project to main ctrl to add to DOM
    configurationService.post($scope.configuration).then(function(response){
        if(response.status) {
            if ($scope.configuration.configurationID) {
                configurationService.get($scope.configuration.configurationID).then(function(response){
                    newProject.configurations.push(response.data[0]);
                    $scope.$parent.addAlert('The configuration has successfully been associated with the project.', 'success');
                    $uibModalInstance.close(newProject);
                });
            } else {
                var id = response.data.data.id;
                configurationService.get(id).then(function(response){
                    var configuration = response.data[0];
                    newProject.configurations.push(configuration);
                    newProject.configurationsStats.Count++;
                    $scope.$parent.addAlert('The configuration has successfully been added to the database.', 'success');
                    $uibModalInstance.close(newProject);
                });

            }
        } else {
            $scope.$parent.addAlert('The configuration could not be added to the database.', 'danger');
            $uibModalInstance.dismiss('cancel');

        }
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}).controller('addGroupCtrl', function ($scope, $uibModalInstance, project, options, groupService, uiGridConstants, $interval) {
    // console.log($scope.$parent);
  $scope.loaded = false;
  $scope.currentDate= new Date();

  var newProject = project;
  $scope.project = project;
  $scope.group = {};
  $scope.group.configurations = [];

  var selectOptions = {
        configuration: {
            atrConf: [],
            queConf: [],
            uiConf: [],
            artifact: [],
            scenario: [],
            persona: [],
            role: []
        }
    };

  $scope.grid = {
    gridOptions: {
          enableFiltering: true,
          enableSorting: true,
          enableRowHeaderSelection: true,
          multiSelect: true,
          data: project.configurations,
          columnDefs: [
                {
                    name: 'ID',
                    field: 'configurationID',
                    enableFiltering: false
                },
                {
                    name: 'Attributes',
                    field: 'attributeConfigurationName',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: selectOptions.configuration.atrConf
                    }
                },
                {
                    name: 'Questions',
                    field: 'questionConfigurationName',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: selectOptions.configuration.queConf
                    }
                },
                {
                    name: 'Interface',
                    field: 'uiConfigurationName',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: selectOptions.configuration.uiConf
                    }
                },
                {
                    name: 'Artifact',
                    field: 'artifactName',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: selectOptions.configuration.artifact
                    }
                },
                {
                    name: 'Scenario',
                    field: 'scenarioName',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: selectOptions.configuration.scenario
                    }
                },
                {
                    name: 'Persona',
                    field: 'personaName',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: selectOptions.configuration.persona
                    }
                },
                {
                    name: 'Role',
                    field: 'roleName',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: selectOptions.configuration.role
                    }
                },
                {
                    name: 'Start Link',
                    field: 'configurationIDHashed',
                    enableFiltering: false,
                    cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"> <a href="start.php?c={{COL_FIELD CUSTOM_FILTERS}}" target="_blank">Link</a></div>'
                }
            ]
      },
      selected: []
  };
   $scope.grid.gridOptions.onRegisterApi = function(gridApi){
      $scope.grid.gridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope,function(row){
          var msg = 'row selected ' + row.isSelected;
          $scope.grid.selected.push(row.entity);
          $scope.group.configurations.push(row.entity);
          // $scope.grid.selected.passback = {};
      });
  };

  angular.forEach(project.configurations, function(configuration, configurationKey) {
      if(configuration !== undefined && configuration !== null && configuration !== '') {
          var atrConf = {value:configuration.attributeConfigurationName, label: configuration.attributeConfigurationName};
          var queConf = {value:configuration.questionConfigurationName, label: configuration.questionConfigurationName};
          var uiConf = {value:configuration.uiConfigurationName, label: configuration.uiConfigurationName};
          var artifact = {value:configuration.artifactName, label: configuration.artifactName};
          var scenario = {value:configuration.scenarioName, label: configuration.scenarioName};
          var persona = {value:configuration.personaName, label: configuration.personaName};
          var role = {value:configuration.roleName, label: configuration.roleName};
          if(selectOptions.configuration.atrConf.selectOptionIndex(atrConf) == -1) {
              selectOptions.configuration.atrConf.push(atrConf);
          }
          if(selectOptions.configuration.queConf.selectOptionIndex(queConf) == -1) {
              selectOptions.configuration.queConf.push(queConf);
          }
          if(selectOptions.configuration.uiConf.selectOptionIndex(uiConf) == -1) {
              selectOptions.configuration.uiConf.push(uiConf);
          }
          if(selectOptions.configuration.artifact.selectOptionIndex(artifact) == -1) {
              selectOptions.configuration.artifact.push(artifact);
          }
          if(selectOptions.configuration.scenario.selectOptionIndex(scenario) == -1) {
              selectOptions.configuration.scenario.push(scenario);
          }
          if(selectOptions.configuration.persona.selectOptionIndex(persona) == -1) {
              selectOptions.configuration.persona.push(persona);
          }
          if(selectOptions.configuration.role.selectOptionIndex(role) == -1) {
              selectOptions.configuration.role.push(role);
          }
      }
  });


  console.log($scope.grid);

$scope.loaded = true;

  groupService.getTypes().then(function(response){
    $scope.types = response.data;
  });

  $scope.ok = function () {
    // $scope.group.projectID = project.projectID;

    // add group to db and to project then return altered project to main ctrl to add to DOM
    console.log($scope.group);
    groupService.post($scope.group).then(function(response){
        if(response.status) {
            if ($scope.group.groupID) {
                groupService.get($scope.group.groupID).then(function(response){
                    newProject.groups.push(response.data[0]);
                    $scope.$parent.addAlert('The group has successfully been associated with the project.', 'success');
                    $uibModalInstance.close(newProject);
                });
            } else {
                console.log("adding new group");
                var id = response.data.data.id;
                groupService.get(id).then(function(response){
                    console.log(response);
                    var group = response.data[0];
                    newProject.groups.push(group);
                    newProject.groupStats.Count++;

                    $scope.$parent.addAlert('The group has successfully been added to the database.', 'success');
                    $uibModalInstance.close(newProject);
                });

            }
        } else {
            $scope.$parent.addAlert('The group could not be added to the database.', 'danger');
            $uibModalInstance.dismiss('cancel');

        }
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

app.config(function($stateProvider, $urlRouterProvider, LightboxProvider, projectServiceProvider, $stateParamsProvider, statServiceProvider) {
  //
    LightboxProvider.templateUrl = 'partials/lightbox.html';
    LightboxProvider.fullScreenMode = true;
  // For any unmatched url, redirect to /projects
  $urlRouterProvider.otherwise("/projects");
  //
  // Now set up the states
  $stateProvider
    .state('projects', {
      url: "/projects",
      templateUrl: "js/angular/partials/admin/projects.html",
      controller: 'projectsCtrl'
    })
    .state('project', {
      url: "/projects/{id:int}",
      templateUrl: "js/angular/partials/admin/project.html",
      controller: 'projectCtrl',
      resolve: {id: function($stateParams) {return $stateParams.id}},
      // onEnter: function ($stateParams, projectService, statService, $scope) {

      // }
    });
    // .state('projects.assessmentDetails', {
    //   url: "/assessments/:id",
    //   templateUrl: "partials/admin/assessment.html",
    //   controller: 'assessmentCtrl',
    //   params: {
    //           // here we define default value for foo
    //           // we also set squash to false, to force injecting
    //           // even the default value into url
    //           assessment: {
    //             value: null,
    //           },
    //           // this param is not part of url
    //           // it could be passed with $state.go or ui-sref
    //           hiddenParam: 'YES',
    //         },
    // });
    // .state('state2', {
    //   url: "/state2",
    //   templateUrl: "partials/state2.html"
    // })
    // .state('state2.list', {
    //   url: "/list",
    //   templateUrl: "partials/state2.list.html",
    //   controller: function($scope) {
    //     $scope.things = ["A", "Set", "Of", "Things"];
    //   }
    // });
});
app.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});


Array.prototype.selectOptionIndex = function (o) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].value == o.value && this[i].label == o.label) {
            return i;
        }
    }
    return -1;
}

app.filter('orderObjectInt', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});