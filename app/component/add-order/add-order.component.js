angular.module('App')
.component('addOrder', {
  templateUrl: './component/add-order/add-order.html',
  controller: AddOrderController,
  controllerAs: 'ctrl',
  bindings: {
    orderToEdit: '=?',
    cancelCallback: '&?',
    orders: '='
  }
});

function AddOrderController ($scope, addressFactory, logFactory) {
  const vm = this;

  vm.buildAddressFromCEP = buildAddressFromCEP;

  async function buildAddressFromCEP (cep) {
    try {
      const {data:address} = await addressFactory.getAddress(cep);
      vm.order.cep = address.cep;
      vm.order.neighborhood = address.bairro;
      vm.order.city = address.localidade;
      vm.order.publicPlace = address.logradouro;
      vm.order.state = address.uf;
    } catch (erro) {
      logFactory.showToaster('', `Este CEP não existe`, 'warn');
    } finally {
      $scope.$apply();
    }
  }
 }