angular.module('App')
.component('clientsView', {
  templateUrl: './component/clients-view/clients-view.html',
  controller: ClientsViewController,
  controllerAs: 'ctrl'
});

function ClientsViewController (toolbarFactory, $mdDialog) {
  const vm = this;

  vm.openAddUserDialog = openAddUserDialog;
  vm.clients = [{}];

  function openAddUserDialog (event) {
    $mdDialog.show({
      locals:{clients: vm.clients},
      templateUrl: './component/clients-view/add-client-dialog.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true,
      controller: mdDialogController,
      controllerAs: 'ctrl',
      fullscreen: true,
      clickOutsideToClose: false
    })
  }

  function init () {
    toolbarFactory.setToolbarTitle('Clientes');
  }

  init();
}

function mdDialogController (clients) {
  const vm = this;

  vm.name = clients;
}