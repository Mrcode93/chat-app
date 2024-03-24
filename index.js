const express = require("express");
const expressWs = require("express-ws");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const URL = process.env.MONGO_URI;

const app = express();
const { app: wsApp } = expressWs(app);
const connectedClients = new Map();

// WebSocket connection handling
wsApp.ws("/ws", (ws, req) => {
  const userId = req.query.userId;

  connectedClients.set(userId, ws);

  // Function to send online users to connected clients
  const sendOnlineUsers = () => {
    const onlineUsers = Array.from(connectedClients.keys());
    onlineUsers.forEach((user) => {
      const recipientWs = connectedClients.get(user);
      if (recipientWs) {
        recipientWs.send(
          JSON.stringify({ type: "onlineUsers", data: onlineUsers })
        );
      }
    });
  };

  sendOnlineUsers(); // Send initial list of online users

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const recipientId = data.recipientId;

      // Check if the recipient has an active WebSocket connection
      const recipientWs = connectedClients.get(recipientId);

      if (recipientWs) {
        // If recipient is connected, send the message to them
        recipientWs.send(message);
      } else {
        ws.send(
          JSON.stringify({
            error: `Recipient ${recipientId} is not connected`,
          })
        );
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      // Handle parsing errors appropriately
    }
  });

  ws.on("close", () => {
    connectedClients.delete(userId);
    sendOnlineUsers(); // Update online user list after disconnect
  });
});

// wsApp.ws("/ws", (ws, req) => {
//   const userId = req.query.userId;

//   connectedClients.set(userId, ws);

//   // Function to send online users to connected clients

//   const sendOnlineUsers = () => {
//     const onlineUsers = Array.from(connectedClients.keys());
//     onlineUsers.forEach((user) => {
//       const recipientWs = connectedClients.get(user);
//       if (recipientWs) {
//         recipientWs.send(JSON.stringify({ onlineUsers }));
//       }
//     });
//     ws.send(JSON.stringify({ type: "onlineUsers", data: onlineUsers }));
//   };

//   sendOnlineUsers(); // Send initial list of online users

//   ws.on("message", (message) => {
//     try {
//       const data = JSON.parse(message);
//       const recipientId = data.recipientId;

//       // Check if the recipient has an active WebSocket connection
//       const recipientWs = connectedClients.get(recipientId);

//       if (recipientWs) {
//         // If recipient is connected, send the message to them
//         recipientWs.send(message);
//       } else {
//         ws.send(
//           JSON.stringify({
//             error: `Recipient ${recipientId} is not connected`,
//           })
//         );
//       }
//     } catch (error) {
//       console.error("Error parsing message:", error);
//       // Handle parsing errors appropriately
//     }
//   });

//   ws.on("close", () => {
//     connectedClients.delete(userId);
//     sendOnlineUsers(); // Update online user list after disconnect
//   });
// });

// WebSocket connection handling
// wsApp.ws("/ws", (ws, req) => {
//   const userId = req.query.userId;

//   connectedClients.set(userId, ws);

//   console.log(`User ${userId} connected`);

//   // send to users who are online
//   const onlineUsers = Array.from(connectedClients.keys());
//   onlineUsers.forEach((user) => {
//     // console.log(`${onlineUsers}`);
//     const recipientWs = connectedClients.get(user);
//     recipientWs.send(JSON.stringify({ onlineUsers }));
//     ws.send(JSON.stringify({ type: "onlineUsers", data: onlineUsers }));
//   });

//   // Function to send online users to connected clients

//   ws.on("message", (message) => {
//     // Parse the incoming message
//     const data = JSON.parse(message);
//     const recipientId = data.recipientId;

//     // Check if the recipient has an active WebSocket connection
//     const recipientWs = connectedClients.get(recipientId);

//     if (recipientWs) {
//       // If recipient is connected, send the message to them
//       recipientWs.send(message);
//     } else {
//       ws.send(
//         JSON.stringify({
//           error: `Recipient ${recipientId} is not connected`,
//         })
//       );
//     }
//   });

//   ws.on("close", () => {
//     connectedClients.delete(userId);
//     // console.log(`User ${userId} disconnected`);
//   });
// });

mongoose
  .connect(URL)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", require("./routes/useRoutes"));
app.use("/message", require("./routes/messageRouter"));

app.use((req, res, next) => {
  req.connectedClients = connectedClients;
  next();
});
