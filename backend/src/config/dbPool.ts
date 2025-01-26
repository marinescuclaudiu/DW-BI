import oracledb from 'oracledb';
import { dbConfig, dbConfigOLTP, dbConfigDW } from './dbConfig';

// Define and create the connection pool
export const pool: Promise<oracledb.Pool> = oracledb.createPool({
  user: dbConfig.user,
  password: dbConfig.password,
  connectString: dbConfig.connectString,
  poolMin: dbConfig.poolMin,
  poolMax: dbConfig.poolMax,
  poolIncrement: dbConfig.poolIncrement
});

// Define and create the OLTP connection pool
export const poolOLTP: Promise<oracledb.Pool> = oracledb.createPool({
  user: dbConfigOLTP.user,
  password: dbConfigOLTP.password,
  connectString: dbConfigOLTP.connectString,
  poolMin: dbConfigOLTP.poolMin,
  poolMax: dbConfigOLTP.poolMax,
  poolIncrement: dbConfigOLTP.poolIncrement
});

// Define and create the DW connection pool
export const poolDW: Promise<oracledb.Pool> = oracledb.createPool({
  user: dbConfigDW.user,
  password: dbConfigDW.password,
  connectString: dbConfigDW.connectString,
  poolMin: dbConfigDW.poolMin,
  poolMax: dbConfigDW.poolMax,
  poolIncrement: dbConfigDW.poolIncrement
});