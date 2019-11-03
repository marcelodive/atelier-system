const sendmail = require('sendmail')();

module.exports = function(app) {
  // Install a "/ping" route that returns "pong"
  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  // sendConfirmationEmailToCliente();
};

function sendConfirmationEmailToCliente () {
  sendmail({
    from: 'marcelo.rodrigues@mailinator.com',
    to: 'atelieluizasales@yourdomain.com, marcelo.rodrigues@mailinator.com',
    replyTo: 'marcelo.rodrigues@mailinator.com',
    subject: 'MailComposer sendmail',
    html: 'Mail of test sendmail '
  }, function (err, reply) {
    console.log(err && err.stack)
    console.dir(reply)
  });
}
