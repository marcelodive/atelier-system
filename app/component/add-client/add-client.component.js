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
  vm.today = new Date();

  vm.cancelAddition = cancelAddition;
  vm.addChild = addChild;
  vm.removeChild = removeChild;
  vm.updateChildAge = updateChildAge;
  vm.saveClient = saveClient;

  function addChild () {
    vm.client.children.push({});
  }

  function removeChild (key) {
    vm.client.children.splice(key,1);
  }

  function cancelAddition () {
    vm.cancelCallback();
  }

  function updateChildAge (birthday, child) {
    child.age = moment(vm.today).diff(birthday, 'years');
  }

  function saveClient () {
    console.log('saved');
  }
}