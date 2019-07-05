angular.module('App')
.factory('sidenavFactory', ($mdSidenav) => {

  function openLeftMenu () {
    $mdSidenav('left-sidenav').toggle();
  };

  return {
    openLeftMenu: openLeftMenu
  }
});