angular.module('App')
.factory('clientFactory', ($http, constants) => {
  function createClient (client) {
    return $http.post(`${constants.API}/Clients`, client);
  }

  function getClients () {
    return $http.get(`${constants.API}/Clients`);
  }

  function deleteClient (clientId) {
    return $http.delete(`${constants.API}/Clients/${clientId}`);
  }

  async function editClient (client) {
    await $http.put(`${constants.API}/Clients/${client.id}`, client);
    return Promise.all(client.children.map((child) => $http.put(`${constants.API}/Children/${child.id}`, child)));
  }

  function addClientInChildrenList (client, childrenList, isEditing = false) {
    if (isEditing) {
      childrenList = childrenList.filter((child) => child.client.id !== client.id);
    }

    client.children.forEach((child) => {
      childrenList.push({
        name:child.name,
        birthday:child.birthday,
        formatedBirthday:moment(child.birthday).format('MM/DD'),
        age: moment(new Date()).diff(child.birthday, 'years'),
        client:client
      })
    });

    return childrenList;
  }

  return {
    createClient: createClient,
    getClients: getClients,
    deleteClient: deleteClient,
    editClient: editClient,
    addClientInChildrenList: addClientInChildrenList
  }
});