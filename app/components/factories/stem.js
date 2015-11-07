'use strict';

angular.module('myApp.factories')
    .factory('stem', function() {
        var stemArray = function(words) {
            return words.map(function(word) {
                return stemmer(word);
            });
        };
        return {
            /**
             * @param: array of strings
             * @return: array of stemmed strings
             */
            stem_array: stemArray
        };
    });