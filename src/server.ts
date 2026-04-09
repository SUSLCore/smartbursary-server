import dotenv from "dotenv";
import app from "./app";
import sequelize from "./config/database";
import "./models";
import adminSeeder from "./seeders/adminSeeder";
import facultySeeder from "./seeders/facultySeeder";
import departmentSeeder from "./seeders/departmentSeeder";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true });
    console.log("Models synced");

    await facultySeeder();
    await departmentSeeder();
    await adminSeeder();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
  }
};

startServer();