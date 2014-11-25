(function () {
  'use strict';

  angular
    .module('jwt')
    .factory('UserFactory', UserFactory);

  UserFactory.$inject = ['$http', 'API_URL', 'AuthTokenFactory', '$q'];

  function UserFactory($http, API_URL, AuthTokenFactory, $q) {
    return {
      login: login,
      logout: logout,
      getUser: getUser
    };

    function login(username, password) {
      return $http.post(API_URL + '/login', {
        username: username,
        password: password
      }).then(function (response) {
        AuthTokenFactory.setToken(response.data.token);
        return response;
      });
    }

    function logout() {
      AuthTokenFactory.setToken();
    }

    function getUser() {
      if (AuthTokenFactory.getToken()) {
        return $http.get(API_URL + '/me');
      } else {
        return $q.reject({data: "Client has no auth token"});
      }
    }
  }
})();