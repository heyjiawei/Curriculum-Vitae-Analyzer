'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngFileUpload'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope, fileReader) {
  $scope.$watch('files', function () {
    $scope.upload($scope.files);
  });

  $scope.$watch('file', function () {
    if ($scope.file != null) {
      $scope.files = [$scope.file];
    }
  });

  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = (progress.loaded / progress.total) * 100;
  });

  $scope.upload = function (files) {
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        $scope.showProgressBar = true;
        fileReader.readAsDataUrl(files[i], $scope)
          .then(function(result) {
            console.log(result);
          });
      }
    }
  }
});