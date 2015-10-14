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
                // evaluate minimum requirements
                //to give different weightage
                //parse essential skills and preferred skills for now
                var essentialSkillsMatch = findMatchingWords(stemmedJobDescription.essentialSkills, stemmedCv.skill)
                    + findMatchingWords(stemmedJobDescription.essentialSkills, stemmedCv.experience);
                console.log("cv essential skill match", essentialSkillsMatch);

                var preferredSkillsMatch = findMatchingWords(stemmedJobDescription.preferredSkills, stemmedCv.skill)
                + findMatchingWords(stemmedJobDescription.preferredSkills, stemmedCv.experience);
                console.log("cv preferred skill match", preferredSkillsMatch);
                var result = {
                    id: stemmedCv.id,
                    score: essentialSkillsMatch + preferredSkillsMatch
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
            //results will contain all of the matched words between word source 1 and word source 2
            var results = [];

            for (var i = 0; i < wordsOfSource1.length; i++) {
                //for each word, check the entire wordsOfSource2?
                var hasKeyWord = function (keyWord) {
                    return wordsOfSource1[i].toLowerCase().indexOf(keyWord.toLowerCase() > 0);
                };
                var matchedWords = wordsOfSource2.filter(hasKeyWord);
                results = results.concat(matchedWords);
            }
            return results.length;
        }

        function stemCv(cv) {
            var stemmedCv = new CV();
//            stemmedCv.education = stem.stem(cv.education);
            stemmedCv.language = stem.stem(cv.language);
            stemmedCv.interest = stem.stem(cv.interest);
            stemmedCv.skill = stem.stem(cv.skill);
            stemmedCv.experience = stem.stem(cv.experience);
            stemmedCv.id = cv.id;
            return stemmedCv;
        }

        function stemJobDesc(jobDesc) {
            var stemmedJobDescription = new JobDescription();
            stemmedJobDescription.essentialSkills = stem.stem(jobDesc.essentialSkills);
            stemmedJobDescription.preferredSkills = stem.stem(jobDesc.preferredSkills);
            stemmedJobDescription.location = stem.stem(jobDesc.location);
            stemmedJobDescription.education = stem.stem(jobDesc.education);
//            stemmedJobDescription.workExperienceTime = stem.stem(jobDesc.workExperienceTime);
            return stemmedJobDescription;
        }

        return {
            evaluateCV: evaluateAllCv
        }
    });