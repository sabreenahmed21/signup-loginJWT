import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/UserSlice";
import {
  Box,
  Button,
  IconButton,
  Menu,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { FaAngleDown, FaAngleUp, FaUser, FaUserCheck } from "react-icons/fa6";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handlelogout = () => {
    dispatch(logout());
  };
  const [open, setOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    setOpen(!open);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setOpen(!open);
  };
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          {currentUser ? (
            <>
              <Box>
                <Tooltip title="Open settings">
                  <Box
                    onClick={handleOpenUserMenu}
                    sx={{
                      display: "flex",
                      cursor: "pointer",
                      alignItems: "center",
                    }}
                  >
                    {open ? <FaAngleUp /> : <FaAngleDown />}
                    <Typography>Hello, {currentUser.data.user.name}</Typography>
                    <IconButton
                      style={{ color: "#fff", paddingLeft: "3px" }}
                      size="small"
                    >
                      <FaUserCheck />
                    </IconButton>
                  </Box>
                </Tooltip>
                <Menu
                  sx={{
                    mt: "46px",
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                    <Button
                      onClick={() => navigate("/profilePage")}
                      sx={{ width: "100px", margin: " 0 20px", display:'block' }}
                    >
                      Your profile
                    </Button>
                    <Button
                      onClick={handlelogout}
                      sx={{ width: "100px", margin: " 0 20px" }}
                    >
                      logout
                    </Button>
                </Menu>
              </Box>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                color: "#fff",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography>Sign in</Typography>
              <IconButton
                style={{ color: "#fff", paddingLeft: "3px" }}
                size="small"
              >
                <FaUser />
              </IconButton>
            </Link>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;

/* */
