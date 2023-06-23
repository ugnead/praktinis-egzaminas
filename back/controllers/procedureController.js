const { Procedure } = require("../models/procedureModel");

exports.getAllProcedures = async (req, res) => {
    try {
        const allProcedures  = await Procedure.find();
        res.status(200).json({
            status: "success",
            results: allProcedures.length,
            data: {
                procedures: allProcedures,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.getProceduresByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const procedures  = await Procedure.find({ username});
        res.status(200).json({
            status: "success",
            results: procedures.length,
            data: {
                procedures,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

// GET PROCEDURE BY ID
// http://localhost:4000/api/v1/procedures/id
exports.getProcedureById = async (req, res) => {
    try {
        const { id } = req.params;
        const procedure = await Procedure.findOne({ _id: id });
        
        if (!procedure) {
            return res.status(404).json({ msg: `No procedure with id: ${id}` });
        } else {
            res.status(200).json({
                status: "success",
                data: {
                    procedure: procedure,
                },
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

// CREATE PROCEDURE
// http://localhost:4000/api/v1/procedures
// app.post("/api/v1/procedures",
exports.createNewProcedure = async (req, res) => {
    try {
        const {username} = req.body;
        const procedureData = { ...req.body, username };
        const newProcedure = await Procedure.create(procedureData);
        res.status(201).json({
            status: "success",
            data: {
                procedure: newProcedure,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

// UPDATE PROCEDURE
// http://localhost:4000/api/v1/procedures/id
// app.patch("/api/v1/procedures/:id",
exports.updateProcedure = async (req, res) => {
    try {
        const upatedProcedure = await Procedure.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json({
            status: "success",
            data: {
                procedure: upatedProcedure,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message,
        });
    }
};

// DELETE PROCEDURE
// http://localhost:4000/api/v1/procedures/id
// app.delete("/api/v1/procedures/:id",
exports.deleteProcedure = async (req, res) => {
    try {
        const { id } = req.params;
        const procedure = await Procedure.findByIdAndDelete(id);

        if (!procedure) {
            return res.status(404).json({ msg: `No procedure with id: ${id}` });
        } else {
            res.status(200).json({
                status: "success",
                message: `Procedure with id: ${id} deleted successfully.`,
                procedure: procedure,
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
