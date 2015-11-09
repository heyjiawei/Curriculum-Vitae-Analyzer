angular.module('myApp.models')
  .factory('rawResultModel', function (cvModel, jobDescriptionModel, cvEvaluator, storageAccess) {

    function rawResult() {
      this.id = "";
      this.scoringCriteria = {
        education : 0,
        essSkills : 0,
        prefSkills : 0,
        experience : 0,
        language : 0
      };
    }

    function calculateResults() {
      var allCv = cvModel.get_all_stemmed();
      var jobDesc = jobDescriptionModel.get_stemmed();

      var rawScoredCvs = [];
      allCv.forEach(function (evaluatedCv) {
        var evaluatedResult = new Result();

        var educationScore = cvEvaluator.calcEducationScore(evaluatedCv.education, jobDesc.education);
        var essSkillsScore = cvEvaluator.calcSkillsScore(evaluatedCv, jobDesc.essentialSkills);
        var prefSkillsScore = cvEvaluator.calcSkillsScore(evaluatedCv, jobDesc.preferredSkills);
        var expScore = cvEvaluator.calcExpScore(evaluatedCv.experience, jobDesc.experience);
        var languageScore = cvEvaluator.calcLanguageScore(evaluatedCv.languages, jobDesc.languages);

        var rawResult = new rawResult();
        rawResult.id = evaluatedCv.id;
        rawResult.scoringCriteria.education = educationScore;
        rawResult.scoringCriteria.essSkills = essSkillsScore;
        rawResult.scoringCriteria.prefSkills = prefSkillsScore;
        rawResult.scoringCriteria.experience = expScore;
        rawResult.scoringCriteria.language = languageScore;

        rawScoredCvs.push(evaluatedResult);
      });
      storageAccess.storeResults(rawScoredCvs);
      console.log("scored CVS", rawScoredCvs);
    }

    return {
      calculateResults: calculateResults
    }
  });
