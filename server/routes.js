import { datagridRouter } from './api/datagrid';

module.exports = function exports(app) {
  app.use('/api/', datagridRouter);
};
