angular.module('App')
.component('toolbar', {
  templateUrl: './component/toolbar/toolbar.html',
  controller: ToolbarController,
  controllerAs: 'ctrl'
});

function ToolbarController ($cookies, $location) {
  const vm = this;

  vm.logout = logout;

  function logout () {
    $cookies.remove('token');
    $location.path('/');
  }
}