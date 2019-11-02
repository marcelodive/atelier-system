angular.module('App')
  .component('login', {
    templateUrl: './component/login/login.html',
    controller: LoginController,
    controllerAs: 'ctrl',
  });

function LoginController(authFactory, logFactory, $cookies) {
  const vm = this;
  vm.isLoggingIn = false;
  vm.user = {};

  vm.login = login;

  function login() {
    vm.unauthorizedUser = false;
    vm.isLoggingIn = true;

    const email = vm.user.email || '';
    const password = vm.user.password || '';

    const credential = {email, password};

    authFactory.login(credential)
      .then(({data: token}) => {
        $cookies.put('token', JSON.stringify(token));
      }).catch((error) => {
        vm.unauthorizedUser = true;
        logFactory.log(error, 'error');
      }).finally(() => {
        vm.isLoggingIn = false;
      });
  }
}
