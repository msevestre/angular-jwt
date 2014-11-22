(function () {
  'use strict';

  var app = angular.module('app', [], appConfig);

  function appConfig($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  }

  app.constant('API_URL', 'http://localhost:3000');

  app.controller('MainController', MainController);

  function MainController(RandomUserFactory, UserFactory) {
    var vm = this;
    vm.getRandomUser = getRandomUser;
    vm.message = "Hello";
    vm.login = login;
    vm.logout = logout;
    activate();

    ////////////////

    function activate() {
      UserFactory.getUser().then(function(response){
        vm.user = response.data;
      })
    }

    function logout() {
      UserFactory.logout();
      vm.user = null;
    }

    function login(username, password) {
      UserFactory.login(username, password)
        .then(function (response) {
          vm.user = response.data.user;
        }, handleError)
    }

    function getRandomUser() {
      RandomUserFactory.getUser()
        .then(function (response) {
          vm.randomUser = response.data;
        }, handleError);
    }

    function handleError(response) {
      alert('Error ' + response.data);
    }
  }

  app.factory('RandomUserFactory', RandomUserFactory);

  function RandomUserFactory($http, API_URL) {
    return {
      getUser: getUser
    };

    function getUser() {
      return $http.get(API_URL + '/random_user');
    }
  }

  app.factory('UserFactory', UserFactory);

  function UserFactory($http, API_URL, AuthTokenFactory,$q) {
    return {
      login: login,
      logout: logout,
      getUser:getUser
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

    function getUser(){
      if(AuthTokenFactory.getToken()){
        return $http.get(API_URL + '/me');
      }else{
        return $q.reject({data:"Client has no auth token"});
      }
    }
  }


  app.factory('AuthTokenFactory', AuthTokenFactory);
  function AuthTokenFactory($window) {
    var store = $window.localStorage;
    var key = "auth-token";

    return {
      getToken: getToken,
      setToken: setToken
    };

    function getToken() {
      return store.getItem(key);
    }

    function setToken(token) {
      if (token)
        store.setItem(key, token);
      else
        store.removeItem(key);
    }
  }

  app.factory('AuthInterceptor', AuthInterceptor);

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
