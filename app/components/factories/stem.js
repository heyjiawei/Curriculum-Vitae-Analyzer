'use strict';

angular.module('myApp.factories')

    .factory('stem', function () {
        //stem each sentence in the array
        var stemSentence = function (sentenceArray) {
            var results = [];
            sentenceArray.forEach(
                function(sentence) {
                    results.push(stemmer(sentence));
                }
            );
            return results;
        };

        //given an array of objects
        // where the key is the name of the term
        //and value is the number of occurences of the term
        //stem the key -> stem the name of the term
        var stemKey = function (keyWordsArray) {
            var results = [];
            for (var keyWord in keyWordsArray) {
                results[stemmer(keyWord)] = keyWordsArray[keyWord];
            }
            return results;
        };

        return {
            stem: stemSentence,
            stemKeyWords: stemKey
        }
    }
)
;