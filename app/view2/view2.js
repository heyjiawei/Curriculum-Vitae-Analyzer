'use strict';

angular.module('myApp.view2', [])

.controller('View2Ctrl', function($scope, $q, $timeout, storageAccess, resultPresenter) {
    $scope.cvMatch  = resultPresenter.formatRawResultsForPresentation();

    //get initial weights
    $scope.weights = resultPresenter.getWeights();

    //get definition of columns
    $scope.emptyResultForHeaders = resultPresenter.getHeaderDefinitions();

    //define names and score columns
    $scope.columns = [{
        name: $scope.emptyResultForHeaders.name.name,
        orderBy: 'name.value'
    }, {
        name: $scope.emptyResultForHeaders.finalScore.name,
        numeric: true,
        orderBy: 'finalScore.value',
        descendFirst: true
    }];

    //define columns for every scoring criteria
    for (var key in $scope.emptyResultForHeaders.scoringCriteria) {
      if($scope.emptyResultForHeaders.scoringCriteria.hasOwnProperty(key)) {
        var criteriaName = $scope.emptyResultForHeaders.scoringCriteria[key].name;
        var column = {
          name: criteriaName,
          numeric: true,
          orderBy: key,
          descendFirst: false,
          unit: '%'
        };
        $scope.columns.push(column);
      }
    }

    $scope.selected = []; // selecting a row will bring us to the selected cv
    $scope.query = {
      order: '-finalScore.value',
      limit: 5,
      page: 1
    };

    $scope.$watch('weights', function(newWeight, oldWeight) {
        resultPresenter.updateWeights(newWeight);
    }, true);

    $scope.onPaginationChange = function(page, limit) {

      //console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
      //console.log('Page: ' + page + ' Limit: ' + limit);

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