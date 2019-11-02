
const server = require('./server');

const ds = server.dataSources.db;
const lbTables = [
  // 'User',
  // 'AccessToken',
  // 'ACL',
  // 'RoleMapping',
  // 'Role',
  // 'Notification',
  // 'Product',
  // 'Kit',
  // 'Installment',
  // 'OrderProduct',
  // 'Child',
  // 'Order'
];
ds.automigrate(lbTables, (er) => {
  if (er) throw er;
  const message = `Loopback tables [${lbTables}] created in `;
  console.log(message, ds.adapter.name);
  ds.disconnect();
});
