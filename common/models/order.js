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

  Order.sendConfirmationEmailToCliente = (orderId) => {
    const nodemailer = require('nodemailer');

    Order.findById(orderId,
      {'include': ['orderProducts', 'installments', {'child': 'client'}]})
      .then((order) => {
        const auth = {
          type: 'oauth2',
          user: 'pedidos.luizasales@gmail.com',
          clientId: '90795499536-7ktvll2ik7gf9f32imp74521925b3242.apps.googleusercontent.com',
          clientSecret: 'OFNTTBDIS79mRYGU_zsrOvWd',
          refreshToken: '1//04efnWSui0mx6CgYIARAAGAQSNwF-L9Irtqzl_1ewkuvxT04xnpe9LYMhLSrylkh1zHXRGxZXJ2SZVLWnjqeB4Vxq9gRxfsE2fQs',
          pass: '6p&mG3Aj*XYt',
        };

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: auth,
        });

        const mailOptions = {
          from: 'pedidos.luizasales@gmail.com',
          to: [order.child.client.email], // Adicionar atelieluizafs@hotmail.com
          subject: '[Ateliê Luiza Sales] Confirmação do pedido',
          html: '<p>oi</p>', // buildHtmlEmail(order),
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return 'Erro: Email não pode ser enviado | ' + error;
          } else {
            return 'Sucesso: Email enviado | ' + info.response;
          }
        });
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

  Order.remoteMethod('sendConfirmationEmailToCliente', {
    accepts: {arg: 'orderId', type: 'number'},
    returns: {arg: 'status', type: 'string'},
  });
};
