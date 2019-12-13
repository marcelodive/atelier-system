const app = require('../../server/server');
const templates = require('../templates');
const sgMail = require('@sendgrid/mail');
const emailStatuses = require('../constants').emailStatuses;
const telegram = require('../../server/boot/telegram');

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

    Installment.destroyAll({order_id: order.id}).then(() => {
      order.installments.forEach(async (installment, index) => {
        installment.id = null;
        installment.order_id = order.id;
        installment.payment_day = order.paymentDay[index];
        Installment.create(installment);
      });
    });
  }

  function saveOrderProducts (order) {
    const {OrderProduct} = app.models;
    const {Product} = app.models;

    OrderProduct.destroyAll({order_id: order.id}).then(() => {
      order.products.filter((product) => product.name)
        .forEach(async (product) => {
          product.id = null;
          product.order_id = order.id;
          product.name = product.searchText;
          OrderProduct.create(product);

          const autocompleteProduct = product.autocompleteItem || product.formerAutocompleteItem;
          const where = (autocompleteProduct) ?
            {name: autocompleteProduct.name} :
            {name: product.name};

          Product.upsertWithWhere(where, {name: product.name, price: product.price})
            .catch((error) => console.log(error));
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
        // sgMail.setApiKey('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');
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

    sendPosOrderCreatingTelegramMsg(order, timestamp);

    return emailObject;
  }

  function sendPosOrderCreatingTelegramMsg (order, timestamp) {
    telegram.sendNotification(`
Pedido criado/editado. Identificador para busca: ${order.id}-${timestamp}.
Cliente: ${order.child.client.name},
Data de entrega: ${order.delivery_day.substring(0, 10)}.
    `);
    telegram.sendNotification(`
Endereço para confirmação:
http://luiza-sales-site.umbler.net/order_confirmation.html?orderId=${order.id}&timestamp=${timestamp}
    `);
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
      telegram.sendNotification(`Pedido '${order.id}-${emailData.timestamp}' aceito pelo cliente!`);
      Order.upsert(order);
    });
  };

  Order.rejectOrder = (emailData, cb) => {
    Order.findById(emailData.orderId).then((order) => {
      order.email_status = emailStatuses.denied;
      telegram.sendNotification(`Pedido '${order.id}-${emailData.timestamp}' recusado pelo cliente!`);
      Order.upsert(order);
    });
  };

  Order.getEmailHTML = (emailData, cb) => {
    Order.findById(emailData.orderId,
      {'include': ['orderProducts', 'installments', {'child': 'client'}]})
      .then((order) => {
        order = JSON.parse(JSON.stringify(order));
        const template = templates.buildMailOrder(order, emailData.timestamp);
        cb(null, template);
      });
  };

  Order.remoteMethod('getEmailHTML', {
    accepts: {arg: 'emailData', type: 'Object'},
    returns: {arg: 'template', type: 'Object'},
  });

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
