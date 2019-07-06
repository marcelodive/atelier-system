angular.module('App')
.component('addClient', {
  templateUrl: './component/add-client/add-client.html',
  controller: AddClientController,
  controllerAs: 'ctrl',
  bindings: {
    editing: '<?'
  }
});

function AddClientController ($mdDialog) {
  const vm = this;

  vm.client = getEmptyClient();

  vm.$mdDialog = $mdDialog;

  function getEmptyClient () {
    return {children: [{}]};
  }
}