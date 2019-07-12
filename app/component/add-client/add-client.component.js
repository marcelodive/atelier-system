angular.module('App')
.component('addClient', {
  templateUrl: './component/add-client/add-client.html',
  controller: AddClientController,
  controllerAs: 'ctrl',
  bindings: {
    editing: '<?',
    cancelCallback: '&?',
    clients: '='
  }
});

function AddClientController (clientFactory, childFactory, logFactory) {
  const vm = this;
  vm.client = {children: [{}]};
  vm.today = new Date();

  vm.cancelAddition = cancelAddition;
  vm.addChild = addChild;
  vm.removeChild = removeChild;
  vm.updateChildAge = updateChildAge;
  vm.createClient = createClient;

  function addChild () {
    vm.client.children.push({});
  }

  function removeChild (key) {
    vm.client.children.splice(key,1);
  }

  function cancelAddition () {
    vm.cancelCallback();
  }

  function closeEditing () {
    vm.cancelCallback();
  }

  function updateChildAge (birthday, child) {
    child.age = moment(vm.today).diff(birthday, 'years');
  }

  async function createClient (client) {
    try {
      const {data: createdClient} = await clientFactory.createClient(client);
      client.id = createdClient.id;
      client.children.forEach(async (child) => {
        child.client_id = client.id;
        try {
          const {data: createdChild} = await childFactory.createChild(child);
          child.id = createdChild.id;
        } catch (error) {
          clientFactory.deleteClient(client.id);
          logFactory.showToaster('Erro', `Ocorreu um erro ao salvar a criança, por favor, tente novamente`, 'error');
        }
      });
      vm.clients.push(createdClient);
      closeEditing();
      logFactory.showToaster('Sucesso', `Cliente ${createdClient.name} salvo`, 'success');
    } catch (error) {
      logFactory.showToaster('Erro', `Ocorreu um erro ao salvar o cliente, por favor, tente novamente`, 'error');
      logFactory.log(error, 'error');
    }
  }
}