'use strict';
var app = angular.module('teds.models', []);

app.service('uploadService', ['$http', '$q', function ($http, $q) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);

        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);

app.service('projectService', ['$http', '$q', function ($http, $q) {
    this.get = function(id) {
        var target = "CI/index.php/api/projects/"+id;
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.getAll = function() {
        var target = "CI/index.php/api/projects/";
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.post = function(data) {
        var target = "CI/index.php/api/projects/";
        var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.put = function(data) {
        var target = "CI/index.php/api/projects/"+ data.projectID;
        var data = data;
        return $http.put(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.patch = function(data) {
        var target = "CI/index.php/api/projects/"+ data.projectID;
        var data = data;
        return $http.patch(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.delete = function(id) {
        var target = "CI/index.php/api/projects/"+ id;
        var data = {
            id: id
        };
        return $http.delete(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);

app.service('artifactService', ['$http', '$q', function ($http, $q) {
    this.get = function(id) {
        var target = "CI/index.php/api/artifacts/"+id;
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.getAll = function() {
        var target = "CI/index.php/api/artifacts/";
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.post = function(data) {
        var target = "CI/index.php/api/artifacts/";
        var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.put = function(data) {
        var target = "CI/index.php/api/artifacts/"+ data.artifactID;
        var data = data;
        return $http.put(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.patch = function(data) {
        var target = "CI/index.php/api/artifacts/"+ data.artifactID;
        var data = data;
        return $http.patch(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.delete = function(id) {
        var target = "CI/index.php/api/artifacts/"+ id;
        var data = {
            id: id
        };
        return $http.delete(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);
app.service('artifactTypeService', ['$http', '$q', function ($http, $q) {
    this.get = function(id) {
        var target = "CI/index.php/api/artifact-Types/"+id;
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.getAll = function() {
        var target = "CI/index.php/api/artifact-Types/";
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.post = function(data) {
        var target = "CI/index.php/api/artifact-Types/";
        var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.put = function(data) {
        var target = "CI/index.php/api/artifact-Types/"+ data.artifactTypeID;
        var data = data;
        return $http.put(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.patch = function(data) {
        var target = "CI/index.php/api/artifact-Types/"+ data.artifactTypeID;
        var data = data;
        return $http.patch(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.delete = function(id) {
        var target = "CI/index.php/api/artifact-Types/"+ id;
        var data = {
            id: id
        };
        return $http.delete(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);
app.service('languageService', ['$http', '$q', function ($http, $q) {
    this.get = function(id) {
        var target = "CI/index.php/api/languages/"+id;
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.getAll = function() {
        var target = "CI/index.php/api/languages/";
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.post = function(data) {
        var target = "CI/index.php/api/languages/";
        var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.put = function(data) {
        var target = "CI/index.php/api/languages/"+ data.languageID;
        var data = data;
        return $http.put(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.patch = function(data) {
        var target = "CI/index.php/api/languages/"+ data.languageID;
        var data = data;
        return $http.patch(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.delete = function(id) {
        var target = "CI/index.php/api/languages/"+ id;
        var data = {
            id: id
        };
        return $http.delete(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);
app.service('scenarioService', ['$http', '$q', function ($http, $q) {
    this.get = function(id) {
        var target = "CI/index.php/api/scenarios/"+id;
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.getAll = function() {
        var target = "CI/index.php/api/scenarios/";
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.post = function(data) {
        var target = "CI/index.php/api/scenarios/";
        var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.put = function(data) {
        var target = "CI/index.php/api/scenarios/"+ data.scenarioID;
        var data = data;
        return $http.put(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.patch = function(data) {
        var target = "CI/index.php/api/scenarios/"+ data.scenarioID;
        var data = data;
        return $http.patch(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.delete = function(id) {
        var target = "CI/index.php/api/scenarios/"+ id;
        var data = {
            id: id
        };
        return $http.delete(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);

app.service('personaService', ['$http', '$q', function ($http, $q) {
    this.get = function(id) {
        var target = "CI/index.php/api/personas/"+id;
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.getAll = function() {
        var target = "CI/index.php/api/personas/";
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.post = function(data) {
        var target = "CI/index.php/api/personas/";
        var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.put = function(data) {
        var target = "CI/index.php/api/personas/"+ data.personaID;
        var data = data;
        return $http.put(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.patch = function(data) {
        var target = "CI/index.php/api/personas/"+ data.personaID;
        var data = data;
        return $http.patch(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.delete = function(id) {
        var target = "CI/index.php/api/personas/"+ id;
        var data = {
            id: id
        };
        return $http.delete(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);
app.service('roleService', ['$http', '$q', function ($http, $q) {
    this.get = function(id) {
        var target = "CI/index.php/api/roles/"+id;
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.getAll = function() {
        var target = "CI/index.php/api/roles/";
        var data = {};
        return $http.get(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.post = function(data) {
        var target = "CI/index.php/api/roles/";
        var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.put = function(data) {
        var target = "CI/index.php/api/roles/"+ data.roleID;
        var data = data;
        return $http.put(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.patch = function(data) {
        var target = "CI/index.php/api/roles/"+ data.roleID;
        var data = data;
        return $http.patch(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.delete = function(id) {
        var target = "CI/index.php/api/roles/"+ id;
        var data = {
            id: id
        };
        return $http.delete(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);

// old vanilla services
app.service('userService', ['$http', '$q', function ($http, $q) {

    // validates a email-password pair
    this.validate = function(email, password){
        var target = "models/user.php?f=get";
        var data = {
            email: email,
            password: password
        };
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.findEmail = function(email) {
        var target = "models/user.php?f=getEmail";
        var data = {
            email: email
        };
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    //updates a user
    this.post = function(data){
        var target = "models/user.php?f=post";
        // var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    // deletes the user corrosponding to the ID
    this.delete = function(userID){
        var target = "models/user.php?f=delete";
        // var data = data;
        return $http.post(target, {userID: userID}, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);

app.service('assessmentService', ['$http', '$q', function ($http, $q) {
    // gets a single assessment based on the hashed ID
    this.get = function(data){
        var target = "models/assessment.php?f=get";
        // var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    // gets an assessment based on the unique key (userID, ConfigurationID)
    this.getByUserConf = function(data){
        var target = "models/assessment.php?f=getByUserConf";
        // var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    // updates an assessments user
    this.updateUser = function(data){
        var target = "models/assessment.php?f=updateUser";
        // var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    // saves the assessment
    this.save = function(data){
        var target = "models/assessment.php?f=save";
        // var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    // saves the assessment
    this.finish = function(data){
        var target = "models/assessment.php?f=finish";
        // var data = data;
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.delete = function(id) {
        var target = "models/assessment.php?f=delete";
        var data = {
            assessmentID: id
        };
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

}]);

app.service('ratingService', ['$http', '$q', function ($http, $q) {

    //adds a rating
    this.put = function(data){
        var target = "models/rating.php?f=put";
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);

app.service('responseService', ['$http', '$q', function ($http, $q) {

    //adds a response
    this.put = function(data){
        var target = "models/response.php?f=put";
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);

app.service('commentService', ['$http', '$q', function ($http, $q) {

    //adds a comment
    this.put = function(data){
        var target = "models/comment.php?f=put";
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.delete = function(data){
        var target = "models/comment.php?f=delete";
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);

app.service('screenshotService', ['$http', '$q', function ($http, $q) {

    //adds a screenshot
    this.put = function(data){
        var target = "models/screenshot.php?f=put";
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }

    this.delete = function(data){
        var target = "models/screenshot.php?f=delete";
        return $http.post(target, data, {
        }).success(function(response){
            return response;
        }).error(function(response){
            return response;
        });
    }
}]);