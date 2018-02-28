angular.module('NavCtrl', []).controller('NavCtrl',['$scope', '$rootScope', '$window', '$location', '$mdSidenav', '$mdMenu', 'authentication', function($scope, $rootScope, $window, $location, $mdSidenav, $mdMenu, authentication){
  // Initialization
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.toggle = buildToggler('left');

  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    var path = $location.path();
    if(path === "/" || path === "/home"){
      document.getElementById("mobile-menu-btn").style.position = "fixed";
    }
    else {
      document.getElementById("mobile-menu-btn").style.position = "relative";
    }
    console.log("got here");
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
