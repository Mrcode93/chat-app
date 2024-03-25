import { useState, useEffect, useRef, useContext } from "react";
import { Grid, Paper, Typography, TextField, Button } from "@mui/material";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import { deepPurple } from "@mui/material/colors";
import { Context } from "../context/Context";
import { baseUrl } from "../utils/services";
import notification from "../assets/note.wav";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function Chats() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { user, allUsers, getUsers } = useContext(Context);
  const ws = useRef(null);

  // get recipient id from url
  const recipient_Id = useParams().userId;

  const currentUser = JSON.parse(sessionStorage.getItem("user")).userId;

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!currentUser) {
          throw new Error("currentUser is null");
        }

        if (!recipient_Id) {
          throw new Error("recipient_Id is null");
        }

        const response = await axios.get(
          `${baseUrl}/message/${currentUser}/${recipient_Id}`
        );

        if (response.status !== 200) {
          throw new Error(`Unexpected response status: ${response.status}`);
        }

        setChatMessages(response.data.conversation.messages);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
        setChatMessages([]);
      }
    };

    // Create a new Audio instance for the notification sound
    const notificationAudio = new Audio(notification);

    ws.current = new WebSocket(
      `wss://chat-app-speh.onrender.com/ws?userId=${currentUser}`
    );

    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log(newMessage);

      // Check if the message is for the specific user
      if (newMessage.recipientId === currentUser) {
        // Play the notification sound
        notificationAudio.play();
      }

      // Check if the message is already in the chatMessages to prevent duplicates
      if (!chatMessages.some((msg) => msg._id === newMessage._id)) {
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    fetchMessages();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [currentUser]); // Remove chatMessages from the dependency array
  /**
   * Look up the username of a user based on their ID
   * @param {string} userId The ID of the user to look up
   * @returns {string} The username of the user if found, "Unknown User" otherwise
   */
  const getUserNameById = (userId) => {
    // Find the user with the given ID in the allUsers array
    const foundUser = allUsers.find((user) => user._id === userId);
    // If the user is found, return their username, otherwise return "Unknown User"
    return foundUser ? foundUser.username : "Unknown User";
  };

  const handleSendMessage = async () => {
    if (!ws.current) {
      console.error("WebSocket connection is null, cannot send message");
      return;
    }

    const newMessage = {
      content: message,
      senderId: currentUser,
      recipientId: recipient_Id,
    };

    if (
      !newMessage.content ||
      !newMessage.senderId ||
      !newMessage.recipientId
    ) {
      console.error("Unexpected null value in newMessage:", newMessage);
      return;
    }

    try {
      ws.current.send(JSON.stringify(newMessage));
    } catch (error) {
      console.error("Error sending message via WebSocket:", error);
      return;
    }

    try {
      await axios.post(`${baseUrl}/message`, {
        ...newMessage,
      });
    } catch (error) {
      console.error("Error saving message to database:", error);
      return;
    }

    setChatMessages((prevMessages) => {
      if (!prevMessages) {
        console.error("Unexpected null value in prevMessages:", prevMessages);
        return prevMessages;
      }
      return [...prevMessages, newMessage];
    });

    setMessage(""); // Clear the input field after sending
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh", width: "100vw" }} // Ensure full screen coverage
    >
      <Grid item xs={12}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <Typography variant="h4" align="center">
              Welcome, {getUserNameById(currentUser)}
            </Typography>

            {/* back button */}
            <Button
              onClick={() => window.history.back()}
              variant="contained"
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                color: "#fff",
              }}
            >
              <ArrowBackIcon />
            </Button>

            <div style={{ marginBottom: "20px", display: "flex" }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt={getUserNameById(recipient_Id).toUpperCase()}
                  src="src"
                  sx={{ bgcolor: deepPurple[500] }}
                />
              </StyledBadge>

              <Typography
                align="left"
                style={{
                  marginLeft: "10px",
                  marginTop: "10px",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "20px",
                }}
              >
                {getUserNameById(recipient_Id).toUpperCase()}
              </Typography>
            </div>
          </div>

          <div
            style={{
              height: "calc(100vh - 320px)",
              overflowY: "auto",
              overflowX: "hidden",
              marginBottom: "20px",
              padding: "10px",
            }}
          >
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => (
                <div key={index}>
                  <Typography
                    variant="body1"
                    style={{
                      textAlign:
                        currentUser === msg.senderId ? "right" : "left",
                      padding: msg.senderId ? "10px" : "0px",
                      marginBottom: "10px",
                      borderRadius: "15px", // Adjust border radius for message bubble
                      backgroundColor:
                        currentUser === msg.senderId ? "#00BFFF" : "#f5f5f5",
                      color: currentUser === msg.senderId ? "#fff" : "#000", // Adjust text color based on sender
                      maxWidth: "95%", // Limit message width to prevent overflow
                      alignSelf:
                        currentUser === msg.senderId
                          ? "flex-end"
                          : "flex-start", // Adjust message alignment
                      // display: "flex",
                      width: "100%",
                    }}
                  >
                    {msg.content}
                  </Typography>
                  <span
                    className="timestamp"
                    style={{
                      marginLeft: "10px",
                      fontSize: "10px",
                      color: "gray",
                      alignSelf:
                        currentUser === msg.senderId
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleString()
                      : ""}
                  </span>
                </div>
              ))
            ) : (
              <p>No messages yet</p>
            )}
          </div>

          <TextField
            label="Type your message"
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSubmit={handleSendMessage}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "10px", width: "100%" }} // Expand button to full width
            onClick={handleSendMessage}
            disabled={!message}
            type="submit"
          >
            Send
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}
