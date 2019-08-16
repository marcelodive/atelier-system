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

function AddOrderController ($scope, utilsFactory, logFactory, productFactory, clientFactory) {
  const vm = this;

  vm.buildAddressFromCEP = buildAddressFromCEP;
  vm.formatPrice = utilsFactory.formatPrice;
  vm.getMatchingProducts = getMatchingProducts;
  vm.updateAutocompleteProduct = updateAutocompleteProduct;
  vm.addNewProductRow = addNewProductRow;
  vm.updateTotalPrice = updateTotalPrice;
  vm.removeProduct = removeProduct;
  vm.fillInstallmentsWithPrice = fillInstallmentsWithPrice;
  vm.updateTotalInstallmentPrice = updateTotalInstallmentPrice;
  vm.updateTotalProductsPrice = updateTotalProductsPrice;
  vm.getMatchingClients = getMatchingClients;

  function getMatchingClients (searchText) {
    const productsName = addedProducts.map((product) => product.name);
    const productsNotInList = vm.products.filter((product) => !productsName.includes(product.name));
    return productsNotInList.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase()));
  }

  function updateTotalInstallmentPrice () {
    vm.order.totalInstallmentPrice = vm.order.installments.reduce((totalPrice, installment) =>
      installment.price ? (totalPrice + Number(installment.price)) : totalPrice, 0).toFixed(2);
  }

  function fillInstallmentsWithPrice (numInstallments) {
    vm.order.installments = [];
    for (let i = 0; i < numInstallments; i++) {
      vm.order.installments[i] = vm.order.installments[i] || {};
      vm.order.installments[i].price = utilsFactory.formatPrice((vm.order.totalProductsPrice/numInstallments).toFixed(2));
    }
    updateTotalInstallmentPrice();
  }

  function updateTotalProductsPrice () {
    const totalProductsPrice = vm.order.products.reduce((totalPrice, product) =>
      product.totalPrice ? (totalPrice + Number(product.totalPrice)) : totalPrice, 0);

    const totalProductsPriceWithDiscount = (vm.order.hasDiscount && vm.order.discount)
      ? totalProductsPrice * (1 - vm.order.discount/100)
      : totalProductsPrice;

    vm.order.totalProductsPrice = totalProductsPriceWithDiscount.toFixed(2);

    if (vm.order.installments) {
      fillInstallmentsWithPrice (vm.order.installments.length)
    }
  }

  function removeProduct (key) {
    vm.order.products.splice(key, 1);
    updateTotalProductsPrice();
  }

  function updateTotalPrice (product) {
    product.totalPrice = (product.price * product.quantity).toFixed(2);
    updateTotalProductsPrice();
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
    const autocompleteItem = product.autocompleteItem;
    product.name = autocompleteItem.name;
    product.price = autocompleteItem.price;
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

    const {data: clients} = await clientFactory.getClients();
    vm.clients = clients;
  }

  init();
 }