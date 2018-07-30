angular.module('GuestCtrl', ['ngMaterial', 'ngMessages']).controller('GuestController', ['$scope', '$rootScope', '$location', '$window', 'Guest', '$mdDialog', 'authentication', function($scope, $rootScope, $location, $window, Guest, $mdDialog, authentication) {

    get();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
    if(!$rootScope.isLoggedIn){
      $location.path('/');
    }
    $scope.tagline = "Number of guests attending is unknown.";
    $scope.iguestname = "";
    $scope.icomments = "";
    $scope.irespondedflag = false;
    $scope.inumattending = 0;
    $scope.modal = document.getElementById('new-guest-modal');
    $scope.numAdultsAttending = 0;
    $scope.numChildrenAttending = 0;
    $scope.numChildrenMeals = 0;
    $scope.numVegMeals = 0;
    $scope.searchTerms = "";

    $rootScope.logout = function(){
      authentication.logout();
      $rootScope.isLoggedIn = authentication.isLoggedIn();
    };

    // Return yes if guest has responded; return no otherwise
    $scope.dispResponse = function(responded){
      return (responded ? "yes" : "no");
    };

    // If guest is attending, display number of people coming
    $scope.dispNum = function(responded, x){
      return (responded ? x : "?");
    };

    // Get sum of number of guests attending.
    $scope.getGuestCounts = function(){
      $scope.numAdultsAttending = 0;
      $scope.numChildrenAttending = 0;
      $scope.numChildrenMeals = 0;
      $scope.numVegMeals = 0;
      if(Object.keys( $scope.guests ).length > 0) {
        for(i = 0; i < $scope.guests.length; i++)
        {
          if($scope.guests[i].responded){
            $scope.numAdultsAttending += $scope.guests[i].numAdults;
            $scope.numChildrenAttending += $scope.guests[i].numChildren;
            $scope.numChildrenMeals += $scope.guests[i].numChildrenMeals;
            $scope.numVegMeals += $scope.guests[i].numVegMeals;
          }
        }
      }
      return;
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
          numVegMeals: g.numVegMeals,
          comments: g.comments,
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
          if(response.status !== 200) {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector("guest-card")))
                .clickOutsideToClose(true)
                .title('Guest not added!')
                .textContent('Something went wrong. Please try again!')
                .ariaLabel('Guest not added')
                .ok('OK')
            );
          }
        }, function (error) {
          $scope.status = 'Unable to create new guest: ' + error.message;
        }); // Add new guest to database.
    }

    // Update the guest with data returned from hiding the modal.
    $scope.updateGuest = function(guestData){
      console.log(guestData);
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
                $scope.getGuestCounts();
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
            console.log("Asc" + a[prop] + "," + b[prop]);
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
          console.log("Desc" + a[prop] + "," + b[prop]);
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
  }

  /*
  Sort guests by the property specified and update the icon of the element that called this function.
  */
  $scope.sortGuestsByProperty = function(ev, prop) {
    if(ev.target.classList.contains('glyphicon-sort')){
      if(prop == "name"){
        sortGuests(prop, true);
      }
      else {
        sortGuests(prop, false);
      }
      $(event.target).removeClass('glyphicon-sort');
      $(event.target).addClass('glyphicon-sort-by-attributes');
    }
    else if(ev.target.classList.contains('glyphicon-sort-by-attributes')){
      if(prop == "name"){
        sortGuests(prop, false);
      }
      else {
        sortGuests(prop, true);
      }
      $(event.target).removeClass('glyphicon-sort-by-attributes');
      $(event.target).addClass('glyphicon-sort-by-attributes-alt');
    }
    else if(ev.target.classList.contains('glyphicon-sort-by-attributes-alt')){
      if(prop == "name"){
        sortGuests(prop, true);
      }
      else {
        sortGuests(prop, false);
      }
      $(event.target).removeClass('glyphicon-sort-by-attributes-alt');
      $(event.target).addClass('glyphicon-sort-by-attributes');
    }

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
      $scope.icomments = "";
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
          $scope.inumvegmeals = 0;
        }
        var guestData =
          '{"name":"' + $scope.iguestname + '",' +
          '"responded":"' + $scope.irespondedflag + '",' +
          '"numAdults":"' + $scope.inumadults + '",' +
          '"numChildren":"' + $scope.inumchildren + '",' +
          '"numChildMeals":"' + $scope.inumchildrenmeals + '",' +
          '"numVegMeals":"' + $scope.inumvegmeals + '",' +
          '"comments":"' + $scope.icomments + '",' +
          '"authCode":"' + code + '"' +
        '}'; // The guest data
        $mdDialog.hide(guestData);
      };
    }


    function UpdateGuestDialogController($scope, $mdDialog, id, name, responded, numAdults, numChildren, numChildrenMeals, numVegMeals, comments, code) {
      $scope.iid = id;
      $scope.iguestname = name;
      $scope.irespondedflag = responded;
      $scope.inumadults = numAdults;
      $scope.inumchildren = numChildren;
      $scope.inumchildrenmeals = numChildrenMeals;
      $scope.inumvegmeals = numVegMeals;
      $scope.icomments = comments;
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
          '"numChildren":"' + $scope.inumchildren + '",' +
          '"numChildMeals":"' + $scope.inumchildrenmeals + '",' +
          '"numVegMeals":"' + $scope.inumvegmeals + '",' +
          '"comments":"' + $scope.icomments + '",' +
          '"authCode":"' + code + '"' +
        '}'; // The guest data
        $mdDialog.hide(guestData);
      };
    }

}]);
