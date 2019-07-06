angular.module('App')
.factory('sidenavFactory', ($mdSidenav, $rootScope, $mdMedia) => {
  const componentId = 'left-sidenav';

  $rootScope.isSidenavLockedOpen = $mdMedia('gt-sm');

  function toggleLeftMenu () {
    if ($mdMedia('gt-sm')) {
      $rootScope.isSidenavLockedOpen = !$rootScope.isSidenavLockedOpen;
    } else {
      $rootScope.isSidenavLockedOpen = true;
      $mdSidenav(componentId).toggle();
    }
  }

  function forceOpenLeftMenu () {
    $rootScope.isSidenavLockedOpen = true;
  }

  function forceCloseLeftMenu () {
    $rootScope.isSidenavLockedOpen = false;
  }

  function isSidenavLockedOpen () {
    return $rootScope.isSidenavLockedOpen;
  }

  return {
    toggleLeftMenu: toggleLeftMenu,
    isSidenavLockedOpen: isSidenavLockedOpen,
    forceOpenLeftMenu: forceOpenLeftMenu,
    forceCloseLeftMenu: forceCloseLeftMenu
  }
});