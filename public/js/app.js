var app = angular.module('wedapp',
  ['ngRoute',
  'ngMaterial',
  'appRoutes',
  'HomeCtrl',
  'GuestCtrl',
  'GuestService',
  'AnnouncementCtrl',
  'AnnouncementService']);
app.value('WEDDING_DATE', new Date("Mar 16, 2019 14:00:00"));
