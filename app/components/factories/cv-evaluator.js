'use strict';

angular.module('myApp.factories')
    .factory('cvEvaluator', function (storageAccess) {
        var EDU_WEIGHT = 0.20, ESS_SKILL_WEIGHT = 0.20, PREF_SKILL_WEIGHT = 0.20,
            EXP_WEIGHT = 0.20, LANG_WEIGHT = 0.20;

        var evaluateAllCv = function () {
            var allCv = storageAccess.getAllCV();
            var jobDesc = storageAccess.getJobDescription();

            var rankedCvs = [];
            allCv.forEach(function (cv) {
                console.log("CV: ", cv.id);

                var educationScore = calcEducationScore(cv.education, jobDesc.education);
                console.log("education: ", educationScore);

                var essSkillsScore = calcSkillsScore(cv, jobDesc.essentialSkills);
                console.log("essential skills: ", essSkillsScore);

                var prefSkillsScore = calcSkillsScore(cv, jobDesc.preferredSkills);
                console.log("preferred skills: ", prefSkillsScore);

                var expScore = calcExpScore(cv.experience, jobDesc.experience);
                console.log("experience: ", expScore);

                var languageScore = calcLanguageScore(cv.languages, jobDesc.languages);
                console.log("language: ", languageScore);

                // compute total score
                var totalScore = educationScore * EDU_WEIGHT
                                + essSkillsScore * ESS_SKILL_WEIGHT
                                + prefSkillsScore * PREF_SKILL_WEIGHT
                                + expScore * EXP_WEIGHT
                                + languageScore * LANG_WEIGHT;
                console.log("totalScore: ", totalScore);

                var result = {
                    id: cv.id,
                    score: totalScore.toFixed(2),
                    education: educationScore.toFixed(2),
                    essSkills: essSkillsScore.toFixed(2),
                    prefSkills: prefSkillsScore.toFixed(2),
                    experience: expScore.toFixed(2),
                    language: languageScore.toFixed(2)
                };
                console.log(result);
                rankedCvs.push(result);
            });

            storageAccess.storeResults(rankedCvs);
            console.log("ranked CVS", rankedCvs);
        };

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

            var totalScore = (skillCount * SKILLS_WEIGHT + expCount * EXP_WEIGHT + interestCount * INTEREST_WEIGHT) /
                (jdSkills.length * WEIGHT_NORM) * 100;
            return totalScore > 100 ? 100 : totalScore;
        }

        /* EXPERIENCE SCORING */
        // Returns 100% if attained minimum
        // If experience lesser than requirement return 0
        function calcExpScore(cvExp, jdExp) {
            var EXP_NORMAL = 100;

            if(cvExp < jdExp)
                return 0;
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
                    if(lang.name === jdLang[i].name) {
                        count++;
                        break;
                    }
                }
            });

            return count/jdLang.length * 100;
        }

        // update weights
        function updateWeights(edu, essSkill, prefSkill, expe, lang) {
            var total = edu + essSkill + prefSkill + expe + lang;

            EDU_WEIGHT = edu/total;
            ESS_SKILL_WEIGHT = essSkill/total;
            PREF_SKILL_WEIGHT = prefSkill/total;
            EXP_WEIGHT = expe/total;
            LANG_WEIGHT = lang/total;

            evaluateAllCv();
        }

        //returns number of matched words
        function findMatchingWords(source1, source2) {
            var results = [];

            for (var i = 0; i < source1.length; i++) {
                //for each word, check the entire wordsOfSource2?
                var hasKeyWord = function (keyWord) {
                    return source1[i].toLowerCase().indexOf(keyWord.toLowerCase()) >= 0;
                };
                var matchedWords = source2.filter(hasKeyWord);
                results = results.concat(matchedWords);
            }
            /**
             * uniqueArray = a.filter(function(item, pos) {
                    return a.indexOf(item) == pos;
                })
             */
            console.log("matched results", results);
            return results.length;
        }

        return {
            evaluateCV: evaluateAllCv,
            update: updateWeights
        }
    });