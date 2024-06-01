const express = require('express');
const bodyParser = require('body-parser');
const cluster = require('cluster');
const os = require('os');
const imageRoutes = require('./routes/image');
const sequelize = require('./models/request').sequelize;

const app = express();

app.use(bodyParser.json());

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL'))
  .catch(err => console.log(err));

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Worker processes serve the app
  app.use('/api/image', imageRoutes);

  app.get('/', (req, res) => {
    res.send('Welcome to the Image Processing API!');
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
  });
}
