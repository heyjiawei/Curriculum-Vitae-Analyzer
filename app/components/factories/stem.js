'use strict';

angular.module('myApp.factories')

    .factory('stem', function () {
        //stem each sentence in the array
        var stemSentence = function (sentenceArray) {
            var results = [];
            sentenceArray.forEach(
                function(sentence) {
                    results.push(stemmer.stem(sentence));
                }
            )
            return results;
        }
        return {
            stem: stemSentence
        }
    }
)
;