'use strict';

angular.module('myApp.factories')

    .factory('lemma', function (nlp) {

        //returns an array of result objects with institute, course, degree, date and grade fields
        var parseEducationBackground = function (sentenceArray) {
            var result = new CVEducation();
            result.degree = getDegree(sentenceArray);
            //console.log("degree parsed", result.degree);
            result.keywords = getNamedEntities(sentenceArray);
            //console.log("keywords parsed", result.keywords);
            return result;
        }

        var getDegree = function(sentenceArray) {
            //for categorising degree
            var allDegreeKeyWordsArray = [phdKeyWords, masterKeyWords, bachelorKeyWords, diplomaKeyWords];
            var result = 0;
            //takes in an array of keywords in degree
            //return to see what degree it is
            //not found: 0, diploma: 1, bachelor: 2, master: 3, phd: 4
            var categoriseDegree = function (keywords) {
                for (var i = 0; i < allDegreeKeyWordsArray.length; i++) {
                    var degreeKeyWords = allDegreeKeyWordsArray[i];
                    for (var j = 0; j < degreeKeyWords.length; j++) {
                        if (keywords.toLowerCase().indexOf(degreeKeyWords[j]) > -1) {
                            //we found keyword, return integer representing degree
                            return allDegreeKeyWordsArray.length - i;
                        }
                    }
                }
                //not found, return 0
                return 0;
            }
            //find degree
            sentenceArray.forEach(function (sentence) {
                //find degree
                var degree = categoriseDegree(sentence);
                //update degree if it is larger
                if (degree > result) {
                    result = degree;
                }
            });
            return result;
        }


        //get keywords
        //returns the keywords with its corresponding number of occurrences
        var getNamedEntities = function(sentenceArray) {
            var keyWordNames = [];
            sentenceArray.forEach(
                function (sentence) {
                    var tokens = nlp.spot(sentence);
                    var singularisedTokens = tokens.map(function(token) {
                        return token.analysis.singularize();
                    });
                    Array.prototype.push.apply(keyWordNames,singularisedTokens);
                    //because nlp library will not pick up the word research, which is quite important
                    if (sentence.toLowerCase().indexOf("research") >= 0) {
                        keyWordNames.push("research");
                    }
                }
            )
            //console.log("keywords parsed 1", keyWordNames);
            //store an array of Keyword objects
            var results = [];
            for (var i = 0; i < keyWordNames.length; i++) {
                var keyWord = findKeyWord(results, keyWordNames[i]);
                keyWord.name = keyWordNames[i];
                keyWord.value = keyWord.value + 1;
                results.push(keyWord);
            }
            return results;
        }

        //split by sentences, then commas within each sentence
        //used for parsing of Skills too
        var parseInterestsAndSkills = function(sentenceArray) {
            var keyWords = [];
            sentenceArray.forEach(
                function (sentence) {
                    var tokens = sentence.split(",");
                    keyWords = keyWords.concat(tokens.map(Function.prototype.call, String.prototype.trim));
                }
            )
            return keyWords;
        }

        //returns all the sentence splitted up by " "
        var parseLanguages = function (sentenceArray) {
            var results = [];
            sentenceArray.forEach(
                function (sentence) {
                    var tokens = sentence.split(" ");
                    results = results.concat(tokens);
                }
            )
            return results;
        }

        //var test = ["National University of Singapore", "MSCS, IT, 2010 - 2012"];
        //console.log(parseEducationBackground(test));
        return {
            find_and_parse_education: parseEducationBackground,
            parse_language: parseLanguages,
            parse_interest: parseInterestsAndSkills,
            parse_skills: parseInterestsAndSkills,
            parse_work: getNamedEntities,
            parse_research: getNamedEntities
        }
    }
)
;