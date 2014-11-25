(function () {
  'use strict';

  angular
    .module('jwt')
    .factory('AuthInterceptor', AuthInterceptor);

  AuthInterceptor.$inject = ['AuthTokenFactory'];

  function AuthInterceptor(AuthTokenFactory) {
    return {
      request: addTokenToHeader
    }

    function addTokenToHeader(config) {
      var token = AuthTokenFactory.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
})();