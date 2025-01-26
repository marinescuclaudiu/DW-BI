import dotenv from "dotenv";

dotenv.config();

// Define the connection pool interface for better type safety
export interface DbConfig {
  user: string;
  password: string;
  connectString: string;
  poolMin: number;
  poolMax: number;
  poolIncrement: number;
}

export const dbConfigOLTP: DbConfig = {
  user: process.env.DB_USER_OLTP || "", // Defaults to an empty string if not defined
  password: process.env.DB_PASSWORD_OLTP || "",
  connectString: process.env.DB_CONNECT_STRING || "",
  poolMin: 1, // Minimum pool size
  poolMax: 5, // Maximum pool size
  poolIncrement: 1, // Increment in the pool size
};

export const dbConfigDW: DbConfig = {
  user: process.env.DB_USER_DW || "", // Defaults to an empty string if not defined
  password: process.env.DB_PASSWORD_DW || "",
  connectString: process.env.DB_CONNECT_STRING || "",
  poolMin: 1, // Minimum pool size
  poolMax: 5, // Maximum pool size
  poolIncrement: 1, // Increment in the pool size
};
