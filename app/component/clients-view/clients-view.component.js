angular.module('App')
.component('clientsView', {
  templateUrl: './component/clients-view/clients-view.html',
  controller: ClientsViewController,
  controllerAs: 'ctrl'
});

function ClientsViewController (toolbarFactory, clientFactory, childFactory) {
  const vm = this;
  vm.clients = [];
  vm.children = [];
  vm.dtInstance = {};

  vm.triggerAddingUser = triggerAddingUser;
  vm.cancelAddingUser = cancelAddingUser;
  vm.editClient = editClient;
  vm.init = init;

  function triggerAddingUser () {
    vm.isAddingUser = true
    toolbarFactory.setToolbarTitle('Adicionar cliente');
  }

  function cancelAddingUser () {
    vm.isAddingUser = false;
    toolbarFactory.setToolbarTitle('Clientes');
    vm.clientToEdit = null;
  }

  function editClient (client) {
    vm.clientToEdit = client;
    vm.isAddingUser = true;
  }

  function addClientChildrenInList (client) {
    clientFactory.addClientInChildrenList (client, vm.children);
    vm.dtInstance.draw();
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
          addClientChildrenInList(client);
        })
      });
    });
  }

  init();
}