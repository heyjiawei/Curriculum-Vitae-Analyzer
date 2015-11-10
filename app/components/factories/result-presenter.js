'use strict';

angular.module('cvia.factories')
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
            this.name = {name: "Name", value: "Placeholder Name"};
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
            scoredByCriteriaCvs = [];
            allRawScoredCvs.forEach(function (rawScoredCv) {
                var educationScore = rawScoredCv.scoringCriteria.education;
                var essSkillsScore = rawScoredCv.scoringCriteria.essSkills;
                var prefSkillsScore = rawScoredCv.scoringCriteria.prefSkills;
                var expScore = rawScoredCv.scoringCriteria.experience;
                var languageScore = rawScoredCv.scoringCriteria.language;

                var evaluatedResult = new Result();
                evaluatedResult.name.value = rawScoredCv.name;

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
            /**
             * Returns the definitions of the headers for resultsView
             * @param: void
             * @return: Result object
             */
            getHeaderDefinitions: getHeaderDefinitions,
            /**
             * Retrieves the raw results and format them into the content needed for display
             * @param: void
             * @return: array of Result object
             */
            formatRawResultsForPresentation: formatRawResultsForPresentation,
            /**
             * Accepts a Weight object
             * Calculates and updates scoredByCriteriaCvs with the new totalScore.
             * @param: Weight object
             * @return: void
             */
            updateWeights: updateWeights,
            /**
             * Returns the current weights used by the presenter
             * @param: void
             * @return: Weight object
             */
            getWeights: getWeights
        }
    });