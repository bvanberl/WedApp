angular.module('InformationCtrl', ['ngAnimate']).controller('InformationController', ['$scope', '$rootScope', '$window', 'authentication', 'WEDDING_DATE', function($scope, $rootScope, $window, authentication, WEDDING_DATE) {
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.timezone = "America/Halifax";
  $scope.weddingtime = WEDDING_DATE;
  $scope.ceremonyLoc = "St. Peter's Cathedral Basilica";
  $scope.ceremonyDesc = "Free parking will be available to guests in the parking lots adjacent to the basilica.";
  $scope.ceremonyAddr = "196 Dufferin Ave, London, ON N6A 5N6";
  $scope.cocktailLoc = "Bride's Family Home";
  $scope.cocktailDesc = "The garden party will take place directly following the ceremony at the bride's family home. The address has been provided on your wedding invitation. Come enjoy drinks and food with the newlyweds before the reception.";
  $scope.cocktailAddr = "Bride's Family Home";
  $scope.receptionLoc = "The Portuguese Canadian Club of Strathroy";
  $scope.receptionDesc = "Celebrate the marriage of the bride and groom with a delicious meal and a dance to follow!";
  $scope.receptionAddr = "375 York St, Strathroy, ON N7G 3T6";

  $rootScope.logout = function(){
    authentication.logout();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
  }

  $scope.expand = function($event) {
    $event.currentTarget.classList.toggle("active");
    var panel = $event.currentTarget.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }

  $window.LoadMaps = function() {
    var myCenter = new google.maps.LatLng(42.987104,-81.249979);
    var mapCanvas = document.getElementById("ceremonyMap");
    var mapOptions = {center: myCenter, zoom: 14};
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var marker = new google.maps.Marker({position:myCenter});
    marker.setMap(map);
    var infowindow = new google.maps.InfoWindow({
      content: $scope.ceremonyLoc
    });
    infowindow.open(map,marker);

    myCenter = new google.maps.LatLng(42.958995,-81.600351);
    mapCanvas = document.getElementById("receptionMap");
    mapOptions = {center: myCenter, zoom: 14};
    map = new google.maps.Map(mapCanvas, mapOptions);
    marker = new google.maps.Marker({position:myCenter});
    marker.setMap(map);
    infowindow = new google.maps.InfoWindow({
      content: $scope.receptionLoc
    });
    infowindow.open(map,marker);
  }

}]);
