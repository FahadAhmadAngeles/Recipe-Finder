const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; // Number of hashing rounds for bcrypt

// SCHEMA AND MODEL
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, minlength: 6, maxlength: 20 },
  password: { type: String, required: true, minlength: 5 },
  role: { type: String, enum: ["user", "admin"], default: "user" }, 
  savedList: { type: [mongoose.Schema.Types.ObjectId], default: [] }
});

// Password hashing
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const hash = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

// CRUD OPERATIONS

async function getAllUsers() {
  return await userModel.find();
}

async function getUserById(userId) {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
}

async function addUser(newUser) {
  const user = new userModel(newUser);
  await user.save();
  return user;
}

async function updateUser(userId, updatedUser) {
  const user = await userModel.findByIdAndUpdate(userId, updatedUser, { new: true });
  if (!user) throw new Error("User not found");
  return user;
}

async function deleteUser(userId) {
  const deleted = await userModel.findByIdAndDelete(userId);
  if (!deleted) throw new Error("User not found");
  return deleted;
}

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  userModel
};
