import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    morningMotivation: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// presave hook
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// userSchema.pre("save", async function (next) {  -> do not use next here
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next(); --> this causes errors
// });

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// the below is to make sure, the password hash is never sent to the client by accident
// Strips the password automatically whenever a User document is converted to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
