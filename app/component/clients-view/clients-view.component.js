angular.module('App')
.component('clientsView', {
  templateUrl: './component/clients-view/clients-view.html',
  controller: ClientsViewController,
  controllerAs: 'ctrl'
});

function ClientsViewController (toolbarFactory, clientFactory, childFactory) {
  const vm = this;
  vm.clients = [];

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

    clientFactory.getClients().then((clientData) => {
      const {data: clients} = clientData;
      vm.clients = clients;
      vm.clients.forEach((client) => {
        childFactory.getChildrenFromClient(client.id).then((childrenData) => {
          const {data: children} = childrenData;
          client.children = children;
        })
      });
    });
  }

  init();
}