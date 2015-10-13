'use strict';

angular.module('myApp.factories')

    .factory('job-description-parser', function (nlp) {

        //use named-entity recognition to pick keywords
        var findKeywords = function (sentenceArray) {
            var results = [];
            sentenceArray.forEach(
                function (sentence) {
                    var tokens = nlp.spot(sentence);
                    tokens.forEach(
                        function (token) {
                            results.push(token.analysis.singularize());
                        }
                    )
                    //because nlp library will not pick up the word research, which is quite important
                    if (sentence.toLowerCase().indexOf("research") >= 0) {
                        results.push("research");
                    }
                }
            )

            return results;
        }

        var findAndParseLocation = function (sentenceArray) {
            sentenceArray.forEach(
                function (sentence) {
                    if (sentence.toLowerCase().indexOf("location") >= 0 || sentence.toLowerCase().indexOf("country") >= 0 ) {
                        var tokens = nlp.spot(sentence);
                        return tokens;
                    }
                }
            )
        }

        //parse min requirements inside?
        //can parse job description line by line?
        var parseEducation = function (sentenceArray) {
            //find word degree, get sentence
            //sentenceArray -> each line is one element in the array
            sentenceArray.forEach(
                function (sentence) {
                    if (sentence.toLowerCase().indexOf("university") >= 0 || sentence.toLowerCase().indexOf("degree") >= 0  || sentence.toLowerCase().indexOf("diploma") >= 0) {
                        var tokens = nlp.spot(sentence);
                        return tokens;
                    }
                }
            )
        }


        var parseEducation = function (sentenceArray) {
            //find word degree, get sentence
            //sentenceArray -> each line is one element in the array
            sentenceArray.forEach(
                function (sentence) {
                    if (sentence.toLowerCase().indexOf("university") >= 0 || sentence.toLowerCase().indexOf("degree") >= 0  || sentence.toLowerCase().indexOf("diploma") >= 0) {
                        var tokens = nlp.spot(sentence);
                        return tokens;
                    }
                }
            )
        }
        var findLanguages;

        var findWorkTime = function(sentenceArray) {
            var durationKeyWords = ["year", "month"];
            var workKeyWords = ["work", "experience"];
            var result = {
                value: "",
                duration: ""
            };
            sentenceArray.forEach(
                function (sentence) {
                    var singularSentence = nlp.singularize(sentence).toLowerCase();
                    durationKeyWords.forEach(
                        function(keyWord) {
                            var durationRegex = new RegExp( "/[\d] " + keyWord +"[s]?/g");
                            if (singularSentence.match(durationRegex) &&
                                workKeyWords.some(function(v) { return singularSentece.match(new RegExp("/\b" + v + "\b/i"));})) {
                                result.value = str.replace(/\D+$/g, "");
                                result.duration = keyWord;
                                return result;
                            }
                        }
                    )
                }
            )
        }
        return {
            //use if there is no need to find the word in the phrase
            parse_min_req: findKeywords,
            parse_skills: findKeywords,
            parse_location: findKeywords,
            find_and_parse_location: findAndParseLocation,
            find_and_parse_education: parseEducation,
            find_and_parse_work_time: findWorkTime,
            parse_languages: findLanguages

        }
    }
)
;