angular.module('NavCtrl', []).controller('NavCtrl',['$scope', '$rootScope', '$window', '$location', '$mdSidenav', '$mdMenu', 'authentication', function($scope, $rootScope, $window, $location, $mdSidenav, $mdMenu, authentication){
  // Initialization
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.toggle = buildToggler('left');

  // Changes to navbar or mobile menu button when on the home route
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    var path = $location.path();
    if(path === "/" || path === "/home"){
      document.getElementById("mobile-menu-btn").style.position = "fixed";
    }
    else {
      document.getElementById("mobile-menu-btn").style.position = "relative";
    }

    if(path.indexOf("admin") >= 0 || path.indexOf("rsvp") >= 0) {
      document.getElementById("top-navbar").classList.remove("transparent-navbar");
    }
    else {
      document.getElementById("top-navbar").classList.add("transparent-navbar");
    }
  });

  $scope.isOpen = function(){
        return $mdSidenav('left').isOpen();
      };

  $scope.closeSidenav = function () {
      $mdSidenav('left').close();
  };

  $scope.openAdminMenu = function($mdMenu, ev) {
      $mdMenu.open(ev);
  };

  $rootScope.logout = function(){
    authentication.logout();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
  };

  function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
          });
      };
    }
}]);
