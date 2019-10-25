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
  vm.reduceName = reduceName;
  vm.formatDate = formatDate;

  function init () {
    loadOrders();
  }

  function formatDate (date) {
    return moment.utc(date).format('DD/MM/YYYY');
  }

  function reduceName (name) {
    const splitedName = name.split(' ');
    if (splitedName.length <= 2) {
      return name;
    } else {
      const firstName = splitedName[0];
      const middleNamesWithDot = splitedName.reduce(((namesWithDots, name, index) => {
        if (index > 0 && index < (splitedName.length - 1)) {
          namesWithDots = `${namesWithDots} ${name[0]}.`
        }
        return namesWithDots;
      }), '');
      const surName = splitedName[splitedName.length - 1];
      return `${firstName} ${middleNamesWithDot} ${surName}`;
    }
  }

  async function loadOrders () {
    const {data:orders} = await orderFactory.loadOrders();
    vm.orders = orders;
    vm.orders = [...orders, ...orders, ...orders]
  }

  function triggerAddingOrder () {
    vm.isAddingOrder = true;
  }

  function cancelAddingOrder () {
    vm.isAddingOrder = false;
  }

  init();
}