angular.module('SongListCtrl', ['ngMaterial']).controller('SongListController', ['$scope', '$rootScope', '$location', 'Song', 'authentication', function($scope, $rootScope, $location, Song, authentication) {

    get();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
    if(!$rootScope.isLoggedIn){
      $location.path('/');
    }

    $rootScope.logout = function(){
      authentication.logout();
      $rootScope.isLoggedIn = authentication.isLoggedIn();
    };

    // Get sum of number of songs attending.
    $scope.getSongCount = function(){
      if(Object.keys( $scope.song_requests ).length > 0) {
        return Object.keys( $scope.song_requests ).length;
      }
      else {
        return "unknown";
      }
    };

    // Get all songs
    function get() {
        Song.get()
            .then(function (response) {
                $scope.song_requests = response.data;
                sortSongs('noRequests', false);
            }, function (error) {
                $scope.status = 'Unable to load song data: ' + error.message;
            });
    }

    /*
    Comparator for sorting Song objects
    */
    function sortSongs(prop, asc) {
        $scope.song_requests = $scope.song_requests.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
  }

  $scope.delete = function(id) {
    Song.delete(id)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to delete song data: ' + error.message;
      });
  }

}]);
