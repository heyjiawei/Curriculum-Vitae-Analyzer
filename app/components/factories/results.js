'use strict';

angular.module('myApp.factories')
    .factory('results', function (rawResultModel) {
        var EDU_WEIGHT = 1, ESS_SKILL_WEIGHT = 1, PREF_SKILL_WEIGHT = 1,
            EXP_WEIGHT = 1, LANG_WEIGHT = 1;

        function DefaultWeight() {
            this.education = EDU_WEIGHT,
            this.essSkills = ESS_SKILL_WEIGHT,
            this.prefSkills = PREF_SKILL_WEIGHT,
            this.experience = EXP_WEIGHT,
            this.language = LANG_WEIGHT;
        }
        var allRawScoredCvs = rawResultModel.get();
        var scoredByCriteriaCvs = [];
        var weights = new DefaultWeight();

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

            this.updateScore = function () {
                //get denominator
                var weightDenominator = 0
                for (var key in weights) {
                    if (weights.hasOwnProperty(key)) {
                        weightDenominator += weights[key];
                    }
                }
                //calculate total score
                var totalScore = 0;
                for (var key in weights) {
                    if (this.scoringCriteria.hasOwnProperty(key) && weights.hasOwnProperty(key)) {
                        totalScore += this.scoringCriteria[key].value * (weights[key] / weightDenominator);
                    }
                }
                this.finalScore.value = totalScore;
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

                evaluatedResult.scoringCriteria.education.value = educationScore;
                evaluatedResult.scoringCriteria.essSkills.value = essSkillsScore;
                evaluatedResult.scoringCriteria.prefSkills.value = prefSkillsScore;
                evaluatedResult.scoringCriteria.experience.value = expScore;
                evaluatedResult.scoringCriteria.language.value = languageScore;
                evaluatedResult.updateScore();
                scoredByCriteriaCvs.push(evaluatedResult);
            });
            return scoredByCriteriaCvs;
        }
        function getWeights() {
            return weights;
        }

        //
        function updateWeights(weights) {
            ////// TODO: assert weights.length == no of keys
            //var total = 0;
            //for (var key in weights) {
            //  total += weights[key];
            //}
            //
            //scoredByCriteriaCvs.forEach(function(scoredByCriteriaCv) {
            //  var totalScore = 0;
            //  for (var key in scoredByCriteriaCv.scoringCriteria) {
            //    if(scoredByCriteriaCv.scoringCriteria.hasOwnProperty(key)) {
            //      scoredByCriteriaCv.scoringCriteria[key].weight = weights[key]/total;
            //      totalScore += scoredByCriteriaCv.scoringCriteria[key].value * weights[key]/total;
            //    }
            //  }
            //  scoredByCriteriaCv.finalScore.value = totalScore;
            //
            //});
        }

        //return an empty result for the definition of the headers
        function getHeaderDefinitions() {
            return new Result();
        }

        return {
            getHeaderDefinitions: getHeaderDefinitions,
            formatRawResultsForPresentation: formatRawResultsForPresentation,
            /**
             * Accepts array of weights, with the keys being the scoring criteria (e.g. education, essSkills)
             * Calculates and updates scoredByCriteriaCvs with the new totalScore.
             * @param: Array[String] representing weights of each scoring criteria
             * @return: void
             */
            updateWeights: updateWeights,
            getWeights: getWeights
        }
    });