angular.module('App')
.factory('logFactory', ($http, $log) => {

  function log (message, method = 'log') {
    if (method === 'log') {
      $log.log(message);
    } else if (method === 'info') {
      $log.info(message);
    } else if (method === 'warn') {
      $log.warn(message);
    } else if (method === 'error') {
      $log.error(message);
    } else if (method === 'debug') {
      $log.debug(message);
    }
  }

  return {
    log: log
  }
});