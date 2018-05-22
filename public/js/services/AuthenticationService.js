(function () {

  angular
    .module('wedapp')
    .service('authentication', authentication);

  authentication.$inject = ['$http', '$window', '$location'];
  function authentication ($http, $window, $location) {

    var saveToken = function (token) {
      $window.localStorage['wedapp-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['wedapp-token'];
    };

    var isLoggedIn = function() {
      var token = getToken();
      var payload;

      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };

    register = function(user) {
      return $http.post('/api/register', user)
      .then(function(res){
        if(res.status === 200){
          saveToken(res.data.token);
        }
      });
    };

    login = function(user) {
      return $http.post('/api/login', user).then(function(res) {
        if(res.status === 200){
          saveToken(res.data.token);
        }
        else{
          console.log('Incorrect credentials!');
        }
      });
    };

    logout = function() {
      $window.localStorage.removeItem('wedapp-token');
      $location.path('/');
    };

    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      logout : logout
    };
  }


})();
