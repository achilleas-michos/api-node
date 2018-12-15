import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';

module.exports = (app) => {
  const env = app.get('env');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '25mb' }));

  if (env === 'production') {
    app.use((req, res, next) => {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type, Authorization, Cache-control, Pragma');
      // Pass to next layer of middleware
      next();
    });
    app.use(morgan('combined'));
    app.use(helmet());
  }

  if (env === 'development' || env === 'test') {
    // Add headers for CORS
    app.use((req, res, next) => {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type, Authorization, Cache-control, Pragma');
      // Pass to next layer of middleware
      next();
    });
    app.use(morgan('dev'));
  }
};
