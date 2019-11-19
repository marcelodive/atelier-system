angular.module('App')
  .constant('constants', {
    API: 'http://localhost:3000/api',
  })
  .constant('emailStatuses', {
    0: 'Email não enviado.',
    1: 'Email enviado',
    2: 'Pedido aceito pelo cliente',
    3: 'Pedido recusado pelo cliente',
  });
