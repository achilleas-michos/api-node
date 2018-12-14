'use strict';
import path from 'path';

const config = {
  // Root path of server
  root: path.join(__dirname, '../'),

  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||  process.env.PORT || 8080,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SESSION_SECRET || 'demo-secret'
  },

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGO_URL ||
    `mongodb://app-user:app-password}@localhost:27017/database`
  }
};

export { config };
