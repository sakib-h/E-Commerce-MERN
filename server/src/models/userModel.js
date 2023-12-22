const { Schema, model } = require("mongoose");

const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});
