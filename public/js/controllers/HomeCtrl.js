angular.module('HomeCtrl', ['ngAnimate']).controller('HomeController', ['$scope', '$rootScope', '$location', '$anchorScroll', '$interval', '$mdDialog', 'WEDDING_DATE', 'authentication', 'Guest', function($scope, $rootScope, $location, $anchorScroll, $interval, $mdDialog, WEDDING_DATE, authentication, Guest) {
    $rootScope.isLoggedIn = authentication.isLoggedIn();
    $scope.countdowndate = WEDDING_DATE.getTime();
    $scope.show = true;
    updateTimeLeft();
    $interval(updateTimeLeft, 1000);

    $rootScope.logout = function(){
      authentication.logout();
      $rootScope.isLoggedIn = authentication.isLoggedIn();
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

    $scope.expandDown = function() {
      document.querySelector('#info-caption').scrollIntoView({
        behavior: 'smooth',
        block: "start",
        inline: "nearest"
      });
      console.log("rtyh");
    }
}]);
