angular.module('InformationCtrl', ['ngAnimate']).controller('InformationController', ['$scope', '$rootScope', '$window', 'authentication', 'WEDDING_DATE', function($scope, $rootScope, $window, authentication, WEDDING_DATE) {
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.timezone = "America/Halifax";
  $scope.weddingtime = WEDDING_DATE;
  $scope.ceremonyLoc = "St. Peter's Cathedral Basilica";
  $scope.ceremonyDesc = "The groom's family have been members of this parish for several years.  The ceremony will commence at 11:00 a.m.";
  $scope.ceremonyAddr = "196 Dufferin Ave, London, ON N6A 5N6";
  $scope.cocktailLoc = "Gomes family residence";
  $scope.cocktailDesc = "The cocktail hour will take place directly following the ceremony at the bride's house in the backyard.  Drinks and hor d'oevres will be provided.  Wedding pictures will be taken during this time at the Coldstream Conservation Area.  The address will be given at the end of the ceremony.";
  $scope.cocktailAddr = "Gomes Family Residence";
  $scope.receptionLoc = "The Portuguese Canadian Club of Strathroy";
  $scope.receptionDesc = "Delicious food, a great dessert, and a lit banger to follow!";
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

  $scope.sendToRegistry = function() {
    window.open('http://www2.thebay.com/giftregistry/', '_blank');
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
