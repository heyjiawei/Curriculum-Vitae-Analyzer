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

      stemmedAllCv.forEach(function(stemmedCv) {
        // evaluate minimum requirements
        var skillMatch = findMatchingWords(stemmedJobDescription.minRequirements, stemmedCv);
        console.log("cv skill match", skillMatch);
      });

      var rankedCvs = [];

      return rankedCvs;
    };

    function findMatchingWords(source1, source2) {
      var wordsOfSource1 = source1.join().split(" ");
      var wordsOfSource2 = source2.join().split(" ");
      var results = [];

      for(var i = 0; i < wordsOfSource1.length; i++) {
        //for each word, check the entire wordsOfSource2?
        var hasKeyWord = function (keyWord) {
          return wordsOfSource1[i].toLowerCase().indexOf(keyWord.toLowerCase()) >= 0;
        };
        if(wordsOfSource2.some(hasKeyWord)) {
          results[hasKeyWord] = results[hasKeyWord] ? results[hasKeyWord]++ : 1;
        }
      }
      return results;
    }

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