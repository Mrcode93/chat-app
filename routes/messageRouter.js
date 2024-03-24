// messageRouter.js

const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messagesController");

// get conversations from database
router.get("/:userId/:recipientId", messageController.getConversation);

// create new messages
router.post("/", messageController.createMessage);

// delete conversation
router.delete("/:id", messageController.deleteMessage);

// create new conversations
// router.post("/conversation", messageController.);
module.exports = router;
