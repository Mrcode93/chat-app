import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { Context } from "../context/Context";

const defaultTheme = createTheme();

export default function SignUp() {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRigisterLoading,
  } = useContext(Context);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        component="main"
        maxWidth="xs"
        style={{ fontFamily: "'Cairo',  sans-serif" }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>{" "}
          <Typography
            component="h1"
            variant="h5"
            style={{ fontFamily: "'Cairo',  sans-serif" }}
          >
            تسجيل حساب{" "}
          </Typography>{" "}
          <Box
            component="form"
            noValidate
            onSubmit={registerUser}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="username"
                  autoFocus
                  onChange={(e) =>
                    updateRegisterInfo({
                      ...registerInfo,
                      username: e.target.value,
                    })
                  }
                />{" "}
              </Grid>{" "}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) =>
                    updateRegisterInfo({
                      ...registerInfo,
                      email: e.target.value,
                    })
                  }
                />{" "}
              </Grid>{" "}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={(e) =>
                    updateRegisterInfo({
                      ...registerInfo,
                      password: e.target.value,
                    })
                  }
                />{" "}
              </Grid>{" "}
            </Grid>{" "}
            {isRigisterLoading ? (
              <Button
                disabled
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                تحميل...{" "}
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ fontFamily: "'Cairo',  sans-serif" }}
              >
                تسجيل{" "}
              </Button>
            )}{" "}
            {/* {/ * add error message here * /}{" "} */}{" "}
            {registerError && (
              <Typography
                variant="body2"
                color="white"
                align="center"
                style={{
                  backgroundColor: "tomato",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                {" "}
                {registerError}{" "}
              </Typography>
            )}{" "}
            <Grid container justifyContent="center">
              <Grid item>
                <Link
                  to="/"
                  variant="body2"
                  style={{
                    marginTop: "20px",
                    fontFamily: "'Cairo',  sans-serif",
                  }}
                >
                  هل لديك حساب مسجل؟ سجل دخول{" "}
                </Link>{" "}
              </Grid>{" "}
            </Grid>{" "}
          </Box>{" "}
        </Box>{" "}
      </Container>{" "}
    </ThemeProvider>
  );
}

// const handleSubmit = (event) => {
//   event.preventDefault();
//   registerUser;

//   toast.success(`تم التسجيل بنجاح`, {
//     position: "top-center",
//     autoClose: 2000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//     theme: "dark",
//   });

//   setInterval(() => {
//     window.location.href = "/login";
//   }, 3000);
// };
//   event.preventDefault();
//   registerUser;
//   // const data = new FormData(event.currentTarget);
//   // console.log({
//   //   email: data.get("firstName").toLowerCase(),
//   //   password: data.get("password"),
//   // });

//   // axios
//   //   .post(Url, {
//   //     username: data.get("firstName").toLowerCase(),
//   //     password: data.get("password"),
//   //   })
//   // .then(() => {
//   //   toast.success(`تم التسجيل بنجاح`, {
//   //     position: "top-center",
//   //     autoClose: 2000,
//   //     hideProgressBar: false,
//   //     closeOnClick: true,
//   //     pauseOnHover: true,
//   //     draggable: true,
//   //     progress: undefined,
//   //     theme: "dark",
//   //   });

//   // setInterval(() => {
//   //   window.location.href = "/login";
//   // }, 3000);
//   // })
//   // .catch((err) => {
//   //   console.log(err);
//   //   setError(err.response.data.message);
//   // });
// };
