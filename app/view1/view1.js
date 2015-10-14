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

.controller('View1Ctrl', function($scope, $q, fileReader, pdfReader, lemma, cvTokenizer, jobDescTokenizer, jobDescriptionParser, storageAccess) {
    $scope.fileNames = "";
    $scope.jobDescript = "";

    //// TODO: Remove testing code
    //var education = ["(Phd.) Neuroscience, Nanyang Technological University, Singapore Jan 2014- Nov 2014 \
    //  MSc Biomedical Engineering Nanyang Technological University, Singapore Aug 2010- July 2012 \
    //  BE Biomedical Engineering Anna University, India Aug 2006 - May 2010"];
    //$scope.testEducation = lemma.find_and_parse_education(education);
    //var languages = ["Chinese Tamil Japanese"];
    //$scope.testLanguages = lemma.parse_language(languages);
    //var workExperience = ["Technical papers /Projects First place in paper presentation organized by Anna university Second place in the paper presentation at the inter-collegiate symposium Designed a system to use brain signals to control motor functions. Created a motion capture system for upper limb movement analysis for stroke patients"];
    //$scope.testWork = lemma.parse_work(workExperience);
    //console.log("education", $scope.testEducation);
    //console.log("languages", $scope.testLanguages);
    //console.log("work", $scope.testWork);
    //  $scope.testJob = jobDescriptionParser.find_and_parse_work_time(["blah blah blah", "5 years experience"]);
    //  console.log("job", $scope.testJob);

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
        //console.log(files[i]);
        $scope.fileNames += files[i].name + "\n";
        $scope.showProgressBar = true;

        var readPdf = fileReader.readAsDataUrl(files[i], $scope)
          .then(function(result) {
            return getAllTextFromPdf(result).then(function(allTextFromPdf) {
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

  function getAllTextFromPdf(result) {
    return pdfReader.getAllTextFromPdf(result).then(function(result) {
      console.log("final array of string", result);

      var tokens = cvTokenizer.tokenizeCv(result);
      console.log("cv tokens", tokens);

      // TODO: Factor into CV handler method
      var cvParsed = new CV();
      cvParsed.education = lemma.find_and_parse_education(tokens.education);
      cvParsed.language = lemma.parse_language(tokens.language);
      cvParsed.interest = lemma.parse_interest(tokens.interest);
      cvParsed.skill = lemma.parse_skills(tokens.skill);
      cvParsed.experience = lemma.parse_work(tokens.experience);
      console.log("cv parsed", cvParsed);
      storageAccess.storeParsedCV(cvParsed);
      console.log(storageAccess.getAllCV());

      return cvParsed;
    });
  }

  var processJobDesc = function(jobDesc) {
    var deferred = $q.defer();

    var tokens = jobDescTokenizer.tokenizeJobDesc(jobDesc);
    //console.log("job desc tokens", tokens);

    var jobDescParsed = new JobDescription();
    jobDescParsed.essentialSkills = jobDescriptionParser.parse_min_req(tokens.minimumRequirement);
    jobDescParsed.preferredSkills = jobDescriptionParser.parse_skills(tokens.preferredQualification); // TODO: parse from minreq as well
    jobDescParsed.location = jobDescriptionParser.parse_location(tokens.location);
    jobDescParsed.education = jobDescriptionParser.find_and_parse_education(tokens.minimumRequirement);
    jobDescParsed.workExperienceTime = jobDescriptionParser.find_and_parse_work_time(tokens.minimumRequirement);
    // TODO: languages
    //console.log("job desc parsed", jobDescParsed);
    storageAccess.setJobDescription(jobDescParsed);
    console.log("job desc", jobDescParsed);
    deferred.resolve(jobDescParsed);
    return deferred.promise;
  };

  $scope.doProcess = function () {
    var processJobDescPromise = processJobDesc($scope.jobDescript);
    var processFilesPromise = processFiles($scope.files);
    $q.all([processJobDescPromise, processFilesPromise]).then(function(jobDescAndFiles) {
      console.log("THS IS THE END", jobDescAndFiles);
    });
  };
});