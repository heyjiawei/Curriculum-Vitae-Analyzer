'use strict';

angular.module('myApp.factories')

    .factory('lemma', function (nlp) {

        //returns an array of result objects with institute, course, degree, date and grade fields
        var parseEducationBackground = function (sentenceArray) {

            //console.log(nlp.pos("1.5 years of experience"));
            function Result() {
                this.keywords = [];
                this.degree = 0;
            };
            var diplomaKeyWords = ["diploma"];
            var bachelorKeyWords = ["bachelor's", "bachelor", "bsc", "be"];
            var masterKeyWords =  ["master", "master's", "mscs", "msc"];
            var phdKeyWords = ["phd", "ph.d", "doctorate"];
            //for categorising degree
            var degreeKeyWordsArray = [ phdKeyWords, masterKeyWords, bachelorKeyWords, diplomaKeyWords];
            //takes in an array of keywords in degree
            //return to see what degree it is
            //not found: 0, diploma: 1, bachelor: 2, master: 3, phd: 4
            var categoriseDegree = function(keywords) {
                for (var i = 0; i < degreeKeyWordsArray.length; i++) {
                    var currentKeyWords = degreeKeyWordsArray[i];
                    for (var j = 0; j < currentKeyWords.length; j++) {
                        if (keywords.indexOf(currentKeyWords[j]) > -1) {
                            //we found keyword, return integer representing degree
                            return degreeKeyWordsArray.length - i;
                        }
                    }
                }
                //not found, return 0
                return 0;
            }

            var result = new Result();
            sentenceArray.forEach(function(sentence) {
                //find degree
                var degree = categoriseDegree(sentence.split(" "));
                //update degree if it is larger
                if (degree > result.degree) {
                    result.degree = degree;
                }
                var tokens = nlp.spot(sentence);
                //get keywords (for subject), push into keyword
                tokens.forEach(
                    function(token) {
                        result.keywords.push(token.analysis.singularize());
                    }
                )
                if (sentence.toLowerCase().indexOf("IT") >= 0) {
                    results.push("IT");
                }
            });


            return result;
        }

        //get keywords from work experience
        var parseWorkExperience = function(sentenceArray) {
            var results = [];
            sentenceArray.forEach(
                function (sentence) {
                    var tokens = nlp.spot(sentence);
                    tokens.forEach(
                        function(token) {
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

        //split by sentences, then commas within each sentence
        //used for parsing of Skills too
        var parseInterestsAndSkills = function(sentenceArray) {
            var results = [];
            sentenceArray.forEach(
                function (sentence) {
                    var tokens = sentence.split(",");
                    results = results.concat(tokens.map(Function.prototype.call, String.prototype.trim));
                }
            )
            return results;
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
            parse_work: parseWorkExperience
        }
    }
)
;