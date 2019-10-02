angular.module('App')
.factory('orderFactory', ($http, constants) => {
  function createOrder (order) {
    return $http.post(`${constants.API}/Orders/saveOrder`, {order});
  }

  return {
    createOrder: createOrder
  }
});