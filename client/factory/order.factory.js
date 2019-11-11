angular.module('App')
  .factory('orderFactory', ($http, constants) => {
    function loadOrders () {
      const filter = '{"include":["orderProducts","installments",{"child":"client"}]}';
      return $http.get(`${constants.API}/Orders?filter=${filter}`);
    }

    function createOrder (order) {
      return $http.post(`${constants.API}/Orders/saveOrder`, {order});
    }

    function changeInstallmentPaidStatus (installment) {
      return $http.put(`${constants.API}/Installments/${installment.id}`, installment);
    }

    function changeDeliveredStatus (order) {
      return $http.patch(`${constants.API}/Orders/${order.id}`, {delivered: order.delivered});
    }

    function sendConfirmationEmail (orderId) {
      return $http.post(`${constants.API}/Orders/sendConfirmationEmailToCliente`, {orderId});
    }

    return {
      createOrder,
      loadOrders,
      changeInstallmentPaidStatus,
      changeDeliveredStatus,
      sendConfirmationEmail,
    };
  });
