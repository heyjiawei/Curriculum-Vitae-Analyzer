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

.controller('View1Ctrl', function($scope, $q, fileReader, pdfReader, lemma, cvTokenizer,
                                  jobDescTokenizer, jobDescriptionParser, cvEvaluator, storageAccess, $location) {
    $scope.fileNames = "";
    $scope.jobDescript = "";

    //// TODO: Remove testing code
    //  var worktime = ["i've worked from January 2000-present"];
    //  $scope.testWorkTime = lemma.find_and_parse_work_time(worktime);
    //  console.log("worktime", $scope.testWorkTime);
    //var education = ["(B.E.), Biomedical/Medical Engineering, 2006 - 2010 Activities and Societies: Student council, NGO-Third Vision Bishop Cotton's womens christian college 2004 - 2006 Activities and Societies: Modelling, Dancing"];
    //$scope.testEducation = lemma.find_and_parse_education(education);
    //  console.log("education", $scope.testEducation);
    //var languages = ["Chinese Tamil Japanese"];
    //$scope.testLanguages = lemma.parse_language(languages);
    //var workExperience = ["Technical papers /Projects First place in paper presentation organized by Anna university Second place in the paper presentation at the inter-collegiate symposium Designed a system to use brain signals to control motor functions. Created a motion capture system for upper limb movement analysis for stroke patients"];
    //$scope.testWork = lemma.parse_experience(workExperience);
    //console.log("languages", $scope.testLanguages);
    //console.log("work", $scope.testWork);
    //  $scope.testJob = jobDescriptionParser.parse_min_req(["Considerable programming experience in Swift and Objective-C/C++. Deep technical knowledge of Cocoa touch ecosystem and iOS development paradigms such as MVC, VIPER etc. (http://www.objc.io/issue-13/viper.html). Experience writing unit and integration tests with Xcode. Knowledge of frameworks that can enhance user experience (such as Facebook's Pop (https://github.com/facebook/pop)) MVP application design and complex, reactive touch-based User Experience. Good Contribution to the open source community (Cocoa Control contributions would be interesting) Strong foundation in computer science, with competencies in data structures, algorithms and software design optimized for embedded systems. Strong experience with designing and architecting client-server based apps on iOS. Passion for healthcare and making the world a better place mvp application "]);
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

      var tokens = cvTokenizer.tokenizeCv(result);
      console.log("cv tokens", tokens);
      // TODO: Factor into CV handler method
      var cvParsed = new CV();
      cvParsed.education = lemma.find_and_parse_education(tokens.education);
      cvParsed.language = lemma.parse_language(tokens.language);
      cvParsed.interest = lemma.parse_interest(tokens.interest);
      cvParsed.skill = lemma.parse_skills(tokens.skill);
      cvParsed.experience = lemma.parse_experience(tokens.experience.concat(tokens.project));
        cvParsed.workExperienceTime = lemma.find_and_parse_work_time(tokens.experience);
//      cvParsed.id = id;
      console.log("cv parsed", cvParsed);
      storageAccess.storeParsedCV(cvParsed);
      console.log(storageAccess.getAllCV());

      return cvParsed;
    });
  }

  var processJobDesc = function(jobDesc) {
    var deferred = $q.defer();

    var tokens = jobDescTokenizer.tokenizeJobDesc(jobDesc);
    console.log("job desc tokens", tokens);

    var jobDescParsed = new JobDescription();
    jobDescParsed.essentialSkills = jobDescriptionParser.parse_min_req(tokens.minimumRequirement.concat(tokens.responsibility));
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
      var allParsedCvs = jobDescAndFiles[1];
      cvEvaluator.evaluateCV();
      $location.url("/view2");
    });
  };
});