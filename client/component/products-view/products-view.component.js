angular.module('App')
  .component('productsView', {
    templateUrl: './component/products-view/products-view.html',
    controller: ProductsViewController,
    controllerAs: 'ctrl',
  });

function ProductsViewController (toolbarFactory, productFactory, $scope) {
  const vm = this;

  let productsWithoutFilter = null;

  vm.isAddingProduct = false;
  vm.products = [];

  vm.triggerAddingProduct = triggerAddingProduct;
  vm.cancelAddingProduct = cancelAddingProduct;
  vm.editProduct = editProduct;
  vm.filterProducts = filterProducts;

  function filterProducts (search) {
    vm.products = (search) ?
      getFilteredProducts(search) :
      productsWithoutFilter;
  }

  function getFilteredProducts (search) {
    return productsWithoutFilter
      .filter((product) => Object.values(product).filter((productProperty) => String(productProperty)
        .toLowerCase().includes(search.toLowerCase())).length);
  }

  function editProduct (product) {
    vm.productToEdit = product;
    vm.isAddingProduct = true;
  }

  function cancelAddingProduct () {
    vm.isAddingProduct = false;
    toolbarFactory.setToolbarTitle('Produtos');
    vm.productToEdit = null;
    $scope.$apply();
  }

  function triggerAddingProduct () {
    vm.isAddingProduct = true;
    toolbarFactory.setToolbarTitle('Adicionar produto');
  }

  function init () {
    toolbarFactory.setToolbarTitle('Produtos');

    productFactory.getProducts().then((productData) => {
      const {data: products} = productData;
      vm.products = products;
      productsWithoutFilter = angular.copy(vm.products);
    });
  }

  init();
}
