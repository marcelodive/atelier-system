'use strict';

var server = require('./server');
var ds = server.dataSources.db;
var lbTables = [
  // 'User',
  // 'AccessToken',
  // 'ACL',
  // 'RoleMapping',
  // 'Role',
  // 'Notification',
  // 'Product',
  // 'Kit'
];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  var message = 'Loopback tables [' + lbTables + '] created in ';
  console.log(message, ds.adapter.name);
  ds.disconnect();
});
