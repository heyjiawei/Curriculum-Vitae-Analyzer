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
                            if (sentence.toLowerCase().includes(language.toLowerCase())) {
                                results.push(key);
                                return;
                            }
                        }

                    }
                }
            )
            return results;
        }

        var getNamedEntitiesWithExistingResults = function(sentenceArray, existingResult) {
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
            );
            keyWordNames = splitKeywords(keyWordNames);
            var finalKeyWords = removeDuplicateKeywords(removeRedundantKeywords(keyWordNames));
            return finalKeyWords;
        }

        var getNamedEntities = function(sentenceArray) {
            return getNamedEntitiesWithExistingResults(sentenceArray, []);
        }

        var splitKeywords = function(keywords) {
             return keywords.join(" ").split(/\/|\s/);
        }
        var removeRedundantKeywords = function(keywords){
            return keywords.filter(function(name) {
                return excludedKeyWords.indexOf(name) < 0;
            });
        }

        var removeDuplicateKeywords = function(keywords) {
            var seen = {};
            return keywords.filter(function(keyword) {
                return seen.hasOwnProperty(keyword) ? false : (seen[keyword] = true);
            });
        }

        //remove words like degree, bachelor from the keywords array
        var filterEducationKeywords = function(keywords) {
            console.log("1", excludedEducationKeyWords);
            return keywords.filter(function(name) {
                return excludedEducationKeyWords.indexOf(name) < 0;
            });
        }


        //var test = ["National University of Singapore", "MSCS, IT, 2010 - 2012"];
        //console.log(parseEducationBackground(test));
        return {
            parse_language: parseLanguages,
            get_named_entities: getNamedEntities,
            get_named_entities_with_existing_results: getNamedEntitiesWithExistingResults,
            remove_redundant_keywords: removeRedundantKeywords,
            remove_duplicate_keywords: removeDuplicateKeywords,
            filter_education_keywords: filterEducationKeywords
        }
    }
)
;
