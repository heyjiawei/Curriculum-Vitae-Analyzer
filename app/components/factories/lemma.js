'use strict';

angular.module('myApp.factories')

    .factory('lemma', function (nlp) {
        var instituteKeyWords = ["college", "university", "institute"];
        var courseKeyWords = ["computer", "computing", "engineering", "information technology", "physics", "it", "neuroscience"];
        var degreeKeyWords = ["bachelor's", "bachelor", "bsc", "master", "master's", "phd", "ph.d", "degree", "mscs", "msc", "be"];
        var gradeKeyWords = ["grade:", "cap", "gpa"];

        function Result() {
            this.institute = [];
            this.course = [];
            this.degree = [];
            this.date = [];
            this.grade = [];
        };

        //var test = nlp.pos(text).sentences;
        var results = [];
        var parseEducationBackground = function (sentenceArray) {
            var prev = null;
            var result = new Result();
            console.log(sentenceArray);
            sentenceArray.forEach(
                function (sentence) {
                    //assume 1 sentence
                    var tokens = nlp.pos(sentence).sentences[0].tokens;
                    console.log(tokens);
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
                }
            )

            results.push(result);
            return results;
        }
        //var test = ["National University of Singapore", "MSCS, IT, 2010 - 2012"];
        //console.log(parseEducationBackground(test));
        return {
            lemma_string: parseEducationBackground
        }
    }
)
;