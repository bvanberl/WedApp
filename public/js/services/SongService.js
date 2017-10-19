angular.module('SongService', []).factory('Song', ['$http', function($http) {
    return {
        // call to get all songs
        get : function() {
            return $http.get('/api/songs');
        },

        // call to POST and create a new song
        create : function(songData) {
            return $http.post('/api/songs', songData);
        },

        // call to PUT and update a song
        update : function(songData) {
          var g = jQuery.parseJSON(songData);
            return $http.put('/api/songs/' + g._id, songData);
        },

        // call to DELETE a song
        delete : function(id) {
            return $http.delete('/api/songs/' + id);
        },

        // search for songs
        getSongs : function(keywords, searchType) {
            keywords = keywords.replace(" ", "%20");
            return $http.get('/api/songsearch/' + searchType + '/' + keywords);
        },
    }
}]);
