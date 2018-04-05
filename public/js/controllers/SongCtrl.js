angular.module('SongCtrl',[]).controller('SongController', ['$scope', '$rootScope', '$location', '$mdDialog', 'Song', 'authentication', function($scope, $rootScope, $location, $mdDialog, Song, authentication) {

  // Initialization
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.input_type = "track";

  $rootScope.logout = function(){
    authentication.logout();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
  };

  $scope.onKeywordsChangedEvent = function() {
      console.log($scope.search_terms)
    Song.getSongs($scope.search_terms, $scope.input_type)
        .then(function (response) {
          $scope.results = response.data.results;
        }, function (error) {
            $scope.status = 'Unable to load search results: ' + error.message;
        });
  };

  $scope.requestSong = function(request) {
    var songData = '{"name":"' + request.name + '","artist":"' + request.artist + '"}';
    Song.create(songData)
      .then(function (response) {
        $scope.search_terms = "";
        $scope.onKeywordsChangedEvent();

        // Display success dialog
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#song-search-bar')))
            .clickOutsideToClose(true)
            .title('Song requested!')
            .textContent('Your song request was recorded. It may play at the wedding!')
            .ariaLabel('Song requested')
            .ok('Done')
        );
      }, function (error) {
        $scope.status = 'Unable to create new song request: ' + error.message;
      });
  }

}]);
