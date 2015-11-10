'use strict';

// Declare app level module which depends on views, and components
angular.module('cvia', [
  'ngRoute', 'ngMaterial', 'nlpCompromise', 'ngFileUpload', 'md.data.table',
  'cvia.factories', 'cvia.models', 'cvia.view1', 'cvia.view2'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });

  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
