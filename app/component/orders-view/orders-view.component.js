angular.module('App')
.component('ordersView', {
  templateUrl: './component/orders-view/orders-view.html',
  controller: OrdersViewController,
  controllerAs: 'ctrl'
});

function OrdersViewController () {
  const vm = this;

  vm.isAddingOrder = true;

  vm.triggerAddingOrder = triggerAddingOrder;

  function triggerAddingOrder () {
    vm.isAddingOrder = true;
  }
}