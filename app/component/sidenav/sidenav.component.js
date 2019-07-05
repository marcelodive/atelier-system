angular.module('App')
.component('sidenav', {
  templateUrl: './component/sidenav/sidenav.html',
  controller: SidenavController,
  controllerAs: 'ctrl'
});

function SidenavController () {
  const vm = this;
}