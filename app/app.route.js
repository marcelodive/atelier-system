angular.module('App')
.config(function config($routeProvider) {
  $routeProvider
    .when('/pedidos', {
      template: 'Aguarde... <orders-view></orders-view>'
    })
    .when('/produtos', {
      template: 'Aguarde... <products-view></products-view>'
    })
    .when('/clientes', {
      template: '<clients-view></clients-view>'
    })
    .when('/notificacoes', {
      template: 'Aguarde... <notifications-view></notifications-view>'
    })
    .when('/configuracoes', {
      template: 'Aguarde... <configurations-view></configurations-view>'
    })
    .otherwise('index.html');
})