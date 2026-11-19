
const Sequelize = require("sequelize");
const sequelize = require("../models/db-connection");
const Table = require("../models/table");

exports.createTable = async (req, res) => {
    try {
        const tableName = req.body.tableName;
        const columns = req.body.columns;

        const queryInterface = sequelize.getQueryInterface();

        const fields = {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
        };

        columns.forEach((column) => {
            fields[column.name] = {
                type: Sequelize[column.type],
            };
        });

        await queryInterface.createTable(tableName, fields);

        await Table.create({
            tableName: tableName,
            columns: columns,
        });

        res.status(201).json({
            message: "Table created successfully",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Unable to create table",
        });
    }
};


exports.getTables = async (req, res) => {
    try {
        const tables = await Table.findAll();

        res.status(200).json(tables);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Unable to fetch tables",
        });
    }
};


exports.getRecords = async (req, res) => {
    try {
        const tableName = req.params.tableName;

        const queryInterface = sequelize.getQueryInterface();

        const records = await queryInterface.select(null, tableName, {});

        res.status(200).json(records);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Unable to fetch records",
        });
    }
};


exports.addRecord = async (req, res) => {
    try {
        const tableName = req.params.tableName;
        const record = req.body;

        await sequelize.getQueryInterface().bulkInsert(
            tableName,
            [record],
            {}
        );

        res.status(201).json({
            message: "Record added successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Unable to add record",
        });
    }
};


exports.deleteRecord = async (req, res) => {
    try {
        const tableName = req.params.tableName;
        const id = req.params.id;

        await sequelize.getQueryInterface().bulkDelete(
            tableName,
            {
                id: id
            },
            {}
        );

        res.status(200).json({
            message: "Record deleted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Unable to delete record",
        });
    }
};
