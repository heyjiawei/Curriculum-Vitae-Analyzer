'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /input-view when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/input-view");
  });


  describe('inputView', function() {

    beforeEach(function() {
      browser.get('index.html#/input-view');
    });


    it('should render inputView when user navigates to /input_view', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('resultsView', function() {

    beforeEach(function() {
      browser.get('index.html#/results-view');
    });


    it('should render resultsView when user navigates to /results-view', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
