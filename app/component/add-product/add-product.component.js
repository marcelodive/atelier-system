angular.module('App')
.component('addProduct', {
  templateUrl: './component/add-product/add-product.html',
  controller: AddProductController,
  controllerAs: 'ctrl',
  bindings: {
    productToEdit: '=?',
    cancelCallback: '&?',
    products: '='
  }
});

function AddProductController ($scope, $timeout, logFactory, productFactory, utilsFactory) {
  const vm = this;

  vm.isSaving = false;

  vm.addNewProductRow = addNewProductRow;
  vm.closeEditing = closeEditing;
  vm.formatPrice = formatPrice;
  vm.createProduct = createProduct;
  vm.addNewProductRow = addNewProductRow;
  vm.productsToAdd = [];

  $timeout(() => {
    if (vm.productToEdit) {
      vm.productsToAdd.push(vm.productToEdit);
      addNewProductRow();
    } else {
      vm.productsToAdd = [{price: Number('0').toFixed(2)}];
    };
  });


  function addNewProductRow () {
    const mustAddNewRow = vm.productsToAdd.every((product => !!product.name));

    if (mustAddNewRow) {
      vm.productsToAdd.push({});
    }
  }

  function formatPrice (product) {
    product.price = utilsFactory.formatPrice(product.price);
  }

  function closeEditing () {
    vm.isSaving = false;
    vm.cancelCallback();
  }

  async function editProduct (editedProduct) {
    try {
      await productFactory.editProduct(editedProduct);
      vm.products = [...vm.products.filter((product) => product.id !== editedProduct.id), editedProduct];
      closeEditing();
    } catch (error) {
      logFactory.showToaster('Erro', `Ocorreu um erro ao editar o produto, por favor, tente novamente`, 'error');
    }
  }

  async function createProduct (products) {
    vm.isSaving = true;
    if (vm.productToEdit) {
      const editedProduct = products.shift();
      editProduct(editedProduct);
    }

    if (products.length) {
      const validProducts = products.filter(product => product.name && product.price);
      validProducts.forEach(async (product) => {
        try {
          const {data: createdProduct} = await productFactory.createProduct(product);
          vm.products.push(createdProduct);
          closeEditing();
          logFactory.showToaster('Sucesso', `Produto ${createdProduct.name} salvo`, 'success');
        } catch (error) {
          logFactory.showToaster('Erro', `Ocorreu um erro ao salvar o produto ${product.name}, por favor, tente novamente`, 'error');
          logFactory.log(error, 'error');
        }
      });
    }
  }
}