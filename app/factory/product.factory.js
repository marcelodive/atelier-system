angular.module('App')
.factory('productFactory', ($http, constants) => {
  function createProduct (product) {
    return $http.post(`${constants.API}/Products`, product);
  }

  function getProducts () {
    return $http.get(`${constants.API}/Products`);
  }

  function deleteProduct (productId) {
    return $http.delete(`${constants.API}/Products/${productId}`);
  }

  async function editProduct (product) {
    return $http.put(`${constants.API}/Products/${product.id}`, product);
  }

  return {
    createProduct: createProduct,
    getProducts: getProducts,
    deleteProduct: deleteProduct,
    editProduct: editProduct
  }
});