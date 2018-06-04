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

    // Change navbar if in admin panel
    if(path.indexOf("admin") >= 0 || path.indexOf("rsvp") >= 0) {
      document.getElementById("top-navbar").classList.remove("transparent-navbar");
    }
    else {
      document.getElementById("top-navbar").classList.add("transparent-navbar");
    }

    // Change colour of font in navbar if on RSVP
    var navLinks = document.getElementsByClassName("navbar-link");
    if(path.indexOf("rsvp") >= 0) {
      for (var i = 0; i < navLinks.length; i++ ) {
        navLinks[i].style.color = "black";
      }
      document.getElementById("admin-btn").style.color = "black";
    }
    else {
      for (var i = 0; i < navLinks.length; i++ ) {
        navLinks[i].style.color = "white";
      }
      document.getElementById("admin-btn").style.color = "white";
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
