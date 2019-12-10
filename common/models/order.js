const app = require('../../server/server');
const templates = require('../templates');
const sgMail = require('@sendgrid/mail');
const emailStatuses = require('../constants').emailStatuses;

module.exports = function (Order) {
  Order.saveOrder = async (order) => {
    console.log('Starting saving order');
    order.cep = Number(String(order.cep).replace('-', ''));
    const savedOrder = await Order.upsert(order);
    order.id = savedOrder.id;

    saveOrderInstallments(order);
    saveOrderProducts(order);

    return savedOrder;
  };

  function saveOrderInstallments (order) {
    console.log('Starting saving installments');
    const {Installment} = app.models;

    console.log('Destroy installments');
    Installment.destroyAll({order_id: order.id}).then(() => {
      console.log('End destroy installments');
      order.installments.forEach(async (installment, index) => {
        console.log('Saving installments');
        installment.id = null;
        installment.order_id = order.id;
        installment.payment_day = order.paymentDay[index];
        Installment.create(installment);
      });
    });
  }

  function saveOrderProducts (order) {
    console.log('Start saving order products');
    const {OrderProduct} = app.models;
    const {Product} = app.models;

    console.log('Destroy OrderProducts');
    OrderProduct.destroyAll({order_id: order.id}).then(() => {
      console.log('End destroy OrderProducts');
      order.products.filter((product) => product.name)
        .forEach(async (product) => {
          console.log('Saving OrderProducts');
          product.id = null;
          product.order_id = order.id;
          product.name = product.searchText;
          OrderProduct.create(product);

          const productToUpdateOrAdd = (product.autocompleteItem) ?
            product.autocompleteItem :
            product;
          console.log('Upserting products');
          Product.upsert(productToUpdateOrAdd)
            .catch(() => console.log('error'));
        });
    });
  }

  Order.sendEmail = (orderId, cb) => {
    Order.findById(orderId,
      {'include': ['orderProducts', 'installments', {'child': 'client'}]})
      .then((order) => {
        order = JSON.parse(JSON.stringify(order));
        const msg = buildMessage(order);
        sgMail.setApiKey('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');
        sgMail.send(msg);
        order.email_status = emailStatuses.sent;
        Order.upsert(order);
        cb(null, true);
      })
      .catch((error) => { console.log(error); cb(null, false); });
  };

  function buildMessage (order) {
    const timestamp = Date.now();
    const emailMessage = buildHtmlEmail(order, timestamp);

    saveConfirmationEmail(emailMessage, order, timestamp);

    const emailObject = {
      // eslint-disable-next-line max-len
      to: [order.child.client.email], // Adicionar atelieluizafs@hotmail.com: Automatically BCC an address for every e-mail sent. (https://app.sendgrid.com/settings/mail_settings)
      from: 'atelieluizafs@hotmail.com',
      subject: '[Luiza Sales Ateliê] Confirmação do pedido',
      html: emailMessage,
    };

    return emailObject;
  }

  function buildHtmlEmail (order, timestamp) {
    return templates.buildMailOrder(order, timestamp);
  }

  function saveConfirmationEmail (emailMessage, order, timestamp) {
    const {ConfirmationEmail} = app.models;

    ConfirmationEmail.create({
      order_id: order.id,
      timestamp: timestamp,
      html: emailMessage,
    });
  }

  Order.acceptOrder = (emailData, cb) => {
    Order.findById(emailData.orderId).then((order) => {
      order.email_status = emailStatuses.accepted;
      Order.upsert(order);
    });
  };

  Order.rejectOrder = (emailData, cb) => {
    Order.findById(emailData.orderId).then((order) => {
      order.email_status = emailStatuses.accepted;
      Order.upsert(order);
    });
  };

  Order.remoteMethod('saveOrder', {
    accepts: {arg: 'order', type: 'Object'},
    returns: {arg: 'order', type: 'Object'},
  });

  Order.remoteMethod('sendEmail', {
    accepts: {arg: 'orderId', type: 'number'},
    returns: {arg: 'success', type: 'Boolean'},
  });

  Order.remoteMethod('acceptOrder', {
    accepts: {arg: 'emailData', type: 'Object'},
  });

  Order.remoteMethod('rejectOrder', {
    accepts: {arg: 'emailData', type: 'Object'},
  });
};
