angular.module('PictureCtrl', ['ngAnimate', 'ngFileUpload']).controller('PictureController', ['$scope', '$rootScope', 'Picture', 'Upload', 'authentication', function($scope, $rootScope, Picture, Upload, authentication) {

  // Initialization
  $rootScope.isLoggedIn = authentication.isLoggedIn();
  $scope.folder = "../img/pictures/";
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
              sortPictures('filename', false);
              imagesInit();
          }, function (error) {
              $scope.status = 'Unable to load picture data: ' + error.message;
          });
  }

  // Comparator for sorting Picture objects
  function sortPictures(prop, asc) {
      $scope.pictures = $scope.pictures.sort(function(a, b) {
      if (asc) {
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
      picObj.url = $scope.folder + $scope.pictures[i].filename;
      picObj.thumbUrl = picObj.url;
      picObj.deletable = false;
      $scope.images.push(picObj);
    }
  }

  // Open an image as a modal
  $scope.openGallery = function (index) {
    $scope.methods.open(index);
  };

  // Deletes an picture by ID
  $scope.delete = function(id) {
    Picture.delete(id)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to delete picture data: ' + error.message;
      });
  }

  $scope.submit = function(){ //function to call on form submit
    if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
      $scope.upload($scope.file); //call upload function
    }
  }
  $scope.upload = function (file) {
    Upload.upload({
      url: 'http://localhost:8080/pictures', //webAPI exposed to upload the file
      data:{file:file} //pass file as data, should be user ng-model
    }).then(function (resp) { //upload function returns a promise
      if(resp.data.error_code === 0){ //validate success
        $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
      } else {
        $window.alert('an error occured');
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

  // Create new picture with data returned from hiding the modal.
  $scope.addPicture = function(pictureData){
    Picture.create(pictureData)
      .then(function (response) {
        get(); // Refresh table
      }, function (error) {
        $scope.status = 'Unable to create new picture: ' + error.message;
      }); // Add new picture to database.
  }

}]);
