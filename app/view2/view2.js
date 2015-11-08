'use strict';

angular.module('myApp.view2', [])

.controller('View2Ctrl', function($scope, $q, $timeout, storageAccess, results) {
    var evaluatedResults = results.getResultsFromEvaluation();

    $scope.columns = [{
      name: 'Name / filename',
      orderBy: 'id'
    }, {
      name: 'Match',
      numeric: true,
      orderBy: 'finalScore',
      descendFirst: true,
      unit: '%'
    }];
//    evaluatedResults.forEach(function(result) {
    var emptyResultForHeaders = new results.Result();
      for (var key in emptyResultForHeaders.scoringCriteria) {
        if(emptyResultForHeaders.scoringCriteria.hasOwnProperty(key)) {
          var criteriaName = emptyResultForHeaders.scoringCriteria[key].name;
          console.log("Key is " + key + ", value is", emptyResultForHeaders.scoringCriteria[key]);
          var column = {
            name: criteriaName,
            numeric: true,
            orderBy: key,
            descendFirst: true,
            unit: '%'
          };
          $scope.columns.push(column);
        }
      }
//    });

    $scope.selected = []; // selecting a row will bring us to the selected cv
    $scope.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

    $scope.cvMatch = evaluatedResults;
    console.log("to be displayed:",$scope.cvMatch);

    // default position of slider
    $scope.weight = {eduWeight : 1,
                    essSkillsWeight : 1,
                    prefSkillsWeight : 1,
                    workExpWeight : 1,
                    languageWeight : 1};

    $scope.$watch('weight', function(newWeight, oldWeight) {
//      cvEvaluator.update(newWeight.eduWeight,
//                        newWeight.essSkillsWeight,
//                        newWeight.prefSkillsWeight,
//                        newWeight.workExpWeight,
//                        newWeight.languageWeight);
//
//      var result = storageAccess.getAllResults();
//
//      // update score of each cv
//      for (var i = 0; i < result.length; i++) {
//        $scope.cvMatch[i]["score"] = result[i]["score"];
//      }
//
//      console.log('cv', $scope.cvMatch);

    }, true);

    $scope.onPaginationChange = function(page, limit) {

      console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
      console.log('Page: ' + page + ' Limit: ' + limit);

      var deferred = $q.defer();

      $timeout(function () {
        deferred.resolve();
      }, 2000);

      return deferred.promise;
    };

    $scope.loadStuff = function () {
      var deferred = $q.defer();

      $timeout(function () {
        deferred.reject();
      }, 2000);

      $scope.deferred = deferred.promise;
    };

    $scope.onOrderChange = function(order) {

      console.log('Scope Order: ' + $scope.query.order);
      console.log('Order: ' + order);

      var deferred = $q.defer();

      $timeout(function () {
        deferred.resolve();
      }, 2000);

      return deferred.promise;
    };

  });