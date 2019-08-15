'use strict';

module.exports = function(app) {
  // createModel('Client');
  // createModel('Child');

  function createModel(modelName) {
    app.dataSources.db.automigrate(modelName, (err) => {
      if (err) throw err;
      else console.log(`${modelName} created`);
    });
  }
};
