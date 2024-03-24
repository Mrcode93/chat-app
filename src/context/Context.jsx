import { createContext, useState, useCallback } from "react";
import { postRequest, baseUrl, getRequest } from "../utils/services";
import { toast } from "react-toastify";
export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRigisterLoading, setIsRigisterLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [allUsers, setAllUsers] = useState([]);

  // ! get users from backend
  const getUsers = useCallback(async () => {
    const response = await getRequest(
      `${baseUrl}/auth/allUsers`,
      JSON.stringify({})
    );
    setAllUsers(response);
    return response;
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRigisterLoading(true);
      setRegisterError(null);

      try {
        const response = await postRequest(
          `${baseUrl}/auth/register`,
          JSON.stringify(registerInfo)
        );

        if (response.error) {
          setRegisterError(response.message);
        } else {
          toast.success(`تم التسجيل بنجاح`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

          setTimeout(() => {
            window.location.href = "/login";
          }, 3000);

          setUser(response);
        }
      } catch (error) {
        // Handle error
        setRegisterError("An error occurred during registration.");
        console.error("Registration Error:", error);
      } finally {
        setIsRigisterLoading(false);
      }
    },
    [registerInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);

      try {
        const response = await postRequest(
          `${baseUrl}/auth/login`,
          JSON.stringify(loginInfo)
        );

        if (!response.error) {
          toast.success(`تم تسجيل الدخول بنجاح`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

          document.cookie = `token=${response.token}`;

          setUser(response);
          sessionStorage.setItem("auth", true);
          sessionStorage.setItem("user", JSON.stringify(response));

          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        }

        if (response.error) {
          setLoginError(response.message);
        }
      } catch (error) {
        // Handle error
        setLoginError(error.message);
        console.error("Registration Error:", error);
      } finally {
        setIsLoginLoading(false);
      }
    },
    [loginInfo]
  );

  const logOutUser = useCallback(() => {
    document.cookie = `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    sessionStorage.removeItem("auth");
    window.location.href = "/login";
    setUser(null);
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  // get user by id
  const getUserById = useCallback(async (id) => {
    const response = await getRequest(
      `${baseUrl}/auth/users/${id}`,
      JSON.stringify({})
    );
    setCurrentUser(response);
    return response;
  });

  return (
    <Context.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRigisterLoading,
        logOutUser,
        updateLoginInfo,
        loginInfo,
        loginUser,
        loginError,
        isLoginLoading,
        getUsers,
        currentUser,
        allUsers,
        getUserById,
        setUser,
      }}
    >
      {" "}
      {children}{" "}
    </Context.Provider>
  );
};
