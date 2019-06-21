angular.module('App')
.component('container', {
    templateUrl: './component/container/container.html',
    controller: containerController,
    controllerAs: 'ctrl'
});

function containerController ($cookies, $scope) {
    const vm = this;
    vm.isAuthenticated = false;

    $cookies.remove('token')

    $scope.$watch(() => $cookies.get('token'), () => {
        const token = $cookies.get('token');
        vm.isAuthenticated = (token != null);
    });
}