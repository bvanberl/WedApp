angular.module('GuestCtrl', ['ngMaterial', 'ngMessages']).controller('GuestController', ['$scope', '$rootScope', '$location', 'Guest', '$mdDialog', 'authentication', function($scope, $rootScope, $location, Guest, $mdDialog, authentication) {

    get();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
    if(!$rootScope.isLoggedIn){
      $location.path('/');
    }
    $scope.tagline = "Number of guests attending is unknown.";
    $scope.iguestname = "";
    $scope.irespondedflag = false;
    $scope.inumattending = 0;
    $scope.modal = document.getElementById('new-guest-modal');

    $rootScope.logout = function(){
      authentication.logout();
      $rootScope.isLoggedIn = authentication.isLoggedIn();
    };

    // Return yes if guest has responded; return no otherwise
    $scope.dispResponse = function(responded){
      return (responded ? "yes" : "no");
    };

    // If guest is attending, display number of people coming
    $scope.dispNum = function(responded, numAttending){
      return (responded ? numAttending : "unknown");
    };

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
    };


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
          numAdults: g.numAdults,
          numChildren: g.numChildren,
          numChildrenMeals: g.numChildrenMeals,
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
      $scope.irespondedflag = false;
      $scope.inumattending = 0;
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.responseBehaviour = function() {
        if(!$scope.irespondedflag) {
          $scope.inumadults = 0;       // If response not received, assume 0 people are in attendance
          $scope.inumchildren = 0;
          $scope.inumchildrenmeals = 0;
        }
      }
      $scope.submitData = function() {
        var code = "";
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 0; i < 4; i++) {
          code += chars[Math.floor(Math.random() * chars.length)];
        }
        var responded = "";
        if($scope.irespondedflag == false){
          $scope.inumadults = 0;       // If response not received, assume 0 people are in attendance
          $scope.inumchildren = 0;
          $scope.inumchildrenmeals = 0;
        }
        var guestData =
          '{"name":"' + $scope.iguestname + '",' +
          '"responded":"' + $scope.irespondedflag + '",' +
          '"numAdults":"' + $scope.inumadults + '",' +
          '"numAdults":"' + $scope.inumchildren + '",' +
          '"numChildren":"' + $scope.inumchildrenmeals + '",' +
          '"numChildMeals":"' + $scope.idietaryrestrictions + '",' +
          '"authCode":"' + code + '"' +
        '}'; // The guest data
        $mdDialog.hide(guestData);
      };
    }


    function UpdateGuestDialogController($scope, $mdDialog, id, name, responded, numAdults, numChildren, numChildrenMeals, code) {
      $scope.iid = id;
      $scope.iguestname = name;
      $scope.inumadults = numAdults;
      $scope.inumchildren = numChildren;
      $scope.inumchildrenmeals = numChildrenMeals;
      $scope.code = code;
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.responseBehaviour = function() {
        if(!$scope.irespondedflag) {
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
          '"numAdults":"' + $scope.inumadults + '",' +
          '"numAdults":"' + $scope.inumchildren + '",' +
          '"numChildren":"' + $scope.inumchildrenmeals + '",' +
          '"numChildMeals":"' + $scope.idietaryrestrictions + '",' +
          '"authCode":"' + code + '"' +
        '}'; // The guest data
        $mdDialog.hide(guestData);
      };
    }


}]);
