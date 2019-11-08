
const app = require('../../server/server');
const sendmail = require('sendmail')();

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

  Order.sendConfirmationEmailToCliente = (order) => {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pedidos.luizasales@gmail.com',
        pass: '6p&mG3Aj*XYt',
      },
    });

    const mailOptions = {
      from: 'pedidos.luizasales@gmail.com',
      to: [order.child.client.email], // Adicionar atelieluizafs@hotmail.com
      subject: '[Ateliê Luiza Sales] Confirmação do pedido',
      html: buildHtmlEmail(order),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return 'Erro: Email não pode ser enviado | ' + error;
      } else {
        return 'Sucesso: Email enviado | ' + info.response;
      }
    });
  };

  function buildHtmlEmail (order) {
    return `
      <p>Olá, Fulano!</p>

      <p>Por favor, confira se as informações do seu pedido estão corretas: </p>

      <p><b>Endereço</b>: ${order.public_place}, ${order.public_place_number } (${order.complement }).
              ${order.neighborhood}, ${order.city}/${order.state}. </p>
      <p><b></b></p>
      <p><b></b></p>
    `;
  }

  Order.remoteMethod('saveOrder', {
    accepts: {arg: 'order', type: 'Object'},
    returns: {arg: 'order', type: 'Object'},
  });

  Order.remoteMethod('sendConfirmationEmailToCliente', {
    accepts: {arg: 'order', type: 'Object'},
    returns: {arg: 'status', type: 'string'},
  });
};
