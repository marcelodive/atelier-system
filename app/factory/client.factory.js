angular.module('App')
.factory('clientFactory', ($http, constants) => {
  function createClient (client) {
    return $http.post(`${constants.API}/Clients`, client);
  }

  function getClients () {
    return $http.get(`${constants.API}/Clients`);
  }

  return {
    createClient: createClient,
    getClients: getClients
  }
});