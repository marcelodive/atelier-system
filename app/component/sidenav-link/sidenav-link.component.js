angular.module('App')
.component('sidenavLink', {
  templateUrl: './component/sidenav-link/sidenav-link.html',
  controller: SidenavLinkController,
  controllerAs: 'ctrl',
  bindings: {
    icon: '@',
    title: '@',
    goesTo: '@',
    showTitle: '<'
  }
});

function SidenavLinkController () {
  const vm = this;
}