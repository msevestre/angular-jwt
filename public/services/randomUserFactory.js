(function () {
  'use strict';

  angular
    .module('jwt')
    .factory('RandomUserFactory', RandomUserFactory);

  RandomUserFactory.$inject = ['$http', 'API_URL'];

  function RandomUserFactory($http, API_URL) {
    return {
      getUser: getUser
    };

    function getUser() {
      return $http.get(API_URL + '/random_user');
    }
  }
})();