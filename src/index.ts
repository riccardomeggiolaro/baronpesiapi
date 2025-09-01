import "reflect-metadata"; // Import reflect-metadata for enabling class decorators and metadata reflection
import dotenv from "dotenv"; // Import dotenv module for loading environment variables
dotenv.config(); // Load environment variables from the .env file
import { PORT } from "./global"; // Import the PORT constant from the global configuration file
import { app } from "./app"; // Import the Express app instance
import { AppDataSource } from "./app"; // Import the AppDataSource instance for database connection
import "./utils/auth/auth.handlers"; // Import authentication handlers from the auth.handlers module

// Initialize the TypeORM connection to the MySQL database
AppDataSource.initialize()
  .then(() => {
    console.log("MySQL connected"); // Log a message indicating successful database connection

    // Start the Express app on the specified port
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`); // Log a message indicating the app is listening
    });
  })
  .catch((error) => console.log(error)); // Handle any errors that occur during database initialization or server startup
