angular.module('App')
.component('ordersView', {
  templateUrl: './component/orders-view/orders-view.html',
  controller: OrdersViewController,
  controllerAs: 'ctrl'
});

function OrdersViewController (orderFactory) {
  const vm = this;

  vm.isAddingOrder = false;

  vm.loadOrders = loadOrders;
  vm.triggerAddingOrder = triggerAddingOrder;
  vm.cancelAddingOrder = cancelAddingOrder;

  function init () {
    loadOrders();
  }

  function loadOrders () {
    vm.orders = orderFactory.loadOrders();
  }

  function triggerAddingOrder () {
    vm.isAddingOrder = true;
  }

  function cancelAddingOrder () {
    vm.isAddingOrder = false;
  }

  init();
}