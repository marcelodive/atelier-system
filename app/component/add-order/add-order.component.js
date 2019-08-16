angular.module('App')
.component('addOrder', {
  templateUrl: './component/add-order/add-order.html',
  controller: AddOrderController,
  controllerAs: 'ctrl',
  bindings: {
    orderToEdit: '=?',
    cancelCallback: '&?',
    orders: '='
  }
});

function AddOrderController ($scope, utilsFactory, logFactory, productFactory) {
  const vm = this;

  vm.buildAddressFromCEP = buildAddressFromCEP;
  vm.formatPrice = utilsFactory.formatPrice;
  vm.getMatchingProducts = getMatchingProducts;
  vm.updateAutocompleteProduct = updateAutocompleteProduct;
  vm.addNewProductRow = addNewProductRow;
  vm.updateTotalPrice = updateTotalPrice;

  function updateTotalPrice (product) {
    product.totalPrice = (product.price * product.quantity).toFixed(2);
  }

  function addNewProductRow (products) {
    const lastItem = products[products.length - 1];
    if (lastItem.name && lastItem.price && lastItem.quantity) {
      products.push({});
    }
  }

  function getMatchingProducts (searchText, addedProducts) {
    const productsName = addedProducts.map((product) => product.name);
    const productsNotInList = vm.products.filter((product) => !productsName.includes(product.name));
    return productsNotInList.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase()));
  }

  function updateAutocompleteProduct (product) {
    const selectedItem = product.selectedItem;
    product.name = selectedItem.name;
    product.price = selectedItem.price;
  }

  async function buildAddressFromCEP (cep) {
    try {
      const {data:address} = await utilsFactory.getAddress(cep);
      vm.order.cep = address.cep;
      vm.order.neighborhood = address.bairro;
      vm.order.city = address.localidade;
      vm.order.publicPlace = address.logradouro;
      vm.order.state = address.uf;
    } catch (erro) {
      logFactory.showToaster('', `Este CEP não existe`, 'warn');
    } finally {
      $scope.$apply();
    }
  }

  async function init () {
    vm.order = {products: [{}]};
    const {data: products} = await productFactory.getProducts();
    vm.products = products;
  }

  init();
 }