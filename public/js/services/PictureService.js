angular.module('PictureService', []).factory('Picture', ['$http', function($http) {
    return {
        // call to get all pictures
        get : function() {
            return $http.get('/api/pictures');
        },

        // call to POST and create a new picture
        create : function(pictureData) {
            return $http.post('/api/pictures', pictureData);
        },

        // call to PUT and update a picture
        update : function(pictureData) {
          var g = jQuery.parseJSON(pictureData);
            return $http.put('/api/pictures/' + g._id, pictureData);
        },

        // call to DELETE a picture
        delete : function(id, filename) {
            return $http.delete('/api/pictures/' + id + '/' + filename);
        }
    }
}]);
