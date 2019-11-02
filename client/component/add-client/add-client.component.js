angular.module('App')
  .component('addClient', {
    templateUrl: './component/add-client/add-client.html',
    controller: AddClientController,
    controllerAs: 'ctrl',
    bindings: {
      clientToEdit: '=?',
      cancelCallback: '&?',
      clients: '=',
      children: '=',
    },
  });

function AddClientController($scope, clientFactory, childFactory, logFactory) {
  const vm = this;
  vm.isSaving = false;
  vm.client = {children: [{}]};
  vm.today = new Date();

  vm.cancelAddition = cancelAddition;
  vm.addChild = addChild;
  vm.removeChild = removeChild;
  vm.updateChildAge = updateChildAge;
  vm.createClient = createClient;

  function addChild() {
    vm.client.children.push({});
  }

  function removeChild(key) {
    vm.client.children.splice(key, 1);
  }

  function cancelAddition() {
    if (vm.clientToEdit != null) {
      vm.client = angular.copy(vm.formerClient);
    }
    closeEditing();
  }

  function closeEditing() {
    vm.isSaving = false;
    vm.cancelCallback();
  }

  function updateChildAge(birthday, child) {
    child.age = moment(vm.today).diff(birthday, 'years');
  }

  async function editClient(editedClient) {
    try {
      await clientFactory.editClient(editedClient);
      vm.children = clientFactory.addClientInChildrenList(editedClient, vm.children, true);
      vm.clients = [...vm.clients.filter((client) => client.id !== editedClient.id), editedClient];
    } catch (error) {
      logFactory.showToaster('Erro', 'Ocorreu um erro ao editar o cliente, por favor, tente novamente', 'error');
    }
  }

  async function createClient(client) {
    vm.isSaving = true;

    if (vm.clientToEdit != null) {
      await editClient(client);
      closeEditing();
      logFactory.showToaster('Sucesso', 'Cliente editado com sucesso', 'success');
    } else {
      try {
        const {data: createdClient} = await clientFactory.createClient(client);
        client.id = createdClient.id;
        client.children.forEach(async(child) => {
          child.client_id = client.id;
          try {
            const {data: createdChild} = await childFactory.createChild(child);
            child.id = createdChild.id;
            addChildInList(child, client);
          } catch (error) {
            clientFactory.deleteClient(client.id);
            logFactory.showToaster('Erro', 'Ocorreu um erro ao salvar a criança, por favor, tente novamente', 'error');
          }
        });
        vm.clients.push(createdClient);
        closeEditing();
        logFactory.showToaster('Sucesso', `Cliente ${createdClient.name} salvo`, 'success');
      } catch (error) {
        logFactory.showToaster('Erro', 'Ocorreu um erro ao salvar o cliente, por favor, tente novamente', 'error');
        logFactory.log(error, 'error');
      }
    }
  }

  function addChildInList(child, client) {
    vm.children.push({
      name: child.name,
      birthday: child.birthday,
      formattedBirthday: moment(child.birthday).format('DD/MM'),
      age: moment(new Date()).diff(child.birthday, 'years'),
      client,
    });
  }

  $scope.$watch(() => (vm.clientToEdit != null), () => {
    if (vm.clientToEdit != null) {
      vm.formerClient = angular.copy(vm.clientToEdit);
      vm.client = {
        ...vm.clientToEdit,
        cpf: Number(vm.clientToEdit.cpf),
        children: vm.clientToEdit.children.map((child) => ({
          ...child,
          birthday: moment(child.birthday).toDate(),
          age: moment(vm.today).diff(child.birthday, 'years'),
        })),
      };
    }
  });
}
