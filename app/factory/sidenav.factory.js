angular.module('App')
.factory('sidenavFactory', ($mdSidenav, $rootScope, $mdMedia, $cookies) => {
  const componentId = 'left-sidenav';

  $rootScope.isSidenavLockedOpen = $mdMedia('gt-sm');

  function toggleLeftMenu (forceClose = false) {
    if ($mdMedia('gt-sm')) {
      $rootScope.isSidenavLockedOpen = !$rootScope.isSidenavLockedOpen;
    } else {
      $rootScope.isSidenavLockedOpen = !(true && forceClose);
      $mdSidenav(componentId).toggle();
    }
    $cookies.put('isSidenavOpen', $rootScope.isSidenavLockedOpen);
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