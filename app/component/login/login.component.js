angular.module('App')
.component('login', {
    templateUrl: './component/login/login.html',
    controller: LoginController,
    controllerAs: 'ctrl'
});

function LoginController (authFactory, $cookies) {
  const vm = this;
  vm.isLoggingIn = false;

  vm.login = login;

  function login () {
    vm.unauthorizedUser = false;
    vm.isLoggingIn = true;

    const credential = {email:vm.user.email, password:vm.user.password}

    authFactory.login(credential)
      .then(({data: token}) => {
        $cookies.put('token', JSON.stringify(token));
      }).catch((error) => {
        vm.unauthorizedUser = true;
        console.log(error);
      }).finally(() => {
        vm.isLoggingIn = false;
      });
  }
}