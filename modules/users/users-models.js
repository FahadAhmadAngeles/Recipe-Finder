const mongoose = require("mongoose");

//SCHEMA AND MODELS 

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  dateAccountCreated: { type: String, default: "Unknown"},
  name: { type: String, required: true },
  password: { type: String, required: true, minlength: 5 },
});

const userModel = mongoose.model("User", userSchema);

//CRUD OPERATIONS

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
  const user = await userModel.findByIdAndUpdate(userId, updatedUser, {new: true});
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
