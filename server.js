const app = require('./app');
const mongoose = require('mongoose');
const fs = require('fs');

// handle all uncaught exceptions errors
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION ! , Shutting down ...');
  console.log(err.name, err.message);
});

const port = process.env.PORT || 3005;
if (process.env.NODE_ENV === 'production') {
  // connection database
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log('database has succesfully connected');
      const privateKey = fs.readFileSync(
        '/etc/pki/tls/private/srv2.ersaksa.com.key',
        'utf8'
      );
      const certificate = fs.readFileSync(
        '/etc/pki/tls/certs/srv2.ersaksa.com.cert',
        'utf8'
      );
      const credentials = { key: privateKey, cert: certificate };
      const port = process.env.PORT || 3005;
      const server = require('https').createServer(credentials, app);
      server.listen(port, () => {
        console.log(`you are connected to secure API ${port}`);
      });
    })
    .catch((e) => {
      console.log(e);
    });
} else {
  const connect = async () => {
    await mongoose
      .connect(process.env.MONGO_URL)
      .then((con) => {
        console.log('monogoDb is connected ' + con.connection.host);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  connect();

  app.listen(port, () => {
    console.log(`server is running at port ${port}`);
  });
}

// handle all unhandled rejection errors and console it
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION ! , Shutting down ...');
  console.log(err.name, err.message);
});

module.exports = app;
