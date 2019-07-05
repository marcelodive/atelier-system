angular.module('App')
.component('toolbar', {
  templateUrl: './component/toolbar/toolbar.html',
  controller: ToolbarController,
  controllerAs: 'ctrl'
});

function ToolbarController ($cookies, $location, $scope, $mdMedia, toolbarFactory, sidenavFactory) {
  const vm = this;

  vm.$mdMedia = $mdMedia;

  vm.logout = logout;
  vm.openSidenav = openSidenav;


  function logout () {
    $cookies.remove('token');
    $location.path('/');
  }

  function openSidenav () {
    sidenavFactory.openLeftMenu();
  }

  $scope.$watch(() => toolbarFactory.getToolbarTitle(), () => {
    vm.toolbarTitle = toolbarFactory.getToolbarTitle();
  });
}