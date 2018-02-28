angular.module('InnService', []).factory('Inn', ['$http', function($http) {
    return {
        // call to get all inns
        get : function() {
            return $http.get('/api/inns');
        },

        // call to POST and create a new inn
        create : function(innData) {
            return $http.post('/api/inns', innData);
        },

        // call to PUT and update a inn
        update : function(innData) {
          var g = jQuery.parseJSON(innData);
            return $http.put('/api/inns/' + g._id, innData);
        },

        // call to DELETE a inn
        delete : function(id) {
            return $http.delete('/api/inns/' + id);
        }
    }
}]);
