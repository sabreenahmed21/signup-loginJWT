import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useForm } from "react-hook-form";

const Verifypassword = () => {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [tokenValid, setTokenValid] = React.useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setTokenValid("");
  }, [register]);

  const handleVerifyCode = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/verifycode`,
        {
          code: data.verificationCode,
        }
      );
      const token = response.data.data;
      navigate(`/resetpassword/${token}`);
    } catch (error) {
      setTokenValid(error.message);
    }
  };

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
          Enter Security Code
        </Typography>
        <Box mt="20px" border="1px gray solid" borderRadius="10px" p="20px">
          <Typography style={{ color: grey[600], marginBottom: "15px" }}>
            Please check your email for a message with your code. Your code is 8
            digits along.
          </Typography>
          <form noValidate onSubmit={handleSubmit(handleVerifyCode)}>
            <TextField
              type="text"
              fullWidth
              placeholder="Enter code"
              sx={{ marginTop: "5px", marginBottom: "5px" }}
              {...register("verificationCode", {
                required: { value: true, message: "Verification code is required" },
              })}
              error={Boolean(errors.verificationCode || tokenValid)}
            />
              <Typography color="error" sx={{ fontSize: "0.9rem" }}>
                {errors.verificationCode?.message || tokenValid }
              </Typography>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              fullWidth
              sx={{ padding: "16.5px 14px", fontWeight: "500", marginTop: "15px" }}
            >
              Continue
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default Verifypassword;
