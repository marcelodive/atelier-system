
const app = require('../../server/server');
const sendmail = require('sendmail')();

module.exports = function(Order) {
  Order.saveOrder = async(order) => {
    order.cep = Number(String(order.cep).replace('-', ''));
    const savedOrder = await Order.upsert(order);

    saveOrderInstallments(order);
    saveOrderProducts(order);

    sendConfirmationEmailToCliente(order);

    return savedOrder;
  };

  function saveOrderInstallments (order) {
    const {Installment} = app.models;

    Installment.destroyAll({order_id: savedOrder.id});
    order.installments.forEach((installment, index) => {
      installment.order_id = savedOrder.id;
      installment.payment_day = savedOrder.paymentDay[index];
      Installment.upsert(installment);
    });
  }

  function saveOrderProducts (order) {
    const {OrderProduct} = app.models;
    const {Product} = app.models;

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
  }

  function sendConfirmationEmailToCliente (order) {
    sendmail({
      from: 'test@yourdomain.com',
      to: 'info@yourdomain.com',
      replyTo: 'jason@yourdomain.com',
      subject: 'MailComposer sendmail',
      html: 'Mail of test sendmail '
    }, function (err, reply) {
      console.log(err && err.stack)
      console.dir(reply)
    })
  }

  Order.remoteMethod('saveOrder', {
    accepts: {arg: 'order', type: 'Object'},
    returns: {arg: 'order', type: 'Object'},
  });
};
