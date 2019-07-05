angular.module('App')
.component('clientsView', {
  templateUrl: './component/clients-view/clients-view.html',
  controller: ClientsViewController,
  controllerAs: 'ctrl'
});

function ClientsViewController (toolbarFactory) {
  const vm = this;

  function init () {
    toolbarFactory.setToolbarTitle('Clientes');
  }

  init();
}