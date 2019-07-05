angular.module('App')

// Date configuration format (DD-MM-YYYY): https://stackoverflow.com/questions/33475874/md-datepicker-input-format?rq=1
.config(function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
      return date ? moment.utc(date).format('DD/MM/YYYY') : '';
  };
  $mdDateLocaleProvider.parseDate = function(dateString) {
      let m = moment.utc(dateString, 'DD/MM/YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
  };
})

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('pink')
    .accentPalette('brown');
})

.config(function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
});