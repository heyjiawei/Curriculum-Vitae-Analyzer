'use strict';

angular.module('myApp.factories')
    .factory('cvEvaluator', function (stem, storageAccess) {
        var evaluateAllCv = function () {

            var allCv = storageAccess.getAllCV();
            var jobDesc = storageAccess.getJobDescription();

            var stemmedJobDescription = stemJobDesc(jobDesc);
            var stemmedAllCv = allCv.map(function(cv) {return stemCv(cv);});

            var rankedCvs = [];
            stemmedAllCv.forEach(function (stemmedCv) {
                console.log("CV: ", stemmedCv.id);

                var educationScore = calcEducationScore(stemmedCv.education, stemmedJobDescription.education);
                console.log("education: ", educationScore);

                var skillsScore = calcSkillsScore(stemmedCv.skill, stemmedJobDescription.essentialSkills, stemmedJobDescription.preferredSkills);
                console.log("skills: ", skillsScore);

                var expScore = calcExpScore(stemmedCv.experience, stemmedJobDescription.experience);
                console.log("experience: ", expScore);

                /*var languageScore = findMatchingWords(stemmedJobDescription.language, stemmedCv.language);
                console.log("language: ", languageScore);*/

                // TODO include weightage calculations
                var result = {
                    id: stemmedCv.id,
                    score: educationScore
                        + skillsScore
                };
                console.log(result.score);
                rankedCvs.push(result);
            });

            console.log("ranked CVS", rankedCvs);
            return rankedCvs;
        };

        /* EDUCATION SCORING */
        // Initial score based on number of matching keywords
        // Then compare degree levels, if not matched, multiplier is 0, else difference is multiplier
        function calcEducationScore(cvEdu, jdEdu) {
            var score = findMatchingWords(cvEdu.keywords, jdEdu.keywords);

            // if user has no degree level preference
            if(jdEdu.degree == 0) {
                if(cvEdu != 0)
                    return score*cvEdu.degree;
                else
                    return score;
            // if user has degree level preference
            } else {
                return score * (cvEdu.degree>=jdEdu.degree ? jdEdu.degree-cvEdu : 0);
            }

            return score;
        }

        /* SKILLS SCORING */
        // For each cv skill that appears in and jd skills, value is summed
        // Essential skills get multiplier of 1.5
        function calcSkillsScore(cvSkills, jdEssSkills, jdPrefSkills) {
            var ESS_SKILL_MULTIPLIER = 1, PREF_SKILL_MULTIPLIER = 1.5;

            var score = 0;
            cvSkills.forEach(function (skill) {
                for(var i=0; i<jdEssSkills.length; i++) {
                    if(skill.name === jdEssSkills[i].name) {
                        score += skill.value * ESS_SKILL_MULTIPLIER;
                        break;
                    }
                }
                for(var i=0; i<jdPrefSkills.length; i++) {
                    if(skill.name === jdPrefSkills[i].name) {
                        score += skill.value * PREF_SKILL_MULTIPLIER;
                        break;
                    }
                }
            });
        }

        /* EXPERIENCE SCORING */
        // Returns score based on percentage greater than requirement divided by 10 (to get single digit score)
        // If experience lesser than requirement return 0
        function calcExpScore(cvExp, jdExp) {
            if(cvExp < jdExp)
                return 0;
            else
                return (cvExp-jdExp)/jdExp*10;
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