import { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import axios from "axios";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import { Context } from "../context/Context";
// import "./MainPage.css"; // Import CSS file for styling
import { baseUrl } from "../utils/services";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 0.5px ${theme.palette.background.paper}`,
  },
}));

const MainPage = () => {
  const [user, setCurrentUser] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const ws = useRef(null);
  const { logOutUser, getUsers, allUsers, setUser } = useContext(Context);

  useEffect(() => {
    // Check token validity and fetch users
    // const checkTokenAndFetchUsers = async () => {
    //   try {
    //     const token = document.cookie;
    //     const response = await axios.get(
    //       "https://chat-app-speh.onrender.com/auth/token",
    //       {
    //         headers: { Authorization: `Bearer ${token}` },
    //         withCredentials: true,
    //       }
    //     );
    //     if (response.status === 200) {
    //       getUsers();
    //       localStorage.setItem("auth", true);
    //       setCurrentUser(response.data);
    //       setUser(response.data);
    //       setFriends(response.data.friends);
    //     } else {
    //       window.location.href = "/login";
    //       localStorage.removeItem("auth");
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     localStorage.removeItem("auth");
    //     window.location.href = "/login";
    //   }
    // };
    // checkTokenAndFetchUsers();
    // console.log(sessionStorage.getItem("user"));
    setCurrentUser(JSON.parse(sessionStorage.getItem("user")));
    console.log("user", user);

    if (!user) {
      return;
    }

    // WebSocket setup
    ws.current = new WebSocket(
      `wss://chat-app-speh.onrender.com/ws?userId=${user.userId}`
    );

    ws.current.onmessage = handleWebSocketMessage;
    ws.current.onopen = () => {
      // Request the list of online users when WebSocket connection is established
      ws.current.send(JSON.stringify({ type: "onlineUsers" }));
      console.log("WebSocket connection established");
    };

    // WebSocket cleanup
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [user.userId]); // Dependency array should only contain user.userId

  const handleWebSocketMessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "onlineUsers") {
      if (Array.isArray(message.data)) {
        setOnlineUsers(message.data);
        console.log("Received online users:", message.data);
      } else {
        console.error("Received data is not an array:", message.data);
      }
    }
  };

  const followHandler = (otherUserId) => {
    axios
      .post(`${baseUrl}/auth/follow/${otherUserId}/${user.userId}`)
      .then(() => setFriends((prevFriends) => [...prevFriends, otherUserId]))
      .catch((error) => console.log(error));
  };

  const unfollowHandler = (userId) => {
    axios
      .post(`${baseUrl}/auth/unfollow/${userId}/${user.userId}`)
      .then(() =>
        setFriends((prevFriends) => prevFriends.filter((id) => id !== userId))
      )
      .catch((error) => console.log(error));
  };

  return (
    <div className="main-page">
      <div
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          height: "50px",
          backgroundColor: "#028090",
        }}
      >
        <Link to={`/profile/${user.userId}`}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant=""
          >
            <Avatar
              sx={{ bgcolor: "#1F271B" }}
              alt={user && user.username}
              // src={user.avatar}
            />{" "}
          </StyledBadge>{" "}
        </Link>{" "}
        {/* {user && <h3 style={{ color: "#F3FCF0" }}> {user.username} </h3>}{" "} */}{" "}
        <h1 style={{ color: "#F3FCF0" }}> Chat App </h1>{" "}
        <Button
          variant="contained"
          style={{
            marginRight: "10px",
            backgroundColor: "#F3FCF0",
            color: "#028090",
          }}
          onClick={logOutUser}
        >
          Logout{" "}
        </Button>{" "}
      </div>{" "}
      {/* List of users */}{" "}
      <List className="users-list">
        {" "}
        {allUsers.map((item) => (
          <ListItem
            className="user-item"
            key={item._id}
            style={{
              display: item._id === user.userId ? "none" : "flex",
              cursor: "pointer",
              backgroundColor: "#f5f5f5",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgb(204 204 204 / 63%)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#e0e0e0",
                transform: "scale(1.05)",
              },
            }}
          >
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant={onlineUsers.includes(item._id) ? "dot" : "standard"}
            >
              <Avatar
                // alt={item.username.toUpperCase()}
                src="src"
                sx={{ bgcolor: deepPurple[500] }}
              />{" "}
            </StyledBadge>{" "}
            <ListItemText
              primary={item.username}
              style={{
                marginLeft: "10px",
                color: "purple",
                fontWeight: "bold",
                fontSize: "40px",
              }}
            />{" "}
            <Button
              variant="contained"
              style={{ marginRight: "10px" }}
              component={Link}
              to={`/chat/${item._id}`}
            >
              Message{" "}
            </Button>{" "}
            {friends.includes(item._id) ? (
              <Button
                variant="contained"
                onClick={() => unfollowHandler(item._id)}
              >
                Unfollow{" "}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => followHandler(item._id)}
              >
                Follow{" "}
              </Button>
            )}{" "}
          </ListItem>
        ))}{" "}
      </List>{" "}
    </div>
  );
};

export default MainPage;
