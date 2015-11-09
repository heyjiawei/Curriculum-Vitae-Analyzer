'use strict';

angular.module('myApp.factories')
  .factory('results', function (rawResultModel) {
    var EDU_WEIGHT = 0.20, ESS_SKILL_WEIGHT = 0.20, PREF_SKILL_WEIGHT = 0.20,
      EXP_WEIGHT = 0.20, LANG_WEIGHT = 0.20;

    var allRawScoredCvs = rawResultModel.get();
    var scoredByCriteriaCvs = [];

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

    function formatRawResultsForPresentation() {
      allRawScoredCvs.forEach(function (rawScoredCv) {
        var educationScore = rawScoredCv.scoringCriteria.education;
        var essSkillsScore = rawScoredCv.scoringCriteria.essSkills;
        var prefSkillsScore = rawScoredCv.scoringCriteria.prefSkills;
        var expScore = rawScoredCv.scoringCriteria.experience;
        var languageScore = rawScoredCv.scoringCriteria.language;

        var evaluatedResult = new Result();
        evaluatedResult.id.value = rawScoredCv.id;

        // TODO: can factor out and use updateWeights for this
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
      return scoredByCriteriaCvs;
//      storageAccess.storeResults(scoredByCriteriaCvs);
//      console.log("scored CVS", scoredByCriteriaCvs);

    }

    //
    function updateWeights(weights) {
      // TODO: assert weights.length == no of keys
      // TODO: var total = add all values in array

      scoredByCriteriaCvs.forEach(function(scoredByCriteriaCv) {
        var totalScore = 0;
        for (var key in scoredByCriteriaCv.scoringCriteria) {
          if(scoredByCriteriaCv.scoringCriteria.hasOwnProperty(key)) {
            totalScore += scoredByCriteriaCv.scoringCriteria[key].value * weights[key]/total;
          }
        }
        //TODO: check if this saves into the scoredByCriteriaCvs var
        // or need to do scoredByCriteriaCvs[i].finalScore = totalScore
        scoredByCriteriaCv.finalScore = totalScore;
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
      formatRawResultsForPresentation: formatRawResultsForPresentation,
      /**
       * Accepts array of weights, with the keys being the scoring criteria (e.g. education, essSkills)
       * Calculates and updates scoredByCriteriaCvs with the new totalScore.
       * @param: Array[String] representing weights of each scoring criteria
       * @return: void
       */
      updateWeights: updateWeights
    }
  });