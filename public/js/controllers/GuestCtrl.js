angular.module('GuestCtrl', []).controller('GuestController', ['$scope', 'Guest', function($scope, Guest) {

    get();
    $scope.tagline = "Number of guests attending is unknown.";
    $scope.iguestname = "";
    $scope.irespondedflag = false;
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

    $scope.randomString = function(length, chars) {
      var result = '';
      for (var i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    }

    $scope.responseBehaviour = function() {
      var checked = document.getElementById('response-check').checked;
      var numInput = document.getElementById('num-input');
      if(checked == true) {
        numInput.setAttribute("disabled", false);
        numInput.setAttribute("placeholder", "Number attending");
      }
      else {
        numInput.setAttribute("disabled", true);
        numInput.setAttribute("placeholder", "0");
      }
    }

    $scope.showForm = function() {
      $scope.modal.modal("show");
    }

    $scope.hideForm = function() {
      $scope.modal.style.display = 'none';
    }

    $scope.addGuest = function(){
      var code = randomString(4, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      if($scope.irespondedflag == false){
        $scope.inumattending = 0;       // If response not received, assume 0 people are in attendance
      }
      var guestData =
        '{"name":"' + $scope.iguestname + '",' +
        '"responded":"' + $scope.responded + '",' +
        '"numAttending":"' + $scope.inumattending + '",' +
        '"authCode":"' + code + '"' +
      '}'; // The guest data
      Guest.create(guestData)
        .then(function (response) {
          get(); // Refresh table
        }, function (error) {
          $scope.status = 'Unable to delete guest data: ' + error.message;
        }); // Add new guest to database.
    }

    // Get all guests
    function get() {
        Guest.get()
            .then(function (response) {
                $scope.guests = response.data;
                $scope.tagline = $scope.getGuestCount() + " guests confirmed attending.";
            }, function (error) {
                $scope.status = 'Unable to load guest data: ' + error.message;
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

    $scope.update = function(id) {

    }



}]);
