
const express = require("express");
const router = express.Router();

const tableController = require("../controllers/tableController");

router.post("/create-table", tableController.createTable);

router.get("/get-tables", tableController.getTables);

router.get("/get-records/:tableName", tableController.getRecords);

router.post("/add-record/:tableName", tableController.addRecord);

router.delete("/delete-record/:tableName/:id", tableController.deleteRecord);

module.exports = router;
