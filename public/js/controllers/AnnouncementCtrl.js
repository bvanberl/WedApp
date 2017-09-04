angular.module('AnnouncementCtrl', ['ngMaterial']).controller('AnnouncementController', ['$scope', '$rootScope', 'Announcement', '$mdDialog', 'authentication', function($scope, $rootScope, Announcement, $mdDialog, authentication) {

  // Initialization
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  get();

  $rootScope.logout = function(){
    authentication.logout();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
  };

  // Get all announcements
  function get() {
      Announcement.get()
          .then(function (response) {
              $scope.announcements = response.data;
              sortAnnouncements('datetime', true);
          }, function (error) {
              $scope.status = 'Unable to load announcement data: ' + error.message;
          });
  }

  // Comparator for sorting Announcement objects
  function sortAnnouncements(prop, asc) {
      $scope.announcements = $scope.announcements.sort(function(a, b) {
      if (asc) {
          return (a[prop] > b[prop]) ? -1 : ((a[prop] < b[prop]) ? 1 : 0);
      } else {
          return (b[prop] > a[prop]) ? -1 : ((b[prop] < a[prop]) ? 1 : 0);
      }
    });
  }

  // Deletes an announcement by ID
  $scope.delete = function(id) {
    Announcement.delete(id)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to delete announcement data: ' + error.message;
      });
  }


  $scope.openNewAnnouncementModal = function(ev) {
    //$scope.modal.modal("show");
    $mdDialog.show({
      controller: NewAnnouncementDialogController,
      templateUrl: '../../views/modals/new-announcement-modal.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(announcementData) {
        $scope.addAnnouncement(announcementData);
      }, function() {
      });
  }

  $scope.openUpdateAnnouncementModal = function(ev, i) {
    //$scope.modal.modal("show");
    var a = $scope.announcements[i];
    $mdDialog.show({
      locals:{
        id: a._id,
        datetime: a.datetime,
        content: a.content
      },
      controller: UpdateAnnouncementDialogController,
      templateUrl: '../../views/modals/update-announcement-modal.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(announcementData) {
        $scope.updateAnnouncement(announcementData);
      }, function() {
      });
  }

  // Create new announcement with data returned from hiding the modal.
  $scope.addAnnouncement = function(announcementData){
    Announcement.create(announcementData)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to create new announcement: ' + error.message;
      }); // Add new announcement to database.
  }

  // Update the announcement with data returned from hiding the modal.
  $scope.updateAnnouncement = function(announcementData){
    Announcement.update(announcementData)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to update announcement: ' + error.message;
      }); // Add new announcement to database.
  }


  function NewAnnouncementDialogController($scope, $mdDialog) {
    $scope.iannouncementcontent = "";
    $scope.focused = true;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.submitData = function() {
      var curDT = new Date(); // Get current date and time.
      var announcementData =
        '{"datetime":"' + curDT + '",' +
        '"content":"' + $scope.iannouncementcontent + '"' +
      '}'; // The announcement data
      $mdDialog.hide(announcementData);
    };
  }


  function UpdateAnnouncementDialogController($scope, $mdDialog, id, content) {
    $scope.iid = id;
    $scope.iannouncementcontent = content;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.submitData = function() {
      var curDT = new Date(); // Get current date and time.
      var announcementData =
        '{"_id":"' + $scope.iid + '",' +
        '"datetime":"' + curDT + '",' +
        '"content":"' + $scope.iannouncementcontent + '"' +
      '}'; // The announcement data
      $mdDialog.hide(announcementData);
    };
  }

}]);
