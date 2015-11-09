'use strict';

angular.module('myApp.view2', [])

.controller('View2Ctrl', function($scope, $q, $timeout, storageAccess, results) {
    var evaluatedResults = results.formatRawResultsForPresentation();
    console.log("evaresult", evaluatedResults);

    //get initial weights
    $scope.weights = results.getWeights();

   //get definition of columns
    $scope.emptyResultForHeaders = results.getHeaderDefinitions();

        //set names and scores
    $scope.columns = [{
        name: $scope.emptyResultForHeaders.id.name,
        orderBy: 'id'
    }, {
        name: $scope.emptyResultForHeaders.finalScore.name,
        numeric: true,
        orderBy: 'finalScore',
        descendFirst: true,
        unit: '%'
    }];

    for (var key in $scope.emptyResultForHeaders.scoringCriteria) {
      if($scope.emptyResultForHeaders.scoringCriteria.hasOwnProperty(key)) {
        var criteriaName = $scope.emptyResultForHeaders.scoringCriteria[key].name;
        console.log("Key is " + key + ", value is", $scope.emptyResultForHeaders.scoringCriteria[key]);
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

    $scope.selected = []; // selecting a row will bring us to the selected cv
    $scope.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

    $scope.cvMatch = evaluatedResults;
    console.log("to be displayed:",$scope.cvMatch);

    $scope.$watch('weights', function(newWeight, oldWeight) {
        results.updateWeights(newWeight);
        
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