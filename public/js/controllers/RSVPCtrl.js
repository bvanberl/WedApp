angular.module('RSVPCtrl', ['ngAnimate', 'ngMessages']).controller('RSVPController', ['$scope', '$rootScope', '$window', '$location', '$mdDialog', 'Guest', 'RSVP_DEADLINE', 'authentication', function($scope, $rootScope, $window, $location, $mdDialog, Guest, RSVP_DEADLINE, authentication) {

  // Initialization
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.panel = document.getElementById("guest-info");
  $scope.isAttending = false;
  $scope.rsvpDeadline = RSVP_DEADLINE.getTime();

  $rootScope.logout = function(){
    authentication.logout();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
  };

  $scope.numChildrenSet = function() {
    if($scope.potGuest.numChildAttending === 0) {
      $scope.potGuest.numChildrenMeals = 0;
    }
  }

  $scope.expand = function() {
    if ($scope.isAttending === true){
      $scope.panel.style.maxHeight = $scope.panel.scrollHeight + "px";
    } else {
      $scope.panel.style.maxHeight = "0px";
    }
  }

  $scope.submit = function($event) {

    var now = new Date().getTime();
    if(now > $scope.rsvpDeadline) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#rsvp-btn')))
          .clickOutsideToClose(true)
          .title('RSVP unsuccessful!')
          .textContent('The deadline to RSVP online has passed. Please contact the bride or groom directly.')
          .ariaLabel('RSVP Unuccessful')
          .ok('OK')
      );
      return;
    }

    // Assemble guest's RSVP information
    if($scope.potGuest.authCode) {
      var guestData;
      if($scope.isAttending){
        if(!$scope.potGuest.numVegMeals) {
          $scope.potGuest.numVegMeals = 0;
        }
        guestData =
          '{"authCode":"' + $scope.potGuest.authCode + '",' +
            '"numAdults":"' + parseInt($scope.potGuest.numAdultAttending) + '",' +
            '"numChildren":"' + parseInt($scope.potGuest.numChildAttending) + '",' +
            '"numChildrenMeals":"' + parseInt($scope.potGuest.numChildrenMeals) + '",' +
            '"numVegMeals":"' + $scope.potGuest.numVegMeals + '"' +
        '}';
      }
      else {
        guestData =
          '{"authCode":"' + $scope.potGuest.authCode + '",' +
            '"numAdults":"0",' +
            '"numChildren":"0",' +
            '"numChildrenMeals":"0",' +
            '"numVegMeals":"0"' +
        '}';
      }
    }

    // Attempt to RSVP this guest.
    Guest.rsvp(guestData)
      .then(function (response) {
          if(response.status === 200) {
            if(response.data.message == "SUCCESS"){
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
