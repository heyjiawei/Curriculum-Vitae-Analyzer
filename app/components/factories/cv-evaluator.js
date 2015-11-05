'use strict';

angular.module('myApp.factories')
    .factory('cvEvaluator', function (stem, storageAccess) {
        var evaluateAllCv = function () {
            var EDU_WEIGHT = 0.20, ESS_SKILL_WEIGHT = 0.20, PREF_SKILL_WEIGHT = 0.20,
                EXP_WEIGHT = 0.20, LANG_WEIGHT = 0.20;

            var allCv = storageAccess.getAllCV();
            var jobDesc = storageAccess.getJobDescription();

            var stemmedJobDescription = stemJobDesc(jobDesc);
            var stemmedAllCv = allCv.map(function(cv) {return stemCv(cv);});

            var rankedCvs = [];
            stemmedAllCv.forEach(function (stemmedCv) {
                console.log("CV: ", stemmedCv.id);

                var educationScore = calcEducationScore(stemmedCv.education, stemmedJobDescription.education);
                console.log("education: ", educationScore);

                var essSkillsScore = calcSkillsScore(stemmedCv, stemmedJobDescription.essentialSkills);
                console.log("essential skills: ", essSkillsScore);

                var prefSkillsScore = calcSkillsScore(stemmedCv, stemmedJobDescription.preferredSkills);
                console.log("preferred skills: ", prefSkillsScore);

                var expScore = calcExpScore(stemmedCv.experience, stemmedJobDescription.experience);
                console.log("experience: ", expScore);

                var languageScore = calcLanguageScore(stemmedCv.languages, stemmedJobDescription.languages);
                console.log("language: ", languageScore);

                // compute total score
                var totalScore = educationScore * EDU_WEIGHT
                                + essSkillsScore * ESS_SKILL_WEIGHT
                                + prefSkillsScore * PREF_SKILL_WEIGHT
                                + expScore * EXP_WEIGHT
                                + languageScore * LANG_WEIGHT;
                console.log("totalScore: ", totalScore);

                var result = {
                    id: stemmedCv.id,
                    score: totalScore,
                    education: educationScore,
                    essSkills: essSkillsScore,
                    prefSkills: prefSkillsScore,
                    experience: expScore,
                    language: languageScore
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
            var EDU_NORMAL = 100;
            var score = findMatchingWords(cvEdu.keywords, jdEdu.keywords);

            // if user has no degree level preference
            if(jdEdu.degree == 0) {
                if(cvEdu != 0)
                    return score*cvEdu.degree;
                else
                    return score;
            // if user has degree level preference
            } else {
                return score * (cvEdu.degree>=jdEdu.degree ? EDU_NORMAL : 0);
            }

            return score;
        }

        /* SKILLS SCORING */
        // The score is the percentage number of skill keywords matched with weightage of each category matching
        function calcSkillsScore(cv, jdSkills) {
            if (jdSkills.length == 0) {
                return 100;
            }

            var SKILLS_WEIGHT = 3, EXP_WEIGHT = 1.5, INTEREST_WEIGHT = 0.5;
            var WEIGHT_NORM = SKILLS_WEIGHT + EXP_WEIGHT + INTEREST_WEIGHT;

            var skillCount = 0;
            cv.skill.forEach(function (skill) {
                for (var i = 0; i < jdSkills.length; i++) {
                    if (skill.name === jdSkills[i].name) {
                        skillCount++;
                        break;
                    }
                }
            });

            var expCount = 0;
            cv.experience.forEach(function (exp) {
                for (var i = 0; i < jdSkills.length; i++) {
                    if (exp.name === jdSkills[i].name) {
                        expCount++;
                        break;
                    }
                }
            });

            var interestCount = 0;
            cv.interest.forEach(function (interest) {
                for (var i = 0; i < jdSkills.length; i++) {
                    if (interest === jdSkills[i].name) {
                        interestCount++;
                        break;
                    }
                }
            });

            return (skillCount * SKILLS_WEIGHT + expCount * EXP_WEIGHT + interestCount * INTEREST_WEIGHT) /
                (jdSkills.length * WEIGHT_NORM) * 100;
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

        //returns number of matched words
        function findMatchingWords(source1, source2) {
            var wordsOfSource1 = source1.join(" ").split(" ");
            var wordsOfSource2 = source2.join(" ").split(" ");
            console.log("1", wordsOfSource1, "2", wordsOfSource2);
            //results will contain all of the matched words between word source 1 and word source 2
            var results = [];

            for (var i = 0; i < wordsOfSource1.length; i++) {
                //for each word, check the entire wordsOfSource2?
                var hasKeyWord = function (keyWord) {
                    return wordsOfSource1[i].toLowerCase().indexOf(keyWord.toLowerCase()) >= 0;
                };
                var matchedWords = wordsOfSource2.filter(hasKeyWord);
                console.log("match?", matchedWords);
                results = results.concat(matchedWords);
            }
            return results.length;
        }

        function stemCv(cv) {
            var stemmedCv = new CV();
            //need to stem keys only if needed
            stemmedCv.education = cv.education;
            stemmedCv.education.keywords = stem.stemKeyWords(stemmedCv.education.keywords);
            stemmedCv.language = stem.stem(cv.language);
            stemmedCv.interest = stem.stem(cv.interest);
            stemmedCv.skill = stem.stem(cv.skill);
            stemmedCv.experience = stem.stemKeyWords(cv.experience);
            stemmedCv.workExperienceTime = cv.workExperienceTime;
            stemmedCv.id = cv.id;
            console.log("stemmed cv", stemmedCv);
            return stemmedCv;
        }

        function stemJobDesc(jobDesc) {
            var stemmedJobDescription = new JobDescription();
            stemmedJobDescription.essentialSkills = stem.stemKeyWords(jobDesc.essentialSkills);
            stemmedJobDescription.preferredSkills = stem.stemKeyWords(jobDesc.preferredSkills);
            stemmedJobDescription.location = jobDesc.location;
            stemmedJobDescription.education = jobDesc.education;
            stemmedJobDescription.education.keywords = stem.stemKeyWords(stemmedJobDescription.education.keywords);
            stemmedJobDescription.workExperienceTime = jobDesc.workExperienceTime;
            console.log("stemmed job desc", stemmedJobDescription);
            return stemmedJobDescription;
        }

        return {
            evaluateCV: evaluateAllCv
        }
    });