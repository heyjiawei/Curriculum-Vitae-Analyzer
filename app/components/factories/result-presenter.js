'use strict';

angular.module('myApp.factories')
    .factory('resultPresenter', function (rawResultModel) {

        function DefaultWeight() {
            this.education = 1,
            this.essSkills = 1,
            this.prefSkills = 1,
            this.experience = 1,
            this.language = 1;
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

        //
        function updateWeights(newWeights) {
            //TODO: assert weights.length == no of keys
            weights = newWeights;
            scoredByCriteriaCvs.forEach(function (scoredByCriteriaCv) {
                scoredByCriteriaCv.updateScore();
            });
        }

        //return an empty result for the definition of the headers
        function getHeaderDefinitions() {
            return new Result();
        }

        //get weights for initialisation
        function getWeights() {
            return weights;
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