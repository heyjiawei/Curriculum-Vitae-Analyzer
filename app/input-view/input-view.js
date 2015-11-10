'use strict';

angular.module('cvia.inputView', ['ngRoute', 'ngFileUpload'])


.controller('inputViewCtrl', function($scope, $q, fileReader, pdfReader, cvModel, jobDescriptionModel, cvEvaluator, $location) {
    $scope.fileNames = "";
    $scope.jobDescript = "";
  $scope.$watch('file', function () {
    if ($scope.file != null) {
      $scope.files = [$scope.file];
    }
  });

  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = (progress.loaded / progress.total) * 100;
  });

  var processFiles = function (files) {
    $scope.fileNames = "";
    if (files && files.length) {
      var promises = [];
      for (var i = 0; i < files.length; i++) {
        $scope.fileNames += files[i].name + "\n";
        $scope.showProgressBar = true;

        var readPdf = fileReader.readAsDataUrl(files[i], $scope)
          .then(function(pdf) {
            return getAllTextFromPdf(pdf);
          });
        promises.push(readPdf);
      }
      return $q.all(promises).then(function(allCvParsed) {
        return allCvParsed;
      });
    }
  };

  function getAllTextFromPdf(pdf) {
    cvModel.reset();
    return pdfReader.getAllTextFromPdf(pdf).then(function(result) {
      cvModel.save(result);
    });
  }

  var processJobDesc = function(jobDesc) {
    jobDescriptionModel.reset();
    var deferred = $q.defer();
    jobDescriptionModel.save(jobDesc);
    deferred.resolve();
    return deferred.promise;
  };

  $scope.doProcess = function () {
    var processJobDescPromise = processJobDesc($scope.jobDescript);
    var processFilesPromise = processFiles($scope.files);
    $q.all([processJobDescPromise, processFilesPromise]).then(function(jobDescAndFiles) {
      $location.url("/results-view");
    });
  };
});