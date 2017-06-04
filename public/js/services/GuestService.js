angular.module('GuestService', []).factory('Guest', ['$http', function($http) {
    return {
        // call to get all guests
        get : function() {
            return $http.get('/api/guests');
        },

        // call to POST and create a new guest
        create : function(guestData) {
            return $http.post('/api/guests', guestData);
        },

        // call to PUT and update a guest
        update : function(guestData) {
          var g = jQuery.parseJSON(guestData);
            return $http.put('/api/guests/' + g._id, guestData);
        },

        // call to DELETE a guest
        delete : function(id) {
            return $http.delete('/api/guests/' + id);
        }
    }
}]);
