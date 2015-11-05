'use strict';

angular.module('myApp.view2', [])

.controller('View2Ctrl', function($scope, $q, $timeout, storageAccess, cvEvaluator) {
    $scope.selected = []; // selecting a row will bring us to the selected cv
    $scope.query = {
      order: 'name',
      limit: 5,
      page: 1
    };

    $scope.columns = [{
      name: 'Name / filename',
      orderBy: 'id'
    }, {
      name: 'Match',
      numeric: true,
      orderBy: 'score',
      descendFirst: true,
      unit: '%'
    }, {
      name: 'Education',
      numeric: true,
      orderBy: 'education',
      unit: '%'
    }, {
      name: 'Essential Skills',
      numeric: true,
      orderBy: 'essSkills',
      unit: '%'
    }, {
      name: 'Preferred Skills',
      numeric: true,
      orderBy: 'prefSkills',
      unit: '%'
    }, {
      name: 'Work Exp',
      numeric: true,
      orderBy: 'experience',
      unit: '%'
    }, {
      name: 'Languages',
      numeric: true,
      orderBy: 'languages',
      unit: '%'
    }];

    $scope.cvMatch = storageAccess.getAllResults();
    console.log("to be displayed:",$scope.cvMatch);

    $scope.weight = {eduWeight : 1,
                    essSkillsWeight : 1,
                    prefSkillsWeight : 1,
                    workExpWeight : 1,
                    languageWeight : 1};

    $scope.$watch('weight', function(newWeight, oldWeight) {
      var totalWeight = newWeight.eduWeight +
        newWeight.essSkillsWeight +
        newWeight.prefSkillsWeight +
        newWeight.workExpWeight +
        newWeight.languageWeight;

      cvEvaluator.update(newWeight.eduWeight,
                        newWeight.essSkillsWeight,
                        newWeight.prefSkillsWeight,
                        newWeight.workExpWeight,
                        newWeight.languageWeight);
      $scope.cvMatch = storageAccess.getAllResults();
      console.log('cv', $scope.cvMatch);

      /*
      $scope.cvMatch.forEach(function(cv) {
        var eduScore = (newWeight.eduWeight / totalWeight) * cv.education;
        var essSkillScore = (newWeight.essSkillsWeight / totalWeight) * cv.essSkills;
        var prefSkillScore = (newWeight.prefSkillsWeight / totalWeight) * cv.prefSkills;
        var workExpScore = (newWeight.workExpWeight / totalWeight) * cv.experience;
        var languageScore = (newWeight.languageWeight / totalWeight) * cv.language;
        var matchScore = eduScore + essSkillScore + prefSkillScore + workExpScore + languageScore;
        cv.score = matchScore;
        console.log("matchScore = " + matchScore);
      });
      */
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