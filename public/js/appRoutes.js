angular.module('appRoutes', ['ngRoute']).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/guests', {
            templateUrl: 'views/guest.html',
            controller: 'GuestController'
        })
        .when('/announcements', {
            templateUrl: 'views/announcement.html',
            controller: 'AnnouncementController'
        });

    $locationProvider.html5Mode(true);

}]);
