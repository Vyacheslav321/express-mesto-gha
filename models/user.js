const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    // default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    // default: "Исследователь",
  },
  avatar: {
    type: String,
    required: true,
    // default:
    //   "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
});
userSchema.set("versionKey", false);

module.exports = mongoose.model("user", userSchema);
