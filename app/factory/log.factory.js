angular.module('App')
.factory('logFactory', ($log, toaster) => {

  // types: success, error, wait, warning, note
  function showToaster (title, text = '', type = 'info') {
    toaster.pop(type, title, text);
    log(`${title} | ${text}`, type);
  }

  function log (message, method = 'log') {
    if (method === 'log') {
      $log.log(message);
    } else if (method === 'info') {
      $log.info(message);
    } else if (method === 'warn' || method === 'warning') {
      $log.warn(message);
    } else if (method === 'error') {
      $log.error(message);
    } else if (method === 'debug') {
      $log.debug(message);
    } else {
      $log.log(message);
    }
  }

  return {
    log: log,
    showToaster: showToaster
  }
});