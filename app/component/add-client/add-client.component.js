angular.module('App')
.component('addClient', {
  templateUrl: './component/add-client/add-client.html',
  controller: AddClientController,
  controllerAs: 'ctrl',
  bindings: {
    editing: '<?',
    cancelCallback: '&?'
  }
});

function AddClientController () {
  const vm = this;
  vm.client = getEmptyClient();

  vm.cancelAddition = cancelAddition;

  function getEmptyClient () {
    return {children: [{}]};
  }

  function cancelAddition () {
    vm.cancelCallback();
  }
}