angular.module('App')
.component('sidenavLink', {
  templateUrl: './component/sidenav-link/sidenav-link.html',
  controller: SidenavLinkController,
  controllerAs: 'ctrl',
  bindings: {
    icon: '@',
    title: '@',
    goesTo: '@'
  }
});

function SidenavLinkController () {
  const vm = this;
}