'use strict';

angular.module('myApp.factories')

    .factory('jobDescriptionParser', function (nlp, parserUtils) {

        var findAndParseLocation = function (sentenceArray) {
            var results = [];
            sentenceArray.forEach(
                function (sentence) {
                    if (sentence.toLowerCase().indexOf("location") >= 0 || sentence.toLowerCase().indexOf("country") >= 0) {
                        var tokens = nlp.spot(sentence);
                        results = results.concat(tokens.map(function(token) { return token.analysis.singularize(); } ))
                    }
                }
            )
            return results;
        }


        var parseEducationKeywords = function (sentenceArray) {
            //sentenceArray -> each line is one element in the array
            var keywords = [];
            sentenceArray.forEach(
                function (sentence) {
                    if (sentence.toLowerCase().indexOf("university") >= 0 || sentence.toLowerCase().indexOf("degree") >= 0 || sentence.toLowerCase().indexOf("diploma") >= 0) {
                        keywords = parserUtils.get_named_entities_with_existing_results([sentence], keywords);
                    }
                }
            )
            return parserUtils.filter_education_keywords(keywords);
        }

        var parseEducationDegree = function (sentenceArray) {
            //sentenceArray -> each line is one element in the array
            var degree = 0;
            sentenceArray.forEach(
                function (sentence) {
                    if (sentence.toLowerCase().indexOf("university") >= 0 || sentence.toLowerCase().indexOf("degree") >= 0 || sentence.toLowerCase().indexOf("diploma") >= 0) {
                        var expectedDegree = categoriseDegree(sentence);
                        //take the min for now
                        degree = (expectedDegree != 0 && (degree === 0 || expectedDegree < degree)) ? expectedDegree : degree;
                    }
                }
            )
            return degree;
        }

        var findWorkTime = function (sentenceArray) {
            var result = 0;
            sentenceArray.forEach(
                function (sentence) {
                    var singularSentence = sentence.toLowerCase();
                    for (var i = 0; i < durationKeyWords.length; i++) {
                        var durationKeyWord = durationKeyWords[i];
                        var isIdentifierPresent = durationKeyWord.identifiers.some(function (i) {
                            return singularSentence.match(new RegExp("[\\d] " + i + "[s]?", "g"));
                        });
                        var isWorkKeyWordPresent = workKeyWords.some(function (v) {
                            return singularSentence.match(new RegExp("\\b" + v + "\\b", "i"));
                        });
                        if (isIdentifierPresent && isWorkKeyWordPresent) {
                            var duration = singularSentence.match(/[\d.]+/);
                            if (duration != null) {
                                result = duration * durationKeyWord.value;
                                break;
                            }
                        }
                    }
                }
            )
            return result;
        }

        var findLanguages = function (sentenceArray) {
            return parserUtils.parse_language(sentenceArray);
        }


        var getKeywords = function(sentenceArray) {
            return parserUtils.get_named_entities(sentenceArray);
        }

        //for categorising degree in education
        //takes in an array of keywords in degree
        //return to see what degree it is
        //not found: 0, diploma: 1, bachelor: 2, master: 3, phd: 4
        var categoriseDegree = function (keywords) {
            //order is diff, cos we want to consider the min
            var allDegreeKeyWordsArray = [diplomaKeyWords, bachelorKeyWords, masterKeyWords, phdKeyWords];
            for (var i = 0; i < allDegreeKeyWordsArray.length; i++) {
                var degreeKeyWords = allDegreeKeyWordsArray[i];
                for (var j = 0; j < degreeKeyWords.length; j++) {
                    if (keywords.toLowerCase().indexOf(degreeKeyWords[j]) > -1) {
                        //we found keyword, return integer representing degree
                        return i+1;
                    }
                }
            }
            //not specified
            return 0;
        }


        return {
            //use if there is no need to find the word in the phrase
            parse_min_req: getKeywords,
            parse_skills: getKeywords,
            parse_location: getKeywords,
            find_and_parse_location: findAndParseLocation,
            parse_education_keywords: parseEducationKeywords,
            parse_education_degree : parseEducationDegree,
            find_and_parse_work_time: findWorkTime,
            parse_languages: findLanguages

        }
    }
);