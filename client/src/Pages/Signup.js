import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSubmitForm = async (data) => {
    await axios.post(`${process.env.REACT_APP_BASE_URL}/api/signup`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate("/verify-email");
  };

  const {
    register,
    control,
    watch,
    formState: { errors },
    reset,
    handleSubmit
  } = useForm({ mode: "onBlur" });

  const password = watch("password", "");

  return (
    <Container maxWidth="sm">
      <Box pt="50px" pb="50px">
        <DevTool control={control} />
        <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
          <Box>
            <TextField
              type="text"
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              id="name"
              {...register("name", {
                required: { value: true, message: "Username is required" },
              })}
            />
            <Typography style={{ color: "red", fontSize: "0.9rem" }}>
              {errors.name?.message}
            </Typography>
          </Box>
          <Box>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              id="email"
              {...register("email", {
                required: { value: true, message: "Email is required" },
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Invalid email value",
                },
                validate: {
                  notAdmin: (fieldValue) => {
                    return (
                      fieldValue !== "sabreenahmed4444@gmail.com" ||
                      "Enter a different email address"
                    );
                  },
                  emailAvailable: async (fieldValue) => {
                    const res = await fetch(
                      `${process.env.REACT_APP_BASE_URL}/api/users?email=${encodeURIComponent(
                        fieldValue
                      )}`
                    );
                    const data = await res.json();
                    return (
                      !data.users.some(
                        (user) =>
                          user.email.toLowerCase() === fieldValue.toLowerCase()
                      ) || "Email already exists"
                    );
                  },
                },
              })}
            />
            <Typography style={{ color: "red", fontSize: "0.9rem" }}>
              {errors.email?.message}
            </Typography>
          </Box>
          <Box>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              id="password"
              {...register("password", {
                required: { value: true, message: "Password is required" },
              })}
            />
            <Typography style={{ color: "red", fontSize: "0.9rem" }}>
              {errors.password?.message}
            </Typography>
          </Box>
          <Box>
            <TextField
              label="PasswordConfirm"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              id="passwordConfirm"
              {...register("passwordConfirm", {
                required: {
                  value: true,
                  message: "PasswordConfirm is required",
                },
                validate: {
                  matchPassword: (value) => {
                    return value === password || "Passwords do not match";
                  },
                },
              })}
            />
            <Typography style={{ color: "red", fontSize: "0.9rem" }}>
              {errors.passwordConfirm?.message}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="medium"
            fullWidth
            type="submit"
            sx={{ padding: "16.5px 14px" , marginTop:'15px' }}
          >
            Sign Up
          </Button>
          <Button type="button" onClick={() => reset()}>
            Reset
          </Button>
        </form>
        <Box display="flex">
          <Typography color="initial">Have an account?</Typography>
          <Link
            to="/login"
            style={{
              color: " #1976d2 ",
              paddingLeft: "5px",
            }}
          >
            Login
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
