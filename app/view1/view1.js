'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngFileUpload'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    })
    .when('/view2', {
      templateUrl: 'view2/view2.html',
      controller: 'View2Ctrl'
    });
  }])

.controller('View1Ctrl', function($scope, $q, fileReader, pdfReader, cvModel, jobDescriptionModel,
                                  jobDescTokenizer, jobDescriptionParser, cvEvaluator, storageAccess, $location) {
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
            return getAllTextFromPdf(pdf).then(function(allTextFromPdf) {
              return allTextFromPdf;
            });
          });
        promises.push(readPdf);
      }
      return $q.all(promises).then(function(allCvParsed) {
        console.log("all cv parsed promise", allCvParsed);
        return allCvParsed;
      });
    }
  };

  function getAllTextFromPdf(pdf) {
    return pdfReader.getAllTextFromPdf(pdf).then(function(result) {
      console.log("final array of string", result);
     cvModel.save(result);
    });
  };

  var processJobDesc = function(jobDesc) {
    var deferred = $q.defer();
    jobDescriptionModel.save(jobDesc);
    //var tokens = jobDescTokenizer.tokenizeJobDesc(jobDesc);
    //console.log("job desc tokens", tokens);
    //
    //var jobDescParsed = new JobDescription();
    //jobDescParsed.essentialSkills = jobDescriptionParser.parse_min_req(tokens.minimumRequirement.concat(tokens.responsibility));
    //jobDescParsed.preferredSkills = jobDescriptionParser.parse_skills(tokens.preferredQualification); // TODO: parse from minreq as well
    //jobDescParsed.location = jobDescriptionParser.parse_location(tokens.location);
    //jobDescParsed.education = jobDescriptionParser.parse_education_keywords(tokens.minimumRequirement);
    //jobDescParsed.workExperienceTime = jobDescriptionParser.find_and_parse_work_time(tokens.minimumRequirement);
    //jobDescParsed.languages = jobDescriptionParser.parse_languages(tokens.minimumRequirement.concat(tokens.preferredQualification));
    ////console.log("job desc parsed", jobDescParsed);
    //storageAccess.setJobDescription(jobDescParsed);
    //console.log("job desc", jobDescParsed);
    //deferred.resolve();
    return deferred.promise;
  };

  $scope.doProcess = function () {
    var processJobDescPromise = processJobDesc($scope.jobDescript);
    var processFilesPromise = processFiles($scope.files);
    $q.all([processJobDescPromise, processFilesPromise]).then(function(jobDescAndFiles) {
      console.log("THS IS THE END", jobDescAndFiles);
      var allParsedCvs = jobDescAndFiles[1];
      cvEvaluator.evaluateCV();
      $location.url("/view2");
    });
  };
});