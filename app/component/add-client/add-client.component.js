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
  vm.client = {children: [{}]};

  vm.cancelAddition = cancelAddition;
  vm.addChild = addChild;

  function addChild () {
    vm.client.children.push({});
  }

  function cancelAddition () {
    vm.cancelCallback();
  }
}