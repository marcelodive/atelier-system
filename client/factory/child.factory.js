angular.module('App')
  .factory('childFactory', ($http, constants) => {
    function createChild(child) {
      return $http.post(`${constants.API}/Children`, child);
    }

    function getChildrenFromClient(clientId) {
      return $http.get(`${constants.API}/Clients/${clientId}/children`);
    }

    return {
      createChild,
      getChildrenFromClient,
    };
  });
