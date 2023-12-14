import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import imgg from "../assets/Screenshot 2023-11-14 113805.png";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

export default function Notfound() {
  const navigate = useNavigate();
  return (
    <Container>
      <Box pt="50px" pb="50px">
        <Box textAlign="center">
          <Typography
            variant="h2"
            sx={{
              fontWeight: "900",
              fontSize: "1.75rem",
              lineHeight: "1",
              letterSpacing: "0.06em",
            }}
          >
            Sorry, page not found!
          </Typography>
          <Typography
            style={{
              color: grey[600],
              width: "100%",
              maxWidth: "48vw",
              margin: "50px auto",
              fontSize:'1.1rem'
            }}
          >
            Sorry, we couldn't find the page you're looking for. Perhaps you've
            mistyped the URL? Be sure to check your spelling and try again.
          </Typography>
          <img src={imgg} alt="not found 404" />
        </Box>
        <Button
          variant="contained"
          size="medium"
          sx={{
            padding: "16.5px 14px",
            margin: " 50px  auto",
            display: "flex",
            justifyContent: "center",
          }}
          onClick={() => navigate("/home")}
        >
          Go to home
        </Button>
      </Box>
    </Container>
  );
}
