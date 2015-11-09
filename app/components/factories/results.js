'use strict';

angular.module('myApp.factories')
  .factory('results', function (rawResultsModel, storageAccess) {
    var EDU_WEIGHT = 0.20, ESS_SKILL_WEIGHT = 0.20, PREF_SKILL_WEIGHT = 0.20,
      EXP_WEIGHT = 0.20, LANG_WEIGHT = 0.20;

    save();

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

    function save() {
      var allCvRawResults = rawResultsModel.get();

      var scoredByCriteriaCvs = [];
      allCvRawResults.forEach(function (scoredByCriteriaCv) {
        var evaluatedResult = new Result();

        var educationScore = scoredByCriteriaCv.education;
        var essSkillsScore = scoredByCriteriaCv.essSkills;
        var prefSkillsScore = scoredByCriteriaCv.prefSkills;
        var expScore = scoredByCriteriaCv.experience;
        var languageScore = scoredByCriteriaCv.languages;

        evaluatedResult.id.value = scoredByCriteriaCv.id;
        evaluatedResult.finalScore.value = educationScore * EDU_WEIGHT
          + essSkillsScore * ESS_SKILL_WEIGHT
          + prefSkillsScore * PREF_SKILL_WEIGHT
          + expScore * EXP_WEIGHT
          + languageScore * LANG_WEIGHT; // initialise with default score
        evaluatedResult.scoringCriteria.education.value = educationScore;
        evaluatedResult.scoringCriteria.essSkills.value = essSkillsScore;
        evaluatedResult.scoringCriteria.prefSkills.value = prefSkillsScore;
        evaluatedResult.scoringCriteria.experience.value = expScore;
        evaluatedResult.scoringCriteria.language.value = languageScore;

        scoredByCriteriaCvs.push(evaluatedResult);
      });
      storageAccess.storeResults(scoredByCriteriaCvs);
      console.log("scored CVS", scoredByCriteriaCvs);
    }

    function get() {
      return storageAccess.getAllResults();
    }

    // update weights
    function updateWeights(weights) {
      // check if weights.length == no of keys
      // total = accumulate all values in array
      var allResults = get();
      allResults.forEach(function(result) {
        var totalScore = 0;
        for (var key in result.scoringCriteria) {
          if(result.scoringCriteria.hasOwnProperty(key)) {
            totalScore += result.scoringCriteria[key].value * weights[key]/total;
          }
        }
        result.finalScore = totalScore;
      });
//      var total = edu + essSkill + prefSkill + expe + lang;
//
//      EDU_WEIGHT = edu/total;
//      ESS_SKILL_WEIGHT = essSkill/total;
//      PREF_SKILL_WEIGHT = prefSkill/total;
//      EXP_WEIGHT = expe/total;
//      LANG_WEIGHT = lang/total;
    }

    return {
      Result: Result,
      get: get,
      updateWeights: updateWeights
    }
  });