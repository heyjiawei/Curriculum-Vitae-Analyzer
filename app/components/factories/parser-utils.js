'use strict';

angular.module('myApp.factories')

    .factory('parserUtils', function (nlp) {
        //returns all the sentence splitted up by " "
        var parseLanguages = function (sentenceArray) {
            var results = [];
            sentenceArray.forEach(
                function (sentence) {
                    for (var key in languages) {
                        var languageNames = languages[key].name.split(/,|;/).map(
                            function (languageName) {
                                return languageName.toLowerCase().trim();
                            }
                        );
                        for (var i = 0; i < languageNames.length; i++) {
                            var language = languageNames[i];
                            if (sentence.toLowerCase().contains(language.toLowerCase())) {
                                results.push(key);
                                return;
                            }
                        }

                    }
                }
            )
            return results;
        }

        //var test = ["National University of Singapore", "MSCS, IT, 2010 - 2012"];
        //console.log(parseEducationBackground(test));
        return {
            parse_language: parseLanguages,
        }
    }
)
;
