import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../Redux/UserSlice.js";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { currentUser } = useSelector((state) => state.user);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setEmailError("");
    setPasswordError("");
  }, [register]);

  if (currentUser) {
    navigate("/home");
    return null;
  }
  const onSubmit = async (formData) => {
    dispatch(signInStart());
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await res.json();
      console.log(data);
      if (data.state === "success") {
        dispatch(signInSuccess(data));
        navigate("/home");
      } else {
        dispatch(signInFailure(data.message));
        if ( data.message === "User not found") {
          setEmailError(
            "Email not found. Please check your email and try again."
          );
        } else if ( data.message === "Incorrect password") {
          setPasswordError("Incorrect password");
        } else if ( data.message === "User not verified"){
          setEmailError(
            "Email not verified. Please verify your email and try again."
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Container maxWidth="sm">
      <Box pt="50px" pb="50px">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Box mb="20px">
            <label>Email</label>
            <TextField
              id="email"
              type="email"
              fullWidth
              sx={{ marginTop: "7px", marginBottom: "7px" }}
              {...register("email", {
                required: { value: true, message: "Email is required" },
              })}
              error={Boolean(errors.email || emailError)}
            />
            <Typography color="error" sx={{ fontSize: "0.9rem" }}>
              {errors.email?.message || emailError}
            </Typography>
          </Box>

          <Box mb="20px">
            <label>Password</label>
            <TextField
              id="password"
              type="password"
              fullWidth
              sx={{ marginTop: "7px", marginBottom: "7px" }}
              {...register("password", {
                required: { value: true, message: "Password is required" },
              })}
              error={Boolean(errors.password || passwordError)}
            />
            <Typography color="error" sx={{ fontSize: "0.9rem" }}>
              {errors.password?.message || passwordError}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="medium"
            fullWidth
            type="submit"
            sx={{ padding: "16.5px 14px" }}
          >
            login
          </Button>
        </form>
        <Link
          to="/forgetPassword"
          style={{
            color: " #1976d2 ",
            display: "flex",
            margin: " 20px 0",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          Forgotten password?
        </Link>
        <Divider>OR</Divider>
        <Box sx={{ display: "flex", marginTop: "20px" }}>
          <Typography color="initial">Don't have an account?</Typography>
          <Link
            to="/signup"
            style={{
              color: " #1976d2 ",
              paddingLeft: "5px",
            }}
          >
            signup
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
