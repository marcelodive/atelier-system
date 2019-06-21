angular.module('App')
.factory('authFactory', ($http, constants) => {
  function login (credential) {
    return $http.post(`${constants.API}/Users/login`, credential);
  }

  return {
    login: login
  }
});