angular.module('App')
.component('productsView', {
  templateUrl: './component/products-view/products-view.html',
  controller: ProductsViewController,
  controllerAs: 'ctrl'
});

function ProductsViewController (toolbarFactory, productFactory) {
  const vm = this;

  let productsWithoutFilter = null;

  vm.isAddingProduct = false;
  vm.products = [];

  vm.triggerAddingProduct = triggerAddingProduct;
  vm.cancelAddingProduct = cancelAddingProduct;
  vm.editProduct = editProduct;
  vm.filterProducts = filterProducts;

  function filterProducts (search) {
    vm.products = (search)
      ? productsWithoutFilter.filter((product) => {
          return Object.values(product).filter((productProperty) =>
            String(productProperty).toLowerCase().includes(search.toLowerCase())).length;
        })
      : productsWithoutFilter;
  }

  function editProduct (product) {
    vm.productToEdit = product;
    vm.isAddingProduct = true;
  }

  function cancelAddingProduct () {
    vm.isAddingProduct = false;
    toolbarFactory.setToolbarTitle('Produtos');
    vm.productToEdit = null;
  }

  function triggerAddingProduct () {
    vm.isAddingProduct = true
    toolbarFactory.setToolbarTitle('Adicionar produto');
  }

  function init () {
    toolbarFactory.setToolbarTitle('Produtos');

    productFactory.getProducts().then((productData) => {
      const {data: products} = productData;
      vm.products = products;
      productsWithoutFilter = vm.products;
    });
  }

  init();
}