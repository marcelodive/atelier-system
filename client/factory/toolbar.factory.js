angular.module('App')
  .factory('toolbarFactory', ($rootScope) => {
    function getToolbarTitle() {
      return $rootScope.toolbarTitle;
    }

    function setToolbarTitle(title) {
      $rootScope.toolbarTitle = title;
    }

    return {
      getToolbarTitle,
      setToolbarTitle,
    };
  });
