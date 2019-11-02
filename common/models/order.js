
const app = require('../../server/server');

module.exports = function(Order) {
  Order.saveOrder = async(order) => {
    const {Installment} = app.models;
    const {OrderProduct} = app.models;
    const {Product} = app.models;
    order.cep = Number(String(order.cep).replace('-', ''));
    const savedOrder = await Order.upsert(order);

    Installment.destroyAll({order_id: savedOrder.id});

    order.installments.forEach((installment, index) => {
      installment.order_id = savedOrder.id;
      installment.payment_day = savedOrder.paymentDay[index];
      Installment.upsert(installment);
    });

    order.products.filter((product) => product.name)
      .forEach((product) => {
        product.order_id = savedOrder.id;
        product.name = product.searchText;

        OrderProduct.upsert(product);

        const productToUpdateOrAdd = (product.autocompleteItem) ?
          product.autocompleteItem :
          product;
        Product.upsert(productToUpdateOrAdd);
      });

    return savedOrder;
  };

  Order.remoteMethod('saveOrder', {
    accepts: {arg: 'order', type: 'Object'},
    returns: {arg: 'order', type: 'Object'},
  });
};
