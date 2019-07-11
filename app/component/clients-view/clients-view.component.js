angular.module('App')
.component('clientsView', {
  templateUrl: './component/clients-view/clients-view.html',
  controller: ClientsViewController,
  controllerAs: 'ctrl'
});

function ClientsViewController (toolbarFactory, clientFactory) {
  const vm = this;

  vm.triggerAddingUser = triggerAddingUser;
  vm.cancelAddingUser = cancelAddingUser;

  function triggerAddingUser () {
    vm.isAddingUser = true
    toolbarFactory.setToolbarTitle('Adicionar cliente');
  }

  function cancelAddingUser () {
    vm.isAddingUser = false;
    toolbarFactory.setToolbarTitle('Clientes');
  }

  function init () {
    toolbarFactory.setToolbarTitle('Clientes');

    clientFactory.getClients().then((data) => {
      const {data: clients} = data;
      vm.clients = clients;
    });
  }

  init();
}