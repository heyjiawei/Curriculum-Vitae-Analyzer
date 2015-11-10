'use strict';

// Declare app level module which depends on views, and components
angular.module('cvia', [
  'ngRoute', 'ngMaterial', 'nlpCompromise', 'ngFileUpload', 'md.data.table',
  'cvia.factories', 'cvia.models', 'cvia.inputView', 'cvia.view2'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/input_view', {
    templateUrl: 'input_view/input-view.html',
    controller: 'inputViewCtrl'
  });

  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
  $routeProvider.otherwise({redirectTo: '/input_view'});
}]);
