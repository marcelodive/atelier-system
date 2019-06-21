angular.module('App')
.config(function config($routeProvider) {
  $routeProvider
    .when('/hi', {
      template: 'hi'
    })
    // .otherwise('index.html');
})