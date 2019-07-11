angular.module('App')
.factory('childFactory', ($http, constants) => {
  function createChild (child) {
    return $http.post(`${constants.API}/Children`, child);
  }

  return {
    createChild: createChild
  }
});