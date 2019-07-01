angular.module('App')
.component('sidenav', {
  templateUrl: './component/sidenav/sidenav.html',
  controller: SidenavController,
  controllerAs: 'ctrl'
});

function SidenavController ($mdSidenav) {
  const vm = this;

  vm.openLeftMenu = openLeftMenu;
  vm.closeLeftMenu - closeLeftMenu;

  function openLeftMenu () {
    $mdSidenav('left-sidenav').toggle();
  };

  function closeLeftMenu () {
    $mdSidenav('left-sidenav').close();
  }
}