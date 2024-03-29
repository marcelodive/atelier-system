angular.module('App')
  .factory('utilsFactory', ($http) => {
    function formatPrice (price) {
      if (typeof price === 'string' || price instanceof String) {
        price = price ? String(price).replace(/[^0-9]/g, '') : '0';
        const decimals = '0'.concat(price).slice(-2); // this '0' avoid '2' becoming '20', for example
        return Number(price.substring(0, price.length - 2).concat('.').concat(decimals)).toFixed(2);
      } else {
        return price ?
          price.toFixed(2) :
          null;
      }
    }

    function getAddress (cep) {
      const cepOnlyWithNumbers = cep.replace(/[^0-9]/, '');
      return $http.get(`https://viacep.com.br/ws/${cepOnlyWithNumbers}/json/`);
    }

    function formatBirthday (birthday) {
      return moment(birthday).format('DD/MM/YYYY');
    }

    return {
      formatPrice,
      getAddress,
      formatBirthday,
    };
  });
