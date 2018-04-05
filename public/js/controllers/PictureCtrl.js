angular.module('PictureCtrl', ['ngFileUpload','ngAnimate']).controller('PictureController', ['$scope', '$rootScope', '$window', '$location', 'Picture', 'Upload', 'authentication', function($scope, $rootScope, $window, $location, Picture, Upload, authentication) {

  // Initialization
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.picFolder = "../img/pictures/";
  $scope.thumbFolder = "../img/thumbnails/";
  $scope.conf = {};
  $scope.methods = {};
  get();

  $rootScope.logout = function(){
    authentication.logout();
    $rootScope.isLoggedIn = authentication.isLoggedIn();
  };

  // Get all pictures
  function get() {
      Picture.get()
          .then(function (response) {
              $scope.pictures = response.data;
              if($scope.pictures.length > 0){
                  sortPictures('filename', false);
                  imagesInit();
              }
          }, function (error) {
              $scope.status = 'Unable to load picture data: ' + error.message;
          });
  }

  // Comparator for sorting Picture objects
  function sortPictures(prop, asc) {
      $scope.pictures = $scope.pictures.sort(function(a, b) {
      if (!asc) {
          return (a[prop] > b[prop]) ? -1 : ((a[prop] < b[prop]) ? 1 : 0);
      } else {
          return (b[prop] > a[prop]) ? -1 : ((b[prop] < a[prop]) ? 1 : 0);
      }
    });
  }

  // Initialize image data
  function imagesInit(){
    $scope.images = [];
    for(var i = 0; i < $scope.pictures.length; i++)
    {
      var picObj = new Object();
      picObj.id = i;
      picObj.title = "Image " + (i+1);
      picObj.url = $scope.picFolder + $scope.pictures[i].filename;
      picObj.thumbUrl = $scope.thumbFolder + $scope.pictures[i].filename;
      picObj.deletable = false;
      $scope.images.push(picObj);
    }
  }

  // Open an image as a modal
  $scope.openGallery = function (index) {
    $scope.methods.open(index);
  };

  // Deletes an picture by ID
  $scope.delete = function($event, id, filename) {
    $event.stopPropagation();
    Picture.delete(id, filename)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to delete picture data: ' + error.message;
      });
  }

  // Create new picture with data returned from hiding the modal.
  $scope.addPicture = function(pictureData){
    Picture.create(pictureData)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to create new picture: ' + error.message;
      }); // Add new picture to database.
  }

  $scope.upload = function (file) {
      Upload.upload({
          url: $location.absUrl().replace('/pictures', '') + '/api/upload', // webAPI exposed to upload the file
          data:{file:file} // pass file as data, should be user ng-model
      }).then(function (resp) { // upload function returns a promise
          if(resp.data.error_code === 0){ // validate success
              var pictureData = '{"filename":"' + resp.data.filename + '"}';
              $scope.addPicture(pictureData);
              get();
          } else {
              $window.alert('Picture could not be uploaded.');
          }
      }, function (resp) { //catch error
          console.log('Error status: ' + resp.status);
          $window.alert('Error status: ' + resp.status);
      }, function (evt) {
          console.log(evt);
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
      });
  };

  $scope.submit = function(){ //function to call on form submit
    if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
        $scope.upload($scope.file); //call upload function
    }
  }


}]);
