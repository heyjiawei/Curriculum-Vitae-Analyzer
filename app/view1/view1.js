'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function($scope, fileReader) {
  //http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx
  $scope.getFile = function () {
    $scope.progress = 0;
    fileReader.readAsDataUrl($scope.file, $scope)
      .then(function(result) {
        $scope.imageSrc = result;
      });
  };

  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = progress.loaded / progress.total;
  });
}]);