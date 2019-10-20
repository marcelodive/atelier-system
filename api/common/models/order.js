'use strict';
const app = require('../../server/server');

module.exports = function(Order) {

  Order.saveOrder = async (order) => {
    const Installment = app.models.Installment;
    const OrderProduct = app.models.OrderProduct;
    const Product = app.models.Product;

    order.cep = Number(order.cep.replace('-', ''));
    const savedOrder = await Order.upsert(order);

    order.installments.forEach((installment, index) => {
      installment.order_id = savedOrder.id;
      installment.payment_day = savedOrder.paymentDay[index];
      Installment.upsert(installment);
    });

    order.products.forEach((product) => {
      product.order_id = savedOrder.id;
      product.name = product.searchText;
      OrderProduct.upsert(product);

      const productToUpdateOrAdd = (product.autocompleteItem)
        ? product.autocompleteItem
        : product;
      Product.upsert(productToUpdateOrAdd);
    });

    return savedOrder;
  }

  Order.remoteMethod('saveOrder', {
    accepts: {arg: 'order', type: 'Object'},
    returns: {arg: 'order', type: 'Object'}
  });

};
