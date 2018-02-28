angular.module('InnCtrl', ['ngMaterial']).controller('InnController', ['$scope', '$rootScope', 'Inn', '$mdDialog', 'authentication', function($scope, $rootScope, Inn, $mdDialog, authentication) {
  get();

  // Get all inns
  function get() {
      Inn.get()
          .then(function (response) {
              $scope.inns = response.data;
              sortInns('name', true);
          }, function (error) {
              $scope.status = 'Unable to load inn data: ' + error.message;
          });
  }

  // Comparator for sorting Inn objects
  function sortInns(prop, asc) {
      $scope.inns = $scope.inns.sort(function(a, b) {
      if (asc) {
          return (a[prop] > b[prop]) ? -1 : ((a[prop] < b[prop]) ? 1 : 0);
      } else {
          return (b[prop] > a[prop]) ? -1 : ((b[prop] < a[prop]) ? 1 : 0);
      }
    });
  }

  // Deletes an inn by ID
  $scope.delete = function(id) {
    Inn.delete(id)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to delete inn data: ' + error.message;
      });
  }


  $scope.openNewInnModal = function(ev) {
    //$scope.modal.modal("show");
    $mdDialog.show({
      controller: NewInnDialogController,
      templateUrl: '../../views/modals/new-inn-modal.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(innData) {
        $scope.addInn(innData);
      }, function() {
      });
  }

  $scope.openUpdateInnModal = function(ev, i) {
    //$scope.modal.modal("show");
    var inn = $scope.inns[i];
    $mdDialog.show({
      locals:{
        id: inn._id,
        name: inn.name,
        address: inn.address,
        phone: inn.phoneNumber,
        url: inn.url
      },
      controller: UpdateInnDialogController,
      templateUrl: '../../views/modals/update-inn-modal.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(innData) {
        $scope.updateInn(innData);
      }, function() {
      });
  }

  // Create new inn with data returned from hiding the modal.
  $scope.addInn = function(innData){
    Inn.create(innData)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to create new inn: ' + error.message;
      }); // Add new inn to database.
  }

  // Update the inn with data returned from hiding the modal.
  $scope.updateInn = function(innData){
    Inn.update(innData)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to update inn: ' + error.message;
      }); // Add new inn to database.
  }


  function NewInnDialogController($scope, $mdDialog) {
    $scope.iinncontent = "";
    $scope.focused = true;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.submitData = function() {
      var innData =
        '{"name":"' + $scope.iinnname + '",' +
        '"address":"' + $scope.iinnaddress + '",' +
        '"phoneNumber":"' + $scope.iinnphone + '",' +
        '"url":"' + $scope.iinnurl + '"' +
      '}'; // The inn data
      $mdDialog.hide(innData);
    };
  }


  function UpdateInnDialogController($scope, $mdDialog, id, name, address, phone, url) {
    $scope.iid = id;
    $scope.iinnname = name;
    $scope.iinnaddress = address;
    $scope.iinnphone = phone;
    $scope.iinnurl = url;
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.submitData = function() {
      var curDT = new Date(); // Get current date and time.
      var innData =
        '{"_id":"' + $scope.iid + '",' +
        '"name":"' + $scope.iinnname + '",' +
        '"address":"' + $scope.iinnaddress + '",' +
        '"phoneNumber":"' + $scope.iinnphone + '",' +
        '"url":"' + $scope.iinnurl + '"' +
      '}'; // The inn data
      $mdDialog.hide(innData);
    };
  }

}]);
