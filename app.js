const express = require("express");
const app = express();

const sequelize = require("./models/db-connection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const tableRoutes = require("./routes/tableRoute");
const Table = require("./models/table");
app.use("/tables", tableRoutes);

sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connected successfully");

    await Table.sync();

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Unable to connect to database:", err);
  });
