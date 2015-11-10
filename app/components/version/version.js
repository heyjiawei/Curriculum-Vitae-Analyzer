'use strict';

angular.module('cvia.version', [
  'cvia.version.interpolate-filter',
  'cvia.version.version-directive'
])

.value('version', '0.1');
