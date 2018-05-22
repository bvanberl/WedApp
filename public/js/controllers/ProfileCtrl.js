(function() {

  angular
    .module('wedapp')
    .controller('ProfileCtrl', ProfileCtrl);

  ProfileCtrl.$inject = ['$rootScope', '$location', 'meanData', 'authentication'];
  function ProfileCtrl($rootScope, $location, meanData, authentication) {

    $rootScope.logout = function(){
      authentication.logout();
      $rootScope.isLoggedIn = authentication.isLoggedIn();
    }

    var vm = this;

    vm.user = {};

    meanData.getProfile()
      .then(function(data) {
        vm.user = data.data;
      });
  }

})();
