const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    type: {
        type: String,
        enum: [
            "PASS_VERIFIED",
            "ORDER_REJECTED"
        ],
        required: true
    },

    payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },

    status: {
        type: String,
        enum: [
            "PENDING",
            "PROCESSING",
            "COMPLETED",
            "FAILED"
        ],
        default: "PENDING",
        index: true,
    },

    attempts: {
        type: Number,
        default: 0
    },

    lastError: String,

    processedAt: Date

},{
    timestamps:true
});

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);