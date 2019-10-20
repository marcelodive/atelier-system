angular.module('App')
.factory('orderFactory', ($http, constants) => {
  function loadOrders () {
    return $http.get(`${constants.API}/Orders?filter={"include":["orderProducts","installments",{"child":"client"}]}`);
  }

  function createOrder (order) {
    return $http.post(`${constants.API}/Orders/saveOrder`, {order});
  }

  return {
    createOrder: createOrder,
    loadOrders: loadOrders
  }
});