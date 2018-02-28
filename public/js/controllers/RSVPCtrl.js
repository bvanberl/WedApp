angular.module('RSVPCtrl', ['ngAnimate', 'ngMessages']).controller('RSVPController', ['$scope', '$rootScope', '$window', '$location', '$mdDialog', 'Guest', 'authentication', function($scope, $rootScope, $window, $location, $mdDialog, Guest, authentication) {

  // Initialization
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.panel = document.getElementById("guest-info");
  $scope.isAttending = false;

  $rootScope.logout = function(){
    authentication.logout();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
  };

  $scope.numChildrenSet = function() {
    if($scope.potGuest.numChildAttending === 0) {
      $scope.potGuest.numChildMeals = 0;
    }
  }

  $scope.expand = function() {
    console.log($scope.isAttending);
    if ($scope.isAttending === true){
      $scope.panel.style.maxHeight = $scope.panel.scrollHeight + "px";
    } else {
      $scope.panel.style.maxHeight = "0px";
    }
  }

  $scope.submit = function($event) {
    // Assemble guest's RSVP information
    if($scope.potGuest.authCode) {
      var guestData;
      if($scope.isAttending){
        guestData =
          '{"authCode":"' + $scope.potGuest.authCode + '",' +
            '"numAdults":"' + parseInt($scope.potGuest.numAdultAttending) + '",' +
            '"numChildren":"' + parseInt($scope.potGuest.numChildAttending) + '",' +
            '"numChildrenMeals":"' + parseInt($scope.potGuest.numChildrenMeals) + '",' +
            '"dietaryRestrictions":"' + $scope.potGuest.dietaryRestrictions + '"' +
        '}';
      }
      else {
        guestData =
          '{"authCode":"' + $scope.potGuest.authCode + '",' +
            '"numAdults":"0",' +
            '"numChildren":"0",' +
            '"numChildrenMeals":"0",' +
            '"dietaryRestrictions":"N/A"' +
        '}';
      }
    }

    // Attempt to RSVP this guest.
    Guest.rsvp(guestData)
      .then(function (response) {
          console.log(response);
          if(response.status === 200) {

            if(response.message == "Complete"){
              // Show confirm dialog.
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#rsvp-btn')))
                  .clickOutsideToClose(true)
                  .title('RSVP successful!')
                  .textContent('Your response was recorded. If you need to change your attendance status, just RSVP again.')
                  .ariaLabel('RSVP Successful')
                  .ok('Done')
              ).then(function() {
                    $location.path('/');
                  }, function() {
                  });
            }
            else {
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.querySelector('#rsvp-btn')))
                  .clickOutsideToClose(true)
                  .title('RSVP unsuccessful!')
                  .textContent('Please ensure that you entered your invitation code as it appears on your invitation, then try again.')
                  .ariaLabel('RSVP Unuccessful')
                  .ok('OK')
              );
            }
          }
      }, function (error) {
        console.log("RSVP unsuccessful.")
      });
  }
}]);
