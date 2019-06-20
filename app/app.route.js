angular.module('App')
.config(function config($routeProvider) {
  $routeProvider.

    // when('/login', {
    //   template: 'Tudo bem?'
    // }).

    // when('/phones/:phoneId', {
    //   template: 'Tudo bão?'
    // }).

    otherwise('index.html');

})