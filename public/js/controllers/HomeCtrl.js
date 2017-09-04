angular.module('HomeCtrl', ['ngAnimate']).controller('HomeController', ['$scope', '$rootScope', '$interval', '$mdDialog', 'WEDDING_DATE', 'authentication', 'Guest', function($scope, $rootScope, $interval, $mdDialog, WEDDING_DATE, authentication, Guest) {
    $rootScope.isLoggedIn = authentication.isLoggedIn();
    $scope.countdowndate = WEDDING_DATE.getTime();
    $scope.show = true;
    updateTimeLeft();
    $interval(updateTimeLeft, 1000);

    $rootScope.logout = function(){
      authentication.logout();
      $rootScope.isLoggedIn = authentication.isLoggedIn();
    }

    $scope.openRSVPModal = function(ev) {
      //$scope.modal.modal("show");
      $mdDialog.show({
        controller: RSVPGuestDialogController,
        templateUrl: '../../views/modals/rsvp-modal.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(guestData) {
          $scope.RSVPGuest(guestData);
        }, function() {
        });
    }


    // Update the guest with data returned from hiding the modal.
    $scope.RSVPGuest = function(guestData){
      Guest.rsvp(guestData)
        .then(function (response) {
        }, function (error) {
          console.log("RSVP unsuccessful.")
        });
    }


    function RSVPGuestDialogController($scope, $mdDialog) {
      $scope.authCode = '';
      $scope.numAttending = '';
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.submitData = function() {
        var guestData =
          '{"authCode":"' + $scope.authCode + '",' +
            '"numAttending":"' + parseInt($scope.numAttending) + '"' +
        '}'; // The guest data
        $mdDialog.hide(guestData);
      };
    }


    function updateTimeLeft(){
      var now = new Date().getTime(); // Current datetime.
      var deltaT = $scope.countdowndate - now; // Get time between now and the wedding.

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(deltaT / 86400000);
      var hours = Math.floor((deltaT % 86400000) / 3600000);
      var minutes = Math.floor((deltaT % 3600000) / 60000);
      var seconds = Math.floor((deltaT % 60000) / 1000);

      var innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s "; // Update time left in the view
      $scope.timeleft = innerHTML;

      // If the count down is finished, write some text
      if (deltaT < 0) {
        clearInterval(x);
        $scope.timeleft = "The countdown is over";
      }
    }
}]);
