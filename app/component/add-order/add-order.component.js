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

function AddOrderController ($scope, $timeout, utilsFactory, logFactory, productFactory, clientFactory, orderFactory) {
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
  vm.updateClientForm = updateClientForm;
  vm.createOrder = createOrder;

  init();

  async function createOrder (order) {
    try {
      vm.isSaving = true;
      const newOrder = await orderFactory.createOrder(order);
      if (vm.orderToEdit) {
        vm.orders = vm.orders.filter((order) => order.id !== newOrder.id);
      }
      vm.orders.push(newOrder);
      logFactory.showToaster('Sucesso!', `Pedido salvo com sucesso`, 'success');
      vm.isSaving = false;
      vm.cancelCallback();
    } catch (error) {
      logFactory.showToaster('Erro', `Ocorreu um erro ao salvar o pedido, por favor, tente novamente`, 'error');
      logFactory.log(error, 'error');
    }
  }

  function updateClientForm (selectedChild) {
    vm.order.child_id = selectedChild.id;
  }

  function getMatchingClients (searchText) {
    searchText = searchText.toLowerCase();
    return vm.childrenWithClient.filter((child) => {
      const client = child.client;
      return (
        child.name.toLowerCase().includes(searchText) || client.name.toLowerCase().includes(searchText) ||
        client.email.toLowerCase().includes(searchText) || client.cpf.toLowerCase().includes(searchText) ||
        client.phone.toLowerCase().includes(searchText)
      );
    });
  }

  function updateTotalInstallmentPrice () {
    vm.order.total_installment_price = vm.order.installments.reduce((totalPrice, installment) =>
      installment.price ? (totalPrice + Number(installment.price)) : totalPrice, 0).toFixed(2);
  }

  function fillInstallmentsWithPrice (numInstallments) {
    vm.order.installments = [];
    for (let i = 0; i < numInstallments; i++) {
      vm.order.installments[i] = vm.order.installments[i] || {};
      vm.order.installments[i].price = utilsFactory.formatPrice((vm.order.total_products_price/numInstallments).toFixed(2));
    }
    updateTotalInstallmentPrice();
  }

  function updateTotalProductsPrice () {
    const totalProductsPrice = vm.order.products.reduce((totalPrice, product) =>
      product.totalPrice ? (totalPrice + Number(product.totalPrice)) : totalPrice, 0);

    const totalProductsPriceWithDiscount = (vm.order.has_discount && vm.order.discount)
      ? totalProductsPrice * (1 - vm.order.discount/100)
      : totalProductsPrice;

    vm.order.total_products_price = totalProductsPriceWithDiscount.toFixed(2);

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
    const mustAddNewRow = products.every((product) => !!product.name);

    if (mustAddNewRow) {
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
      vm.order.public_place = address.logradouro;
      vm.order.state = address.uf;
    } catch (erro) {
      logFactory.showToaster('', `Este CEP não existe`, 'warn');
    } finally {
      $scope.$apply();
    }
  }

  function buildChildListFromClient (clientsWithChildren) {
    let childrenWithClient = [];

    clientsWithChildren.forEach(clientWithChildren => {
      clientWithChildren.children.forEach(child => {
        child.formattedBirthday = moment(child.birthday).format('DD/MM');
        child.age = moment(new Date()).diff(child.birthday, 'years');
        childWithClient = {...child, client: clientWithChildren};
        childrenWithClient.push(childWithClient);
      });
    });

    return childrenWithClient;
  }

  async function init () {
    vm.order = {products: [{}]};
    const {data: products} = await productFactory.getProducts();
    vm.products = products;

    const {data: clientsWithChildren} = await clientFactory.getClientsWithChildren();
    vm.clientsWithChildren = clientsWithChildren;
    vm.childrenWithClient = buildChildListFromClient(clientsWithChildren);

    if (vm.orderToEdit) {
      $timeout(() => buildOrderToEdit());
    }
  }

  function buildOrderToEdit () {
    vm.order = angular.copy(vm.orderToEdit);

    vm.selectedChild = angular.copy(vm.orderToEdit.child);
    vm.selectedChild.formattedBirthday = utilsFactory.formatBirthday(vm.selectedChild.birthday);
    const today = new Date();
    vm.selectedChild.age = moment(today).diff(vm.selectedChild.birthday, 'years');
    vm.order.products = vm.orderToEdit.orderProducts.map((product => {
      product.autocompleteItem = angular.copy(product);
      return product;
    }));
    vm.order.products.forEach((product) => updateTotalPrice(product));
    addNewProductRow(vm.order.products);

    vm.order.installments.forEach((installment) => {
      installment.paymentDay = installment.payment_day;
    });

    vm.order.has_discount = vm.orderToEdit.has_discount ? 1 : 0;
    vm.order.paymentDay = vm.orderToEdit.installments.map((installment) => installment.payment_day)
  }
}