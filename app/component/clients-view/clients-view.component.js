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

  function addClientChildrenInList (client) {
    client.children.forEach((child) => {
      vm.children.push({
        name:child.name,
        birthday:child.birthday,
        formatedBirthday:moment(child.birthday).format('MM/DD'),
        age: moment(new Date()).diff(child.birthday, 'years'),
        client:client
      })
    });
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