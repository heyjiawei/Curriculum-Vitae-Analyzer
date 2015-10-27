'use strict';

angular.module('myApp.factories')

    .factory('lemma', function (nlp) {

        //returns an array of result objects with institute, course, degree, date and grade fields
        var parseEducationBackground = function (sentenceArray) {

            //console.log(nlp.pos("1.5 years of experience"));
            function Result() {
                this.institute = [];
                this.course = [];
                this.degree = [];
                this.date = [];
                this.grade = [];
            };
            var results = [];
            var instituteKeyWords = ["college", "university", "institute"];
            var courseKeyWords = ["computer", "computing", "engineering", "information technology", "physics", "it", "neuroscience"];
            var degreeKeyWords = ["bachelor's", "bachelor", "bsc", "master", "master's", "phd", "ph.d", "degree", "mscs", "msc", "be", "diploma"];
            var gradeKeyWords = ["grade:", "cap", "gpa"];
            var prev = null;
            var result = new Result();
            sentenceArray.forEach(
                function (sentence) {
                    //assume 1 sentence
                    var tokens = nlp.pos(sentence).sentences[0].tokens;
                    console.log("tokens", tokens);
                    tokens.forEach(
                        function (token) {
                            var hasKeyWord = function (keyWord) {
                                return token.text.toLowerCase().indexOf(keyWord) >= 0;
                            };
                            if (token.pos.tag === "NN" || token.pos.tag === "PRP") {
                                var isGrade = gradeKeyWords.some(hasKeyWord);
                                var isInstitute = instituteKeyWords.some(hasKeyWord);
                                var isCourse = courseKeyWords.some(hasKeyWord);
                                var isDegree = degreeKeyWords.some(hasKeyWord);
                                var idk = !(isInstitute || isCourse || isDegree || isGrade);
                                if (isInstitute || (idk && prev === "institute")) {
                                    if (prev !== "institute" && result.institute.length > 0) {
                                        results.push(result);
                                        result = new Result();
                                    }
                                    result.institute.push(token.text);
                                    prev = "institute"
                                } else if (isCourse || (idk && prev === "course")) {
                                    if (prev !== "course" && result.course.length > 0) {
                                        results.push(result);
                                        result = new Result();
                                    }
                                    result.course.push(token.text);
                                    prev = "course"
                                } else if (isDegree || (idk && prev === "degree")) {
                                    if (prev !== "degree" && result.degree.length > 0) {
                                        results.push(result);
                                        result = new Result();
                                    }
                                    result.degree.push(token.text);
                                    prev = "degree"
                                } else if (isGrade) {
                                    if (prev !== "grade" && result.grade.length > 0) {
                                        results.push(result);
                                        result = new Result();
                                    }
                                    prev = "grade"
                                } else {
                                    result.institute.push(token.text);
                                    prev = "institute"
                                }
                            } else if (token.pos.tag === "CD") {
                                //we have a number
                                if (prev == "grade") {
                                    result.grade.push(token.text);
                                } else {
                                    if (prev !== "date" && result.date.length > 0) {
                                        results.push(result);
                                        result = new Result();
                                    }
                                    result.date.push(token.text);
                                    prev = "date"
                                }
                            } else if (token.pos.tag == "UH") {
                                //for symbol
                            } else {
                                //push into the same place as the last pushed place
                                if (prev === "course") {
                                    result.course.push(token.text);
                                } else if (prev === "degree") {
                                    result.degree.push(token.text);
                                } else if (prev === "grade") {
                                    result.grade.push(token.text);
                                } else if (prev === "date") {
                                    result.date.push(token.text);
                                } else {
                                    result.institute.push(token.text);
                                }
                            }
                        }
                    )
                    results.push(result);
                }
            )
            return results;
        }

        //get keywords
        //returns the keywords with its corresponding number of occurrences
        var getNamedEntities = function(sentenceArray) {
            var keyWords = [];
            sentenceArray.forEach(
                function (sentence) {
                    var tokens = nlp.spot(sentence);
                    var singularisedTokens = tokens.map(function(token) {
                        return token.analysis.singularize();
                    });
                    Array.prototype.push.apply(keyWords,singularisedTokens);
                    //because nlp library will not pick up the word research, which is quite important
                    if (sentence.toLowerCase().indexOf("research") >= 0) {
                        keyWords.push("research");
                    }
                }
            )
            console.log("keywords", keyWords);
            //count number of each words
            var results = { };
            for (var i = 0; i < keyWords.length; i++) {
                results[keyWords[i]] = (results[keyWords[i]] || 0) + 1;
            }
            console.log("parseParse", results);
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