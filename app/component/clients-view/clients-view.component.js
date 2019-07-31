angular.module('App')
.component('clientsView', {
  templateUrl: './component/clients-view/clients-view.html',
  controller: ClientsViewController,
  controllerAs: 'ctrl'
});

function ClientsViewController ($scope, $timeout, toolbarFactory, clientFactory, childFactory) {
  const vm = this;

  let childrenWithoutFilter = null;

  vm.isAddingUser = false;

  vm.triggerAddingUser = triggerAddingUser;
  vm.cancelAddingUser = cancelAddingUser;
  vm.editClient = editClient;
  vm.filterChildren = filterChildren;
  vm.init = init;

  function triggerAddingUser () {
    vm.isAddingUser = true
    toolbarFactory.setToolbarTitle('Adicionar cliente');
  }

  function cancelAddingUser () {
    vm.isAddingUser = false;
    toolbarFactory.setToolbarTitle('Clientes');
  }

  function editClient (client) {
    vm.clientToEdit = client;
    vm.isAddingUser = true;
  }

  function filterChildren (search) {
    vm.children = (search)
      ? childrenWithoutFilter.filter((child) => {
          const hasChild = Object.values(child).filter((childProperty) =>
            String(childProperty).toLowerCase().includes(search.toLowerCase())).length;
          const hasClient = Object.values(child.client).filter((clientProperty) =>
            String(clientProperty).toLowerCase().includes(search.toLowerCase())).length;
          return (hasChild || hasClient);
        })
      : childrenWithoutFilter;
  }

  function addClientChildrenInList (client) {
    clientFactory.addClientInChildrenList (client, vm.children);
    childrenWithoutFilter = vm.children;
  }

  function init () {
    toolbarFactory.setToolbarTitle('Clientes');

    vm.clients = [];
    vm.children = [];

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

  $scope.$watch(() => vm.isAddingUser, () => {
    if (vm.clientToEdit && !vm.isAddingUser) {
      vm.clientToEdit = null;
      init();
    }
  });
}