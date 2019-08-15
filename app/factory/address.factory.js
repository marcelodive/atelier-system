angular.module('App')
.factory('addressFactory', ($http) => {
  function getAddress (cep) {
    const cepOnlyWithNumbers = cep.replace(/[^0-9]/, '');
    return $http.get(`https://viacep.com.br/ws/${cepOnlyWithNumbers}/json/`);
  }

  return {
    getAddress: getAddress
  }
});