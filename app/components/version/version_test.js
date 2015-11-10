'use strict';

describe('cvia.version module', function() {
  beforeEach(module('cvia.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
