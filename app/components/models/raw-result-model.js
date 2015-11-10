angular.module('cvia.models')
  .factory('rawResultModel', function (cvModel, jobDescriptionModel, cvEvaluator, storageAccess) {

    function RawResult() {
      this.name = "";
      this.scoringCriteria = {
        education: 0,
        essSkills: 0,
        prefSkills: 0,
        experience: 0,
        language: 0
      };
    }

    function calculateResultsAndSave() {
      var allCv = cvModel.get_all_stemmed();
      var jobDesc = jobDescriptionModel.get_stemmed();

      var rawScoredCvs = [];
      allCv.forEach(function (evaluatedCv) {

        var educationScore = cvEvaluator.calcEducationScore(evaluatedCv.education, jobDesc.education);
        var essSkillsScore = cvEvaluator.calcSkillsScore(evaluatedCv, jobDesc.essentialSkills);
        var prefSkillsScore = cvEvaluator.calcSkillsScore(evaluatedCv, jobDesc.preferredSkills);
        var expScore = cvEvaluator.calcExpScore(evaluatedCv.workExperienceTime, jobDesc.workExperienceTime);
        var languageScore = cvEvaluator.calcLanguageScore(evaluatedCv.languages, jobDesc.languages);

        var rawScoredCv = new RawResult();
        rawScoredCv.name = evaluatedCv.name;
        rawScoredCv.scoringCriteria.education = educationScore;
        rawScoredCv.scoringCriteria.essSkills = essSkillsScore;
        rawScoredCv.scoringCriteria.prefSkills = prefSkillsScore;
        rawScoredCv.scoringCriteria.experience = expScore;
        rawScoredCv.scoringCriteria.language = languageScore;

        rawScoredCvs.push(rawScoredCv);
      });
      storageAccess.storeRawEvaluationResults(rawScoredCvs);
    }

    function get() {
//      console.log("storage all raw eval", storageAccess.getAllRawEvaluationResults());
      if (storageAccess.getAllRawEvaluationResults().length === 0){
        calculateResultsAndSave();
      }
      return storageAccess.getAllRawEvaluationResults();
    }

    return {
      /**
       * Retrieves raw results from storage, otherwise calculate result
       * @param: void
       * @return array of RawResult objects
       */
      get: get
    }
  });
