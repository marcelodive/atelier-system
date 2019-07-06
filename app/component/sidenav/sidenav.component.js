angular.module('App')
.component('sidenav', {
  templateUrl: './component/sidenav/sidenav.html',
  controller: SidenavController,
  controllerAs: 'ctrl'
});

function SidenavController ($mdMedia, $scope, sidenavFactory) {
  const vm = this;

  vm.showTitle = true;
  vm.isLockedOpen = $mdMedia('gt-sm');

  vm.toggleLeftMenu = !$mdMedia('gt-sm')
    ? sidenavFactory.toggleLeftMenu
    : false;

  $scope.$watch(() => sidenavFactory.isSidenavLockedOpen(), () => {
    vm.showTitle = sidenavFactory.isSidenavLockedOpen();
    vm.isLockedOpen = $mdMedia('gt-sm');
  });

  $scope.$watch(() => $mdMedia('gt-sm'), () => {
    vm.isLockedOpen = $mdMedia('gt-sm');
    if ($mdMedia('gt-sm')) {
      sidenavFactory.forceOpenLeftMenu();
    } else {
      sidenavFactory.forceCloseLeftMenu();
    }
  });
}