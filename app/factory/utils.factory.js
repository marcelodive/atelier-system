angular.module('App')
.factory('utilsFactory', ($http) => {
  function formatPrice (price) {
    if (price && !String(price).includes('.')) {
      price = `${price}.00`;
    }
    price = price ? String(price).replace(/[^0-9]/g,'') : '0';
    const decimals = '0'.concat(price).slice(-2); // this '0' avoid '2' becoming '20', for example
    return Number(price.substring(0,price.length-2).concat('.').concat(decimals)).toFixed(2);
  }

  function getAddress (cep) {
    const cepOnlyWithNumbers = cep.replace(/[^0-9]/, '');
    return $http.get(`https://viacep.com.br/ws/${cepOnlyWithNumbers}/json/`);
  }

  return {
    formatPrice: formatPrice,
    getAddress: getAddress
  }
});