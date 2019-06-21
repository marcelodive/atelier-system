angular.module('App')
.component('login', {
    templateUrl: './component/login/login.html',
    controller: LoginController,
    controllerAs: 'ctrl'
});

function LoginController (authFactory, $cookies) {
    const vm = this;

    vm.login = login;

    async function login () {
        try {
            const credential = {email:vm.user.email, password:vm.user.password}
            const {data: token} = await authFactory.login(credential);
            $cookies.put('token', JSON.stringify(token));
        } catch (error) {
            $cookies.remove('token');
            console.log(error);
        }
    }
}