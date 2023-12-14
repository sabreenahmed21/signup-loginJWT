import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [tokenValid, setTokenValid] = useState(true);

  const handleResetPassword = async ({password,passwordConfirm} ) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/api/resetpassword/${token}`,
        {
          password,
          passwordConfirm,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Password Reset',
        text: 'Password reset successfully 💕',
        timer: 3000, 
        showConfirmButton: false, 
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      setTokenValid(false)
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ mode: "onBlur" });

  const passwordm = watch("password", "");

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
          Choose a new Password
        </Typography>
        <Box mt="20px" border="1px gray solid" borderRadius="10px" p="20px">
          <Typography style={{ color: grey[600], marginBottom: "15px" }}>
            Create a new password
          </Typography>
          {!tokenValid && (
            <Typography color="error" sx={{ fontSize: "0.9rem", marginBottom: "15px" }}>
              Token has expired. Please request a new reset code.
            </Typography>
          )}
          <form onSubmit={handleSubmit(handleResetPassword)}>
            <Box mb="15px">
              <TextField
                type="password"
                placeholder="New password"
                fullWidth
                sx={{ marginTop: "5px", marginBottom: "5px" }}
                {...register("password", {
                  required: { value: true, message: "Password is required" },
                })}
              />
              <Typography color="error" sx={{ fontSize: "0.9rem" }}>
                {errors.password?.message}
              </Typography>
            </Box>
            <Box mb="15px">
              <TextField
                type="password"
                placeholder="Confirm new password"
                fullWidth
                sx={{ marginTop: "0px", marginBottom: "5px" }}
                {...register("passwordConfirm", {
                  required: {
                    value: true,
                    message: "PasswordConfirm is required",
                  },
                  validate: {
                    matchPassword: (value) => {
                      return value === passwordm || "Passwords do not match";
                    },
                  },
                })}
              />
              <Typography color="error" sx={{ fontSize: "0.9rem" }}>
                {errors.passwordConfirm?.message}
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="medium"
              fullWidth
              sx={{ padding: "16.5px 14px", fontWeight: "500" }}
            >
              Save password
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};
export default ResetPassword;
