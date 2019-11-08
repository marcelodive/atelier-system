angular.module('App')
  .component('ordersView', {
    templateUrl: './component/orders-view/orders-view.html',
    controller: OrdersViewController,
    controllerAs: 'ctrl',
  });

function OrdersViewController (orderFactory, utilsFactory, $timeout, emailStatuses) {
  const vm = this;

  vm.isAddingOrder = false;
  vm.ordersStartAt = moment().utc().startOf('week');
  vm.ordersEndsAt = moment().utc().endOf('week');

  vm.loadOrders = loadOrders;
  vm.triggerAddingOrder = triggerAddingOrder;
  vm.cancelAddingOrder = cancelAddingOrder;
  vm.reduceName = reduceName;
  vm.formatDate = formatDate;
  vm.formatPrice = utilsFactory.formatPrice;
  vm.daysLeft = daysLeft;
  vm.changeInstallmentPaidStatus = changeInstallmentPaidStatus;
  vm.isShowingDetails = isShowingDetails;
  vm.editOrder = editOrder;
  vm.childAge = childAge;
  vm.formatBirthday = utilsFactory.formatBirthday;
  vm.getOrderStatus = getOrderStatus;
  vm.changeDeliveredStatus = changeDeliveredStatus;
  vm.getEmailStatus = getEmailStatus;
  vm.getOrdersByDate = getOrdersByDate;
  vm.getDaysToDelivery = getDaysToDelivery;
  vm.updateOrderDates = updateOrderDates;

  const today = new Date();

  function init () {
    loadOrders();
  }

  function updateOrderDates (startDate, endDate) {
    vm.filteredOrderDates = vm.orderDates.filter((date) => {
      const afterStartDate = moment(startDate).diff(date, 'days');
      const beforeEndDate = moment(endDate).diff(date, 'days');
      return (afterStartDate <= 0 && beforeEndDate >= 0);
    });
  }

  function getDaysToDelivery (orderDate) {
    const daysToDelivery = moment(orderDate).diff(today, 'days');
    if (daysToDelivery === 0) {
      return 'Entregas para hoje';
    } else if (daysToDelivery === 1) {
      return 'Entregas para amanhã';
    } else {
      return `Entregas em ${daysToDelivery} dias`;
    }
  }

  function getOrdersByDate (orderDate) {
    return vm.orders.filter((order) =>
      order.delivery_day.substring(0, 10) === orderDate.substring(0, 10));
  }

  function getEmailStatus (emailStatus) {
    emailStatus = emailStatus || 0;
    return emailStatuses[emailStatus];
  }

  async function changeDeliveredStatus (order) {
    const {data: updatedOrder} = await orderFactory.changeDeliveredStatus(order);
    order.delivered = updatedOrder.delivered;
  }

  function getOrderStatus (order) {
    const sentOrDelivered = (order.delivery_by === 'Correios') ? 'Pedido enviado' : 'Pedido entregue';
    const orderStatuses = {
      paymentDelayed: {status: 'Recebimento atrasado', color: 'darkorange'},
      sent: {status: sentOrDelivered, color: 'blue'},
      paid: {status: 'Pedido quitado', color: 'green'},
      orderDelayed: {status: 'Pedido atrasado', color: 'orangered'},
    };

    const isSomeInstalmentDelayed = order.installments
      .some((installment) => isInstallmentDelayed(installment));

    if (isSomeInstalmentDelayed) {
      return orderStatuses.paymentDelayed;
    } if (order.delivered) {
      return orderStatuses.sent;
    } if (order.installments.every((installment) => installment.paid)) {
      return orderStatuses.paid;
    } if (moment(order.delivery_day).diff(today, 'days') < 0) {
      return orderStatuses.orderDelayed;
    }
    const paidInstallments = order.installments.reduce((count, installment) => count + (installment.paid), 0);
    return {
      status: `${paidInstallments}/${order.installments.length} parcelas pagas`,
      color: 'grey',
    };
  }

  function isInstallmentDelayed (installment) {
    return (installment.paid) ? false : (moment(installment.payment_day).diff(today, 'days') < 0);
  }

  function childAge (birthday) {
    const age = moment(today).diff(birthday, 'years');
    return `${age} ${(age > 1) ? 'anos' : 'ano'}`;
  }

  function editOrder (order) {
    order.showDetails = false;
    vm.orderToEdit = order;

    $timeout(() => vm.isAddingOrder = true);
  }

  function isShowingDetails () {
    return vm.orders.reduce((acc, order) => acc || order.showDetails, false);
  }

  async function changeInstallmentPaidStatus (installment) {
    const {data: updatedInstallment} = await orderFactory.changeInstallmentPaidStatus(installment);
    installment = updatedInstallment;
  }

  function formatDate (date) {
    return moment.utc(date).format('DD/MM/YYYY');
  }

  function daysLeft (date) {
    return moment.utc(date).diff(today, 'days');
  }

  function reduceName (name) {
    const splitedName = name.split(' ');
    if (splitedName.length <= 2) {
      return name;
    }
    const firstName = splitedName[0];
    const middleNamesWithDot = splitedName.reduce(((namesWithDots, name, index) => {
      if (index > 0 && index < (splitedName.length - 1)) {
        namesWithDots = `${namesWithDots} ${name[0]}.`;
      }
      return namesWithDots;
    }), '');
    const surName = splitedName[splitedName.length - 1];
    return `${firstName} ${middleNamesWithDot} ${surName}`;
  }

  async function loadOrders () {
    const {data: orders} = await orderFactory.loadOrders();
    vm.orders = orders;
    vm.orderDates = [...new Set(orders.map((order) => order.delivery_day))];
    updateOrderDates(vm.ordersStartAt, vm.ordersEndsAt);
  }

  function triggerAddingOrder () {
    vm.isAddingOrder = true;
  }

  function cancelAddingOrder () {
    vm.isAddingOrder = false;
    vm.orderToEdit = null;
  }

  init();
}
