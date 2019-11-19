const app = require('../../server/server');
const templates = require('../templates/templates');

module.exports = function (Order) {
  Order.saveOrder = async (order) => {
    order.cep = Number(String(order.cep).replace('-', ''));
    const savedOrder = await Order.upsert(order);
    order.id = savedOrder.id;

    saveOrderInstallments(order);
    saveOrderProducts(order);

    return savedOrder;
  };

  function saveOrderInstallments (order) {
    const {Installment} = app.models;

    Installment.destroyAll({order_id: order.id});
    order.installments.forEach(async (installment, index) => {
      installment.order_id = order.id;
      installment.payment_day = order.paymentDay[index];
      Installment.upsert(installment);
    });
  }

  function saveOrderProducts (order) {
    const {OrderProduct} = app.models;
    const {Product} = app.models;

    order.products.filter((product) => product.name)
      .forEach(async (product) => {
        product.order_id = order.id;
        product.name = product.searchText;
        OrderProduct.upsert(product);

        const productToUpdateOrAdd = (product.autocompleteItem) ?
          product.autocompleteItem :
          product;
        Product.upsert(productToUpdateOrAdd);
      });
  }

  Order.sendEmail = async (orderId) => {
    const sgMail = require('@sendgrid/mail');

    Order.findById(orderId,
      {'include': ['orderProducts', 'installments', {'child': 'client'}]})
      .then(async (order) => {
        order = JSON.parse(JSON.stringify(order));

        sgMail.setApiKey('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');
        const msg = {
          // eslint-disable-next-line max-len
          to: [order.child.client.email], // Adicionar atelieluizafs@hotmail.com: Automatically BCC an address for every e-mail sent. (https://app.sendgrid.com/settings/mail_settings)
          from: 'atelieluizafs@hotmail.com',
          subject: '[Ateliê Luiza Sales] Confirmação do pedido',
          html: buildHtmlEmail(order),
        };
        sgMail.send(msg);
      })
      .catch(error => error);
  };

  function buildHtmlEmail (order) {
    return templates.buildMailOrder(order);
  }

  Order.remoteMethod('saveOrder', {
    accepts: {arg: 'order', type: 'Object'},
    returns: {arg: 'order', type: 'Object'},
  });

  Order.remoteMethod('sendEmail', {
    accepts: {arg: 'orderId', type: 'number'},
    returns: {arg: 'orderId', type: 'number'},
  });
};
