'use strict';

angular.module('cvia.factories')
    .factory('cvEvaluator', function () {

        /* EDUCATION SCORING */
        // Initial score based on number of matching keywords
        // Then compare, if degree less than minimum, return 0, else 100
        function calcEducationScore(cvEdu, jdEdu) {
            var eduCount = findMatchingWords(cvEdu.keywords, jdEdu.keywords);

            // if user has no degree level or course preference
            if(jdEdu.degree == 0 && jdEdu.keywords.length == 0) {
                return 100;
            } else if(jdEdu.degree == 0) {
                return eduCount/jdEdu.keywords.length * 100;
            } else if(jdEdu.keywords.length == 0) {
                return cvEdu.degree >= jdEdu.degree ? 100 : 0;
            } else {
                return ((cvEdu.degree >= jdEdu.degree ? 100 : 0) + eduCount/jdEdu.keywords.length*100) / 2;
            }
            //console.log("degree", jdEdu.degree, cvEdu.degree);
            //console.log("eduCount", cvEdu.keywords, jdEdu.keywords);
        }

        /* SKILLS SCORING */
        // The score is the percentage number of skill keywords matched with weightage of each category matching
        function calcSkillsScore(cv, jdSkills) {
            if (jdSkills.length == 0) {
                return 100;
            }
            var SKILLS_WEIGHT = 3, EXP_WEIGHT = 1.5, INTEREST_WEIGHT = 0.5;
            var WEIGHT_NORM = SKILLS_WEIGHT + EXP_WEIGHT + INTEREST_WEIGHT;

            var skillCount = findMatchingWords(cv.skill, jdSkills);

            var expCount = findMatchingWords(cv.experience, jdSkills);

            var interestCount = findMatchingWords(cv.interest, jdSkills);
            var totalScore;
            var totalSkillsLength = cv.skill.length * SKILLS_WEIGHT + cv.experience.length * EXP_WEIGHT + cv.interest.length * INTEREST_WEIGHT;
            if (totalSkillsLength == 0) {
                return 0;
            } else {
                totalScore = (skillCount * SKILLS_WEIGHT + expCount * EXP_WEIGHT + interestCount * INTEREST_WEIGHT) /
                    (totalSkillsLength) * 100;
                return totalScore > 100 ? 100 : totalScore;
            }
        }

        /* EXPERIENCE SCORING */
        // Returns 100% if attained minimum
        // If experience lesser than requirement return 0
        function calcExpScore(cvExp, jdExp) {
            var EXP_NORMAL = 100;
            console.log("cvExp", cvExp);
            console.log("jdExp", jdExp);
            if(cvExp < jdExp)
                return cvExp/jdExp * 100;
            else
                return EXP_NORMAL;
        }

        /* LANGUAGE SCORING */
        // The score is the percentage number of language keywords matched
        function calcLanguageScore(cvLang, jdLang) {
            if(jdLang.length == 0) {
                return 100;
            }

            var count = 0;
            cvLang.forEach(function (lang) {
                for(var i=0; i<jdLang.length; i++) {
                    if(lang === jdLang[i]) {
                        count++;
                        break;
                    }
                }
            });
            return count/jdLang.length * 100;
        }

        //returns number of matched words
        function findMatchingWords(source1, source2) {
            var results = [];
            console.log("source 1", source1);
            console.log("source 2", source2);
            for (var i = 0; i < source1.length; i++) {
                //for each word, check the entire wordsOfSource2?
                var hasKeyWord = function (keyWord) {
                    return source1[i].toLowerCase().indexOf(keyWord.toLowerCase()) >= 0;
                };
                var matchedWords = source2.filter(hasKeyWord);
                results = results.concat(matchedWords);
            }
            console.log("outcome", results);
            console.log("outcome length", results.length);
            return results.length;
        }

        return {
            /**
             *
             */
            calcEducationScore: calcEducationScore,
            calcSkillsScore: calcSkillsScore,
            calcExpScore: calcExpScore,
            calcLanguageScore: calcLanguageScore
        }
    });