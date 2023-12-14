import React from "react";
import { Button, Box, Container } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/UserSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const accessToken = currentUser?.token;

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover your account!",
      icon: "warning",
      showCancelButton: true,
    }).then((data) => {
      if (data.isConfirmed) {
        try{
        axios.delete(`${process.env.REACT_APP_BASE_URL}/api/delete-me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        dispatch(logout());
        navigate('/home');
        Swal.fire({
          icon: "success",
          title: "Account deleted successfully!",
          timer: 3000,
          showConfirmButton: false,
        });
        return null;
      } catch (error) {
        console.log(error);
      }
    }})
  };

  return (
    <Container>
      <Box>
        <Button
          variant="contained"
          size="medium"
          type="submit"
          onClick={handleDeleteAccount}
          sx={{
            marginTop: "15px",
            backgroundColor: "#8B0000",
            color: "white",
            "&:hover": {
              backgroundColor: "#6B0000",
            },
          }}
        >
          Delete my account
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
