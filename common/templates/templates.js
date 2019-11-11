const moment = require('moment');

function buildMailOrder (order) {
  return 'kkkk';
  let emailOrder = `
    <div layout="row">
    <span flex="50">
      <b>Criança</b>: ${order.child.name} <br>
      <b>Nascimento:</b> ${formatBirthday(order.child.birthday)}
        <span>(${childAge(order.child.birthday)})</span>
    </span>
    <br/>
    <span flex="50">
      <b>Responsável</b>: ${order.child.client.name} <br>
      <b>CPF</b>: ${order.child.client.cpf} <br>
      <b>Contatos</b>: ${order.child.client.phone} | ${order.child.client.email}
    </span>
    </div>
    <br>
    <span layout="row">
    <span layout="column" flex="50">`;

  console.log(emailOrder);

  if (order.delivery_by === 'atelier') {
    emailOrder += `
    <span ng-if="order.delivery_by === 'atelier'">
      Entrega no <b>ateliê</b> às <b>${ order.delivery_hour} horas
      <span ng-show="order.delivery_minute">e ${ order.delivery_minute} minutos</span></b>.
    </span>
    `;
  } else if (order.delivery_by === 'party') {
    emailOrder += `
      <span ng-if="order.delivery_by === 'party'" >
          Entrega na <b>festa</b> às <b>${ order.delivery_hour} horas
        <span ng-show="order.delivery_minute">e ${ order.delivery_minute} minutos</span></b>
          no endereço:
      </span>
    `;
  } else if (order.delivery_by === 'correios') {
    emailOrder += `
      <span ng-if="order.delivery_by === 'correios'">
        Envio pelos <b>Correios</b> para:
      </span>
    `;
  }
  emailOrder += '<br>';

  console.log(emailOrder);

  if (order.delivery_by !== 'atelier') {
    emailOrder += `<span ng-if="order.delivery_by !== 'atelier'" flex="50">
      <span>
        ${order.public_place},
        <span ng-show="order.complement"> nº ${order.public_place_number},</span>
        ${order.neighborhood}, ${order.city}/${order.state}.
        <span ng-if="order.complement">(${order.complement})</span>
      </span>
    </span>`;
  }

  console.log(emailOrder);

  emailOrder += `
    </span>
    <br><br>
    <span>
    <b>Tema da festa</b>: ${order.theme} <br>
    <b>Cores</b>: ${order.colors} <br>
    </span>
    <br>
    <md-table-container>
    <table style="border-collapse: collapse; border: 1px solid black; width: 100%; text-align: center">
      <thead md-head>
        <tr md-row>
          <th class="center-text" md-column>Nome</th>
          <th class="center-text" md-column>Preço (R$)</th>
          <th class="center-text" md-column>Quantidade</th>
          <th class="center-text" md-column>Total</th>
        </tr>
      </thead>
      <tbody md-body>`;

  console.log(emailOrder);

  order.products.forEach(product => {
    const productRow = `<tr md-row ng-repeat="(key, product) in order.orderProducts">
      <td>${product.name}</td>
      <td>R$${formatPrice(product.price)}</td>
      <td>${product.quantity}</td>
      <td>R$${formatPrice(product.quantity * product.price)}</td>
    </tr>`;
    emailOrder += productRow;
  });

  console.log(emailOrder);

  emailOrder += `
      </tbody>
    </table>
    </md-table-container>
    <br>
    <span>
    <span><b>Forma de pagamento</b>: ${order.payment_method}</span> em ${order.num_installments}
      parcela(s).
    </span>
    <div layout="row" layout-align="space-around center">
    <ul>`;

  console.log(emailOrder);

  order.installments.forEach((installment, index) => {
    const installmentSpan = `
      <span
        layout="column" class=""
        layout-align="space-between center">
        <li><span><b>Parcela ${index + 1}</b>:</span>
        <span>${formatDate(installment.payment_day)}</span>
        <span>R$${formatPrice(installment.price)}</span>.</li>
      </span>
    `;

    emailOrder += installmentSpan;
  });

  console.log(emailOrder);

  emailOrder += `
    </ul>
    </div>
    <div layout="row" layout-align="space-between center">
        <span><b>Preço total das parcelas</b>: R$${order.total_installment_price}</span>
    </div>
  `;

  console.log(emailOrder);

  return emailOrder;
}

function formatBirthday (birthday) {
  return moment(birthday).format('DD/MM/YYYY');
}

const today = new Date();
function childAge (birthday) {
  const age = moment(today).diff(birthday, 'years');
  return `${age} ${(age > 1) ? 'anos' : 'ano'}`;
}

function formatPrice (price) {
  if (typeof price === 'string' || price instanceof String) {
    price = price ? String(price).replace(/[^0-9]/g, '') : '0';
    const decimals = '0'.concat(price).slice(-2); // this '0' avoid '2' becoming '20', for example
    return Number(price.substring(0, price.length - 2).concat('.').concat(decimals)).toFixed(2);
  } else {
    return price.toFixed(2);
  }
}

function formatDate (date) {
  return moment.utc(date).format('DD/MM/YYYY');
}

exports.buildMailOrder = buildMailOrder;
