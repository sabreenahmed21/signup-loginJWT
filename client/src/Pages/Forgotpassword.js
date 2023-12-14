import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useForm } from "react-hook-form";

export default function Forgotpassword() {
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const handleForgetPassword = async (email) => {
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/forgetpassword`, email);
      navigate("/verifypassword");
    } catch (error) {
      console.log("ForgetPasswordError:", error);
      setEmailError("Invalid email. Please check your email and try again.");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setEmailError("");
  }, [register]);

  return (
    <Container maxWidth="sm">
      <Box pt="50px" pb="50px">
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: "900",
            fontSize: "1.75rem",
            lineHeight: "1",
            letterSpacing: "0.06em",
          }}
        >
          Forget your password?
        </Typography>
        <Box mt="20px" border="1px gray solid" borderRadius="10px" p="20px">
          <Typography style={{ color: grey[600], marginBottom: "15px" }}>
            Please enter your email address associated with your account, and
            we'll send you code to reset your password
          </Typography>
          <form noValidate onSubmit={handleSubmit(handleForgetPassword)}>
            <Box mb="20px">
              <label htmlFor="email">Email</label>
              <TextField
                type="email"
                placeholder="you@email.com"
                fullWidth
                sx={{ marginTop: "5px", marginBottom: "5px" }}
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                })}
                error={Boolean(errors.email || emailError)}
              />
              <Typography color="error" sx={{ fontSize: "0.9rem" }}>
                {errors.email?.message || emailError}
              </Typography>
            </Box>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              fullWidth
              sx={{ padding: "16.5px 14px", fontWeight: "500" }}
            >
              Send reset code
            </Button>
          </form>
          <Link
            to="/login"
            style={{
              color: " #1976d2 ",
              textDecoration: "none",
              marginTop: "15px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Go back
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
