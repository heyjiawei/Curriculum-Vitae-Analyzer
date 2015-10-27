'use strict';

angular.module('myApp.factories')

    .factory('jobDescriptionParser', function (nlp) {

        //use named-entity recognition to pick keywords
        //returns the keywords with its corresponding number of occurrences
        var findKeywords = function (sentenceArray) {
            var keyWords = [];
            sentenceArray.forEach(
                function (sentence) {
                    var tokens = nlp.spot(sentence);
                    keyWords = keyWords.concat(tokens.map(function(token) { return token.analysis.singularize(); } ))
                    //because nlp library will not pick up the word research, which is quite important
                    if (sentence.toLowerCase().indexOf("research") >= 0) {
                        keyWords.push("research");
                    }
                }
            )
            //console.log("sentence", keyWords);
            //count number of each words
            var results = { };
            for (var i = 0; i < keyWords.length; i++) {
                results[keyWords[i]] = (results[keyWords[i]] || 0) + 1;
            }
            return results;
        }

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

        //parse min requirements inside?
        //can parse job description line by line?
        var findAndParseEducation = function (sentenceArray) {
            //find word degree, get sentence
            //sentenceArray -> each line is one element in the array
            var results = [];
            sentenceArray.forEach(
                function (sentence) {
                    if (sentence.toLowerCase().indexOf("university") >= 0 || sentence.toLowerCase().indexOf("degree") >= 0 || sentence.toLowerCase().indexOf("diploma") >= 0) {
                        var tokens = nlp.spot(sentence);
                        results = results.concat(tokens.map(function(token) { return token.analysis.singularize(); } ))
                    }
                }
            )
            return results;
        }

        var findWorkTime = function (sentenceArray) {
            var durationKeyWords = ["year", "month"];
            var workKeyWords = ["work", "experience"];
            var result = {
                value: "",
                duration: ""
            };
            sentenceArray.forEach(
                function (sentence) {
                    var singularSentence = sentence.toLowerCase();
                    durationKeyWords.forEach(
                        function (keyWord) {
                            var durationRegex = new RegExp("[\\d] " + keyWord + "[s]?", "g");
                            if (singularSentence.match(durationRegex) &&
                                workKeyWords.some(function (v) {
                                    return singularSentence.match(new RegExp("\\b" + v + "\\b", "i"));
                                })) {
                                result.value = singularSentence.replace(/\D+$/g, "");
                                result.duration = keyWord;
                            }
                        }
                    )
                }
            )
            return result;
        }

        var findLanguages = function (sentenceArray) {
            var result = [];
            sentenceArray.forEach(
                function (sentence) {
                    var singularSentence = sentence.toLowerCase();
                    if (singularSentence.match(new RegExp("\\blanguage[s]?", "g"))) {
                        result = result.concat(singularSentence.split(" "));
                    }
                }
            )
            return result;
        }

        return {
            //use if there is no need to find the word in the phrase
            parse_min_req: findKeywords,
            parse_skills: findKeywords,
            parse_location: findKeywords,
            find_and_parse_location: findAndParseLocation,
            find_and_parse_education: findAndParseEducation,
            find_and_parse_work_time: findWorkTime,
            parse_languages: findLanguages

        }
    }
)
;