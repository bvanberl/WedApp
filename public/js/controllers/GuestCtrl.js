angular.module('GuestCtrl', ['ngMaterial']).controller('GuestController', ['$scope', 'Guest', '$mdDialog', function($scope, Guest, $mdDialog) {

    get();
    $scope.tagline = "Number of guests attending is unknown.";
    $scope.iguestname = "";
    $scope.irespondedflag = true;
    $scope.inumattending = 0;
    $scope.modal = document.getElementById('new-guest-modal');

    // Return yes if guest has responded; return no otherwise
    $scope.dispResponse = function(responded){
      return (responded ? "yes" : "no");
    };

    // If guest is attending, display number of people coming
    $scope.dispNum = function(responded, numAttending){
      return (responded ? numAttending : "unknown");
    }

    // Get sum of number of guests attending.
    $scope.getGuestCount = function(){
      if(Object.keys( $scope.guests ).length > 0) {
        var sum = 0;
        for(i = 0; i < $scope.guests.length; i++)
        {
          sum += $scope.guests[i].numAttending;
        }
        return sum;
      }
      else {
        return "unknown";
      }
    }


    $scope.openNewGuestModal = function(ev) {
      //$scope.modal.modal("show");
      $mdDialog.show({
        controller: NewGuestDialogController,
        templateUrl: '../../views/modals/new-guest-modal.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(guestData) {
          $scope.addGuest(guestData);
        }, function() {
        });
    }

    $scope.openUpdateGuestModal = function(ev, i) {
      //$scope.modal.modal("show");
      var g = $scope.guests[i];
      $mdDialog.show({
        locals:{
          id: g._id,
          name: g.name,
          responded: g.responded,
          numAttending: g.numAttending,
          code: g.authCode
        },
        controller: UpdateGuestDialogController,
        templateUrl: '../../views/modals/update-guest-modal.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(guestData) {
          $scope.updateGuest(guestData);
        }, function() {
        });
    }

    // Create new guest with data returned from hiding the modal.
    $scope.addGuest = function(guestData){
      Guest.create(guestData)
        .then(function (response) {
          get(); // Refresh table
        }, function (error) {
          $scope.status = 'Unable to create new guest: ' + error.message;
        }); // Add new guest to database.
    }

    // Update the guest with data returned from hiding the modal.
    $scope.updateGuest = function(guestData){
      Guest.update(guestData)
        .then(function (response) {
          get(); // Refresh table
        }, function (error) {
          $scope.status = 'Unable to update guest: ' + error.message;
        }); // Add new guest to database.
    }

    // Get all guests
    function get() {
        Guest.get()
            .then(function (response) {
                $scope.guests = response.data;
                sortGuests('name', true);
                $scope.tagline = $scope.getGuestCount() + " guests confirmed attending.";
            }, function (error) {
                $scope.status = 'Unable to load guest data: ' + error.message;
            });
    }

    /*
    Comparator for sorting Guest objects
    */
    function sortGuests(prop, asc) {
        $scope.guests = $scope.guests.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
  }

  $scope.delete = function(id) {
    Guest.delete(id)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to delete guest data: ' + error.message;
      });
  }


    function NewGuestDialogController($scope, $mdDialog) {
      $scope.iguestname = "";
      $scope.respbox = {
        irespondedflag: true
      };
      $scope.inumattending = 0;
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.responseBehaviour = function() {
        if(!$scope.respbox.irespondedflag) {
          $scope.inumattending = 0;
        }
      }
      $scope.submitData = function() {
        var code = "";
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 0; i < 4; i++) {
          code += chars[Math.floor(Math.random() * chars.length)];
        }
        var responded = "";
        if($scope.respbox.irespondedflag == false){
          $scope.inumattending = 0;       // If response not received, assume 0 people are in attendance
        }
        var guestData =
          '{"name":"' + $scope.iguestname + '",' +
          '"responded":"' + $scope.irespondedflag + '",' +
          '"numAttending":"' + $scope.inumattending + '",' +
          '"authCode":"' + code + '"' +
        '}'; // The guest data
        $mdDialog.hide(guestData);
      };
    }


    function UpdateGuestDialogController($scope, $mdDialog, id, name, responded, numAttending, code) {
      $scope.iid = id;
      $scope.iguestname = name;
      $scope.respbox = {
        irespondedflag: responded
      };
      $scope.inumattending = numAttending;
      $scope.code = code;
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.responseBehaviour = function() {
        if(!$scope.respbox.irespondedflag) {
          $scope.inumattending = 0;
        }
      }
      $scope.submitData = function() {
        var responded = "";
        if($scope.irespondedflag == false){
          $scope.inumattending = 0;       // If response not received, assume 0 people are in attendance
        }
        var guestData =
          '{"_id":"' + $scope.iid + '",' +
          '"name":"' + $scope.iguestname + '",' +
          '"responded":"' + $scope.irespondedflag + '",' +
          '"numAttending":"' + $scope.inumattending + '",' +
          '"authCode":"' + $scope.code + '"' +
        '}'; // The guest data
        $mdDialog.hide(guestData);
      };
    }


}]);
