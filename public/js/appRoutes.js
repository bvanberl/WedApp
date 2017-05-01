angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/guests', {
            templateUrl: 'views/guest.html',
            controller: 'GuestController'
        });

    $locationProvider.html5Mode(true);

}]);
