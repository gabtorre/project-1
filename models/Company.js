const mongoose = require("mongoose");

// set up schema
const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "You must provide a name."] },
    address: {type: String, required:[true, "You must provide a address."] },
    phoneNumber: {type: Number, required:[true, "You must provide a phone number."] },
    email: {type: String, required:[true, "You must provide a email."] },
    password: {type: String, required: true},
    image: {type: String, required:[true, "You must provide a email."] },
    role: String,
    bookings: [ { type: mongoose.Schema.Types.ObjectId, ref: "Booking" } ]
 },
  {
    timestamps: true, 

  }
);

// creates a model
const Company = mongoose.model("Company", companySchema);

module.exports = Company;