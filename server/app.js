import express from 'express';
import {config} from "./config/configuration";

const app = express();

const server = require('http').Server(app);

require('./config/express')(app);
require('./routes')(app);

server.listen(config.port, config.ip, () => {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

export { app };
