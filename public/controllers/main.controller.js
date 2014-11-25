(function () {
  'use strict';

  angular
    .module('jwt')
    .controller('MainController',MainController );

  MainController.$inject = ['RandomUserFactory', 'UserFactory'];

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
})();