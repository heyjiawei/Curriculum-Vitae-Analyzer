'use strict';

angular.module('myApp.factories')
  .factory('cvEvaluator', function(stem, storageAccess) {
    var evaluateAllCv = function () {
      var allCv = storageAccess.getAllCV();
      var jobDesc = storageAccess.getJobDescription();

      var stemmedJobDescription = stemJobDesc(jobDesc);
      var stemmedAllCv = [];
      allCv.forEach(function(cv) {
        stemmedAllCv.push(stemCv(cv));
      });


    };

    function stemCv(cv) {
      var stemmedCv = new CV();
      stemmedCv.education = stem.stem(cv.education);
      stemmedCv.language = stem.stem(cv.language);
      stemmedCv.interest = stem.stem(cv.interest);
      stemmedCv.skill = stem.stem(cv.skill);
      stemmedCv.experience = stem.stem(cv.experience);
      return stemmedCv;
    }

    function stemJobDesc(jobDesc){
      var stemmedJobDescription = new JobDescription();
      stemmedJobDescription.minRequirements = stem.stem(jobDesc.minRequirements);
      stemmedJobDescription.skills = stem.stem(jobDesc.skills);
      stemmedJobDescription.location = stem.stem(jobDesc.location);
      stemmedJobDescription.education = stem.stem(jobDesc.education);
      stemmedJobDescription.workExperienceTime = stem.stem(jobDesc.workExperienceTime);

      return stemmedJobDescription;
    }
    return {
      evaluateCV: evaluateAllCv
    }
  });