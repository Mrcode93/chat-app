import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useParams } from "react-router-dom";
import { purple } from "@mui/material/colors";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
  const { allUsers, getUsers } = useContext(Context);
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();
  //  get id from url
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`https://chat-app-speh.onrender.com/auth/users/${id}`)
      .then((response) => {
        setCurrentUser(response.data);
        console.log(response.data);
      });
    getUsers();
    console.log(allUsers);
  }, [id]);

  return (
    <div className="profile-page">
      <h1>Profile Page</h1>
      <Button
        onClick={() => navigate(-1)}
        variant="contained"
        className="back-button"
      >
        <ArrowBackIcon />
      </Button>
      {currentUser && (
        <div className="user-info">
          <Avatar
            alt={currentUser?.username}
            src={currentUser?.profilePicture}
            className="avatar"
            sx={{ width: 60, height: 60, backgroundColor: purple[500] }}
          />
          <h2>{currentUser.username}</h2>
          <p>{currentUser.email}</p>
        </div>
      )}
      <ul className="friends-list">
        {currentUser.friends?.map((friendId, index) => {
          const friendUser = allUsers.find((user) => user._id === friendId);

          if (!friendUser) return "You don't have any friends"; // If friendUser is not found, skip rendering
          return (
            <li key={index} className="friend-card">
              <h3>{friendUser?.username.toUpperCase()}</h3>
              <Avatar
                alt={friendUser?.username.toUpperCase()} // Add a null check here
                src={friendUser.profilePicture}
                className="avatar"
              />
              <Button
                className="chat-button"
                component={Link}
                variant="contained"
                to={`/chat/${friendId}`}
              >
                Chat
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProfilePage;
