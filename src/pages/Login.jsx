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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const { loginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading } =
    useContext(Context);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        component="main"
        maxWidth="xs"
        className="login"
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
          <Typography component="h1" variant="h5">
            تسجيل الدخول
          </Typography>{" "}
          <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={(e) =>
                updateLoginInfo({
                  ...loginInfo,
                  username: e.target.value,
                })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) =>
                updateLoginInfo({
                  ...loginInfo,
                  password: e.target.value,
                })
              }
            />
            {isLoginLoading ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                تحميل ...
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ fontFamily: "'Cairo',  sans-serif" }}
              >
                تسجيل دخول
              </Button>
            )}{" "}
            {loginError && (
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
                {loginError}{" "}
              </Typography>
            )}{" "}
            <Grid container justifyContent="center">
              <Grid item>
                <Link to="/signup" variant="body2">
                  {" "}
                  {"اذا كنت لا تمتلك حساباً ! سجل حساب"}{" "}
                </Link>{" "}
              </Grid>{" "}
            </Grid>{" "}
          </Box>{" "}
        </Box>{" "}
      </Container>{" "}
    </ThemeProvider>
  );
}
