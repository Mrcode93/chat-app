const Message = require("../models/message");
const Conversation = require("../models/conversation");

module.exports = {
  // Get all conversations
  async getConversation(req, res) {
    const { userId, recipientId } = req.params;

    try {
      // Find conversation between userId and recipientId
      const conversation = await Conversation.findOne({
        participants: { $all: [userId, recipientId] },
      }).populate("messages", "content senderId recipientId");

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      res.status(200).json({ conversation });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Create a new message
  async createMessage(req, res) {
    const { content, senderId, recipientId } = req.body;

    try {
      let conversationId;

      // Check if a conversation already exists between sender and recipient
      const existingConversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      });

      if (existingConversation) {
        // Use the existing conversation ID
        conversationId = existingConversation._id;

        // Add the message to the existing conversation
        existingConversation.messages.push({ content, senderId, recipientId });
        await existingConversation.save();
      } else {
        // Create a new conversation
        const newConversation = new Conversation({
          participants: [senderId, recipientId],
          messages: [{ content, senderId, recipientId }],
        });
        const savedConversation = await newConversation.save();
        conversationId = savedConversation._id;
      }

      res.status(201).json({ message: "Message created successfully" });
    } catch (err) {
      console.error("Error creating message:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async deleteMessage(req, res) {
    try {
      const deletedMessage = await Message.findByIdAndDelete(req.params.id);
      if (!deletedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message: "Message deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

// Helper function to create a conversation if it doesn't exist
async function createConversationIfNotExists(senderId, recipientId) {
  try {
    const existingConversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!existingConversation) {
      const conversation = new Conversation({
        participants: [senderId, recipientId],
      });

      await conversation.save();
    }
  } catch (err) {
    console.error("Error creating conversation:", err.message);
  }
}
