angular.module('App')
.component('sidenav', {
  templateUrl: './component/sidenav/sidenav.html',
  controller: SidenavController,
  controllerAs: 'ctrl'
});

function SidenavController ($scope, $mdSidenav, $mdMedia) {
  const vm = this;

  vm.openLeftMenu = openLeftMenu;

  function openLeftMenu () {
    $mdSidenav('left-sidenav').toggle();
  };

  $scope.$watch(() => $mdMedia('gt-sm'), () => {
    vm.isDesktop = $mdMedia('gt-sm');
  })
}