angular.module('SongCtrl',[]).controller('SongController', ['$scope', '$rootScope', '$location', '$mdDialog', 'Song', 'authentication', function($scope, $rootScope, $location, $mdDialog, Song, authentication) {

  // Initialization
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.input_type = "track";

  $rootScope.logout = function(){
    authentication.logout();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
  };

  $scope.onKeywordsChangedEvent = function() {
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
        if(response.status === 200) {
          // Display success dialog
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector("song-modal-parent")))
              .clickOutsideToClose(true)
              .title('Song requested!')
              .textContent('Your song request was successful! Feel free to request more.')
              .ariaLabel('Song requested')
              .ok('Done')
          );
        }
        else {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector("song-modal-parent")))
              .clickOutsideToClose(true)
              .title('Song request unsuccessful!')
              .textContent('Something went wrong. Try again later!')
              .ariaLabel('Song request unuccessful')
              .ok('OK')
          );
        }
      }, function (error) {
        $scope.status = 'Unable to create new song request: ' + error.message;
      });
  }

}]);
