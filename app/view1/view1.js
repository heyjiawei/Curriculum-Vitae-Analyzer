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

.controller('View1Ctrl', function($scope, fileReader, pdfReader, lemma, cvTokenizer, storageAccess) {
    $scope.page1content = "No file opened.";
    $scope.fileNames = "";

    var education = ["(Phd.) Neuroscience, Nanyang Technological University, Singapore Jan 2014- Nov 2014 \
      MSc Biomedical Engineering Nanyang Technological University, Singapore Aug 2010- July 2012 \
      BE Biomedical Engineering Anna University, India Aug 2006 - May 2010"];
    $scope.testEducation = lemma.parse_education(education);
    var languages = ["Chinese Tamil Japanese"];
    $scope.testLanguages = lemma.parse_language(languages);
    var workExperience = ["Technical papers /Projects First place in paper presentation organized by Anna university Second place in the paper presentation at the inter-collegiate symposium Designed a system to use brain signals to control motor functions. Created a motion capture system for upper limb movement analysis for stroke patients"];
    $scope.testWork = lemma.parse_work(workExperience);
    console.log("education", $scope.testEducation);
    console.log("languages", $scope.testLanguages);
    console.log("work", $scope.testWork);

  $scope.$watch('file', function () {
    if ($scope.file != null) {
      $scope.files = [$scope.file];
    }
  });

  $scope.jobDescript = null;

  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = (progress.loaded / progress.total) * 100;
  });

  $scope.processFiles = function (files) {
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
              cvTokenizer.tokenizeCv(result);
            });
          });
      }
    }
  };

  $scope.doProcess = function () {
    $scope.page1content = "";
    $scope.processFiles($scope.files);
    $scope.jobDescript = this.jobDescript;
    console.log($scope.jobDescript);
  };
});