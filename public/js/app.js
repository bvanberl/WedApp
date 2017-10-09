var app = angular.module('wedapp',
  ['ngRoute',
  'ngMaterial',
  'ngAnimate',
  'ngTouch',
  'ngFileUpload',
  'thatisuday.ng-image-gallery',
  'appRoutes',
  'HomeCtrl',
  'InformationCtrl',
  'GuestCtrl',
  'GuestService',
  'AnnouncementCtrl',
  'AnnouncementService',
  'PictureCtrl',
  'PictureService',
  'FileUploadCtrl']);

app.value('WEDDING_DATE', new Date("Sep 8, 2018 13:00:00"));
