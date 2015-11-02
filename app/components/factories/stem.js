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

        //stem the name of each keyword objects as defined in constant.js
        var stemName = function (keyWordsArray) {
            var result = [];
            for (var i = 0; i < keyWordsArray.length; i++) {
                var keyWord = keyWordsArray[i];
                var stemmedKeyWord = new Keyword();
                stemmedKeyWord.name = stemmer(keyWord.name);
                stemmedKeyWord.value = keyWord.value;
                result.push(stemmedKeyWord);
            }
            return result;
        };

        return {
            stem: stemSentence,
            stemKeyWords: stemName
        }
    }
)
;