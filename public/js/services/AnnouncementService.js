angular.module('AnnouncementService', []).factory('Announcement', ['$http', function($http) {
    return {
        // call to get all announcements
        get : function() {
            return $http.get('/api/announcements');
        },

        // call to POST and create a new announcement
        create : function(announcementData) {
            return $http.post('/api/announcements', announcementData);
        },

        // call to PUT and update a announcement
        update : function(announcementData) {
          var g = jQuery.parseJSON(announcementData);
            return $http.put('/api/announcements/' + g._id, announcementData);
        },

        // call to DELETE a announcement
        delete : function(id) {
            return $http.delete('/api/announcements/' + id);
        }
    }
}]);
