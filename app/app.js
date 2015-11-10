'use strict';

// Declare app level module which depends on views, and components
angular.module('cvia', [
  'ngRoute', 'ngMaterial', 'nlpCompromise', 'ngFileUpload', 'md.data.table',
  'cvia.factories', 'cvia.models', 'cvia.inputView', 'cvia.resultsView'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/input-view', {
    templateUrl: 'input-view/input-view.html',
    controller: 'inputViewCtrl'
  });

  $routeProvider.when('/results-view', {
    templateUrl: 'results-view/results-view.html',
    controller: 'resultsViewCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/input-view'});
}]);
