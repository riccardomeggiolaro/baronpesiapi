// Define constants for user roles
export const classicAdmin = 2; // Constant representing the classic admin role
export const superAdmin = 3; // Constant representing the super admin role

// Define environment variables for server configuration
export const PORT = process.env.PORT; // Port on which the server will listen
export const ORIGIN = process.env.ORIGIN; // Origin for cross-origin resource sharing (CORS)
export const HOST = process.env.HOST; // Hostname of the server

// Parse database connection configuration from environment variables
export const PORT_DB = parseInt(process.env.PORT_DB!); // Database port
export const USERNAME = process.env.USERNAME; // Database username
export const PASSWORD = process.env.PASSWORD; // Database password
export const DATABASE = process.env.DATABASE; // Database name