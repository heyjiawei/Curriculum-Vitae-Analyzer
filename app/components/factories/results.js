'use strict';

angular.module('myApp.factories')
  .factory('results', function (cvEvaluator) {
    var EDU_WEIGHT = 0.20, ESS_SKILL_WEIGHT = 0.20, PREF_SKILL_WEIGHT = 0.20,
      EXP_WEIGHT = 0.20, LANG_WEIGHT = 0.20;

    var evaluatedCvs = cvEvaluator.evaluateCV();

    function Result() {
      this.id = {name: "Name", value: "Placeholder Name"};
      this.finalScore = {name: "Score", value: 0};
      this.scoringCriteria = {
        education: {name: "Education", value: 0},
        essSkills: {name: "Essential Skills", value: 0},
        prefSkills: {name: "Preferred Skills", value: 0},
        experience: {name: "Work Experience", value: 0},
        language: {name: "Languages", value: 0}
      };
    }

    function getResultsFromEvaluation() {
      // return names, score
      var results = [];
      evaluatedCvs.forEach(function(evaluatedCv) {
        var evaluatedResult = new Result();
        evaluatedResult.finalScore.value = evaluatedCv.education * EDU_WEIGHT
          + evaluatedCv.essSkills * ESS_SKILL_WEIGHT
          + evaluatedCv.prefSkills * PREF_SKILL_WEIGHT
          + evaluatedCv.experience * EXP_WEIGHT
          + evaluatedCv.language * LANG_WEIGHT;
        evaluatedResult.scoringCriteria.education.value = evaluatedCv.education;
        evaluatedResult.scoringCriteria.essSkills.value = evaluatedCv.essSkills;
        evaluatedResult.scoringCriteria.prefSkills.value = evaluatedCv.prefSkills;
        evaluatedResult.scoringCriteria.experience.value = evaluatedCv.experience;
        evaluatedResult.scoringCriteria.language.value = evaluatedCv.language;
        results.push(evaluatedResult);
      });
      console.log("results", results);
      return results;
    }

    // update weights
    function updateWeights(edu, essSkill, prefSkill, expe, lang) {
      var total = edu + essSkill + prefSkill + expe + lang;

      EDU_WEIGHT = edu/total;
      ESS_SKILL_WEIGHT = essSkill/total;
      PREF_SKILL_WEIGHT = prefSkill/total;
      EXP_WEIGHT = expe/total;
      LANG_WEIGHT = lang/total;
    }

    return {
      getResultsFromEvaluation: getResultsFromEvaluation,
      updateWeights: updateWeights
    }
  });