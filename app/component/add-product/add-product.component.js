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

function AddProductController ($scope, logFactory, productFactory, utilsFactory) {
  const vm = this;
  vm.isSaving = false;

  vm.closeEditing = closeEditing;

  if (vm.productToEdit) {
    vm.product = vm.productToEdit;
  } else {
    vm.product = {};
    vm.product.price = Number('0').toFixed(2);
  }

  vm.formatPrice = formatPrice;
  vm.createProduct = createProduct;

  function formatPrice (price) {
    vm.product.price = utilsFactory.formatPrice(price);
  }

  function closeEditing () {
    vm.isSaving = false;
    vm.cancelCallback();
  }

  async function editProduct (editedProduct) {
    try {
      await productFactory.editProduct(editedProduct);
      vm.products = [...vm.products.filter((product) => product.id !== editedProduct.id), editedProduct];
      closeEditing ();
    } catch (error) {
      logFactory.showToaster('Erro', `Ocorreu um erro ao editar o producto, por favor, tente novamente`, 'error');
    }
  }

  async function createProduct (product) {
    vm.isSaving = true;
    if (vm.productToEdit) {
      editProduct (product);
    } else {
      try {
        const {data: createdProduct} = await productFactory.createProduct(product);
        vm.products.push(createdProduct);
        closeEditing();
        logFactory.showToaster('Sucesso', `Produto ${createdProduct.name} salvo`, 'success');
      } catch (error) {
        logFactory.showToaster('Erro', `Ocorreu um erro ao salvar o produto, por favor, tente novamente`, 'error');
        logFactory.log(error, 'error');
      }
    }
  }

  $scope.$watch(() => vm.productToEdit, () => {
    vm.product = vm.productToEdit;
  });
}