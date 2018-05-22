(function () {

  angular
    .module('wedapp')
    .controller('RegisterCtrl', RegisterCtrl);

  RegisterCtrl.$inject = ['$rootScope', '$location', 'authentication'];
  function RegisterCtrl($rootScope, $location, authentication) {

    if(!authentication.isLoggedIn()){
      $location.path('/');
    }

    $rootScope.logout = function(){
      authentication.logout();
      $rootScope.isLoggedIn = authentication.isLoggedIn();
    };
    var vm = this;

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      console.log('Submitting registration');
      authentication
        .register(vm.credentials)
        .then(function(){
          setTimeout(function (){
            $location.path('admin/profile');
          }, 300);
        });
    };

  }

})();
