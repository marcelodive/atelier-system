angular.module('App')
.factory('childFactory', ($http, constants) => {
  function createChild (child) {
    return $http.post(`${constants.API}/Children`, child);
  }

  function getChildrenFromClient (client_id) {
    return $http.get(`${constants.API}/Clients/${client_id}/children`);
  }

  return {
    createChild: createChild,
    getChildrenFromClient: getChildrenFromClient
  }
});