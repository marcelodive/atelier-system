angular.module('App')
.factory('sidenavFactory', ($mdSidenav, $rootScope, $mdMedia) => {
  const componentId = 'left-sidenav';
  $rootScope.isSidenavLockedOpen = $mdMedia('gt-sm');

  function toggleLeftMenu () {
    $mdSidenav(componentId).toggle();
    $rootScope.isSidenavLockedOpen = !$rootScope.isSidenavLockedOpen;
  }

  function isSidenavLockedOpen () {
    return $rootScope.isSidenavLockedOpen;
  }

  return {
    toggleLeftMenu: toggleLeftMenu,
    isSidenavLockedOpen: isSidenavLockedOpen
  }
});