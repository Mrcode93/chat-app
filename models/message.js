// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   content: {
//     type: String,
//     required: true,
//   },
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Reference to the Users collection
//     required: true,
//   },
//   recipientId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // Reference to the Users collection
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Message = mongoose.model("Message", messageSchema);

// module.exports = Message;

// message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the Users collection
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the Users collection
    required: true,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation", // Reference to the Conversation collection
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
