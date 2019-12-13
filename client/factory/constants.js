angular.module('App')
  .constant('emailStatuses', {
    0: 'Email não enviado.',
    1: 'Email enviado',
    2: 'Pedido aceito pelo cliente',
    3: 'Pedido recusado pelo cliente',
  });
