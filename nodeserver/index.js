//const ip = '192.168.10.37'; // replace with your desired IP address
const port = 3002; // replace with your desired port number


//const http = require('http').createServer();
const https = require('https');
const fs = require('fs');

const sql = require ("mssql/msnodesqlv8");

const options = {
  pfx: fs.readFileSync('certificate.pfx'),
  passphrase: 'password',
  rejectUnauthorized: false,
  hostname: 'backend.smartmetersystem.home'
};
const server = https.createServer(options);

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST']
  },
  secure: true,
  rejectUnauthorized: false
});

const sqlConfig = {
  user: "sa",
  password: "p@$$w0rd",
  server: "WIN-JM1U4G08T87",
  port: 1433,
  driver: 'msnodesqlv8',
  database: "ePRMS",
  options: {
    enableArithAbort: true,
    trustedConnection: false
  },
  connectionTimeout: 150000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

//socket io
io.on('connection', (socket) => {
  //console.log('a user connected');

  socket.on('userData', (data) => {
    console.log(`${data.message} has connected`); // logs 'Hello server!'
  });

  socket.on('updateApprovePR', (data) => {
    io.emit('updateApprovePR', data);
  });

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('notifications', message => {
    io.emit('notifications', message);
    // const pool = new sql.ConnectionPool(sqlConfig);
    // pool.connect(err => {
    //   if (err) {
    //       console.error(err);
    //       return;
    //   }

    //   // Create a new request object
    //   const request = new sql.Request(pool);

    //   // Execute the query
    //   request.query(message, (err, result) => {
    //       if (err) {
    //           console.error(err);
    //           return;
    //       }
    //       // Send the result to the client
    //       io.emit('notifications', JSON.stringify(result.recordset));

    //       // Close the connection pool
    //       pool.close();
    //   });
    // });

  });

  socket.on('broadcastWeatherInformation', message => {
    const pool = new sql.ConnectionPool(sqlConfig);

    pool.connect(err => {
      if (err) {
          console.error(err);
          return;
      }

      // Create a new request object
      const request = new sql.Request(pool);

      // Execute the query
      request.query(message, (err, result) => {
          if (err) {
              console.error(err);
              return;
          }
          // Send the result to the client
          io.emit('broadcastWeatherInformation', JSON.stringify(result.recordset));

          // Close the connection pool
          pool.close();
      });
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

});

server.listen(port, () => console.log(`listening on:${port}`) );
