import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Chats from "./pages/chats.jsx";
import MainPage from "./pages/mainPage.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import "../sass/style.css";

function App() {
  const [user, setAuth] = useState(false);
  useEffect(() => {
    sessionStorage.getItem("auth") === "true" ? setAuth(true) : setAuth(false);
  }, []);

  useEffect(() => {
    // Show the toast when the component mounts
    toast.success("مبدئياً السيرفر مجاني ..فأكيد راح يكون بطيء!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    // use the GSAP hook to animate the content
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <Routes>
        <Route path="/" element={user ? <MainPage /> : <Login />} />{" "}
        <Route path="/login" element={user ? <MainPage /> : <Login />} />{" "}
        <Route path="/signup" element={user ? <MainPage /> : <SignUp />} />{" "}
        <Route path="/chat/:userId" element={<Chats />} />{" "}
        <Route path="/profile/:id" element={<ProfilePage />} />{" "}
      </Routes>{" "}
    </>
  );
}

export default App;
