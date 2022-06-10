import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

/////todo setup the user schwma
//HEAD: ---------------- USER SCHEMA ------------------ //
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  fullName: {
    firstName: { type: String },
    lastName: { type: String },
    middleName: { type: String },
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  address: {
    type: Array,
  },
  profileImg: {
    type: String,
    default: "../public/uploads/example",
  },
});

//*schema middlewares for hashing the user password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//*schema middleware populating the fullname fields of a newly registered user
UserSchema.pre("save", async function () {
  let i = 0;
  let username = this.fullname.firstName;
  console.log("🚀 ~ file: User.js ~ line 59 ~ username", username);

  for (const key in this.fullName) {
    this.fullName[key] =
      username.split(" ")[i] !== null ? username.split(" ")[i] : username;
    i++;
  }
});

//* schema methods for comparing the user hashed password with request password
UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
