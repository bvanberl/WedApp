angular.module('RegistryCtrl',[]).controller('RegistryController', ['$scope', '$rootScope', '$location', 'authentication', function($scope, $rootScope, $location, authentication) {

  // Initialization
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.input_type = "track";

  $rootScope.logout = function(){
    authentication.logout();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
  };

}]);
