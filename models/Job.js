const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  wage: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    lat: Number,
    lng: Number,
  },
  applicants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        default: "pending",
      },
    },
  ],
});

module.exports = mongoose.model("Job", jobSchema);