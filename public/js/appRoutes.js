angular.module('appRoutes', ['ngRoute']).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        })
        .when('/information', {
            templateUrl: 'views/information.html',
            controller: 'InformationController'
        })
        .when('/pictures', {
            templateUrl: 'views/picture.html',
            controller: 'PictureController'
        })
        .when('/guests', {
            templateUrl: 'views/guest.html',
            controller: 'GuestController'
        })
        .when('/inns', {
            templateUrl: 'views/inn.html',
            controller: 'InnController'
        })
        .when('/songs', {
            templateUrl: 'views/song.html',
            controller: 'SongController'
        })
        .when('/rsvp', {
            templateUrl: 'views/rsvp.html',
            controller: 'RSVPController'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'vm'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterCtrl',
            controllerAs: 'vm'
        })
        .when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl',
            controllerAs: 'vm'
        })
        .when('/songlist', {
            templateUrl: 'views/songlist.html',
            controller: 'SongListController'
        });

    $locationProvider.html5Mode(true);

}]);
