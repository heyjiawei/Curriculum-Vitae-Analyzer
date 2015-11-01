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

.controller('View1Ctrl', function($scope, fileReader, pdfReader, lemma, cvTokenizer, jobDescTokenizer, jobDescriptionParser, storageAccess) {
    $scope.page1content = "No file opened.";
    $scope.fileNames = "";
    $scope.jobDescript = "";
    $scope.results = {};

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
      for (var i = 0; i < files.length; i++) {
        console.log(files[i]);
        $scope.fileNames += files[i].name + "\n";
        $scope.showProgressBar = true;
        fileReader.readAsDataUrl(files[i], $scope)
          .then(function(result) {
            pdfReader.getAllTextFromPdf(result).then(function(result) {
              console.log("final array of string", result);
              $scope.$apply(function() {
                result.forEach(function(line) {
                  $scope.page1content += line + '\n';
                });
              });
              var tokens = cvTokenizer.tokenizeCv(result);
              console.log("cv tokens", tokens);

              // TODO: Factor into CV handler method
              var educationParsed = lemma.find_and_parse_education(tokens.education);
              var languageParsed = lemma.parse_language(tokens.language);
              var interestParsed = lemma.parse_interest(tokens.interest);
              var skillParsed = lemma.parse_skills(tokens.skill);
              var experienceParsed = lemma.parse_work(tokens.experience);
              var cvParsed = new CV();
              cvParsed.education = educationParsed;
              cvParsed.language = languageParsed;
              cvParsed.interest = interestParsed;
              cvParsed.skill = skillParsed;
              cvParsed.experience = experienceParsed;
              console.log("cv parsed", cvParsed);
              storageAccess.storeParsedCV(cvParsed);
              console.log(storageAccess.getAllCV());
            });
          });
      }
    }
  };

  var processJobDesc = function(jobDesc) {
    var tokens = jobDescTokenizer.tokenizeJobDesc(jobDesc);
    console.log("job desc tokens", tokens);
    var minReqParsed = jobDescriptionParser.parse_min_req(tokens.minimumRequirement);
    var skillsParsed = jobDescriptionParser.parse_skills(tokens.preferredQualification); // TODO: parse from minreq as well
    var locationParsed = jobDescriptionParser.parse_location(tokens.location);
    var educationParsed = jobDescriptionParser.find_and_parse_education(tokens.minimumRequirement);
    var workTimeParsed = jobDescriptionParser.find_and_parse_work_time(tokens.minimumRequirement);
    var jobDescParsed = new JobDescription();
    jobDescParsed.minRequirements = minReqParsed;
    jobDescParsed.skills = skillsParsed;
    jobDescParsed.location = locationParsed;
    jobDescParsed.education = educationParsed;
    jobDescParsed.workExperienceTime = workTimeParsed;
    // TODO: languages
    console.log("job desc parsed", jobDescParsed);
    storageAccess.setJobDescription(jobDescParsed);
    console.log("job desc", jobDescParsed);
    return jobDescParsed;
  };

  $scope.doProcess = function () {
    $scope.page1content = "";
    processFiles($scope.files);
    processJobDesc($scope.jobDescript);
  };
});