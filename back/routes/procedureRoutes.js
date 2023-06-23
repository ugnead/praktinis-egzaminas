const express = require("express");
const router = express.Router();

const { getAllProcedures, getProceduresByUsername, getProcedureById, createNewProcedure, updateProcedure, deleteProcedure  } = require("../controllers/procedureController");

router.route("/").get(getAllProcedures);
router.route("/user/:username").get(getProceduresByUsername);
router.route("/:id/user/:username").get(getProcedureById);
router.route("/user/:username").post(createNewProcedure);
router.route("/:id/").patch(updateProcedure);
router.route("/:id/").delete(deleteProcedure);


module.exports = router;