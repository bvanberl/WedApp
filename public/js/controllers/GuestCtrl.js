angular.module('GuestCtrl', []).controller('GuestController', ['$scope', 'Guest', function($scope, Guest) {

    get();
    $scope.tagline = "Number of guests attending is unknown.";

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



}]);
