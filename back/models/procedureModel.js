const mongoose = require("mongoose");
const { Schema, model } = mongoose;

let procedureSchema = new Schema({
    username: {
        type: String,
        ref: "User",
    },
    procedureTitle: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true,
    },
    procedureCategory: {
        type: String,
        minlength: 1,
        maxlength: 30,
        required: true,
    },
    procedureDate: {
        type: String,
        required: true,
    },
    procedureTime: {
        type: String,
        required: true,
    },
    procedureImage: {
        type: String,
        required: true,
    }
});

const Procedure = new model("Procedure", procedureSchema);

module.exports = { Procedure };
