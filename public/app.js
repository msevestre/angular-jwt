(function () {
  'use strict';

  angular.module('jwt', [], appConfig);

  function appConfig($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }

})();
