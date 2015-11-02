'use strict';

angular.module('myApp.factories')
    .factory('cvEvaluator', function (stem, storageAccess) {
        var evaluateAllCv = function () {
            // WEIGHTAGES
            var EDU_WEIGHT = 1, ESS_SKILLS_WEIGHT = 1, PRE_SKILLS_WEIGHT = 1, LANG_WEIGHT = 1;

            var allCv = storageAccess.getAllCV();
            var jobDesc = storageAccess.getJobDescription();

            var stemmedJobDescription = stemJobDesc(jobDesc);
            var stemmedAllCv = allCv.map(function(cv) {return stemCv(cv);});

            var rankedCvs = [];
            //to change to suit new structure of cv
            //essential and preferredSkills is now an array of objects, where the key is the name of the skill, and value is the priority
            //TODO: adapt this to new format
            stemmedAllCv.forEach(function (stemmedCv) {
                var score = 0;

                // match education
                var educationScore = findMatchingWords(stemmedCv.education, stemmedJobDescription.education);

                // match skills
                var essentialSkillsScore = 0;
               /* stemmedJobDescription.essentialSkills.forEach(function (skill) {
                    essentialSkillsScore += findMatchingWords(skill, stemmedCv.skill)
                        + findMatchingWords(skill, stemmedCv.experience);
                });*/
                var essentialSkillsScore = findMatchingWords(stemmedJobDescription.essentialSkills, stemmedCv.skill)
                    + findMatchingWords(stemmedJobDescription.essentialSkills, stemmedCv.experience);
                console.log("cv essential skill match", essentialSkillsScore);

                var preferredSkillsScore = findMatchingWords(stemmedJobDescription.preferredSkills, stemmedCv.skill)
                    + findMatchingWords(stemmedJobDescription.preferredSkills, stemmedCv.experience);
                console.log("cv preferred skill match", preferredSkillsScore);

                // match language
                var languageScore = findMatchingWords(stemmedJobDescription.language, stemmedCv.language);
                console.log("cv language match", languageScore);

                var result = {
                    id: stemmedCv.id,
                    score: educationScore * EDU_WEIGHT
                        + essentialSkillsScore * ESS_SKILLS_WEIGHT
                        + preferredSkillsScore * PRE_SKILLS_WEIGHT
                        + languageScore * LANG_WEIGHT
                };
                rankedCvs.push(result);
            });

            console.log("ranked CVS", rankedCvs);
            return rankedCvs;
        };

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