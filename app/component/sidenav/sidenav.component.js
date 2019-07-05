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

  $scope.$watch(() => sidenavFactory.isSidenavLockedOpen(), () => {
    vm.showTitle = sidenavFactory.isSidenavLockedOpen();
  });
}