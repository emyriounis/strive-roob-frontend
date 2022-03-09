import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import HideOnScroll from "../tools/HideOnScroll";
import { Divider } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import { Settings } from "@mui/icons-material";
import { Logout } from "@mui/icons-material";

import logoutUser from "../api/post/logoutUser";
import { setUserAction } from "../redux/actions/user";
import { ReduxStoreType } from "../types/reduxTypes.d";
import { Link } from "react-router-dom";
import refreshToken from "../api/post/refreshToken";

const pages = ["Products", "Pricing", "Blog"];

const TopNav = () => {
  const user = useSelector((state: ReduxStoreType) => state.user);
  const dispatch = useDispatch();

  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async (retry: boolean) => {
    try {
      const res = await logoutUser();
      dispatch(setUserAction(null));
    } catch (error: any) {
      const { text } = JSON.parse(error?.message);
      console.log(text);
      if (retry) {
        try {
          await refreshToken();
          await handleLogout(false);
        } catch (error) {
          window.location.reload();
        }
      } else {
        console.log(error);
      }
    }
  };

  return (
    <HideOnScroll>
      <AppBar>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {user ? (
              <>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      mr: 2,
                      display: { xs: "none", md: "flex" },
                      color: "secondary.light",
                      fontWeight: 600,
                    }}
                  >
                    Roob.
                  </Typography>
                </Link>

                <Box
                  sx={{
                    flexGrow: 1,
                    display: { xs: "flex", md: "none" },
                    color: "secondary.light",
                  }}
                >
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    <Link
                      to="/"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <MenuItem key="Home" onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">Home</Typography>
                      </MenuItem>
                    </Link>
                    {pages.map((page) => (
                      <MenuItem key={page} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>

                {/* <Link to="/" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      flexGrow: 1,
                      display: { xs: "flex", md: "none" },
                      color: "secondary.light",
                      fontWeight: 600,
                    }}
                  >
                    Roob.
                  </Typography>
                </Link> */}
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  {pages.map((page) => (
                    <Button
                      key={page}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      {page}
                    </Button>
                  ))}
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={user.firstName}
                        src={user.avatar || "/static/images/avatar/2.jpg"}
                        sx={{
                          color: "primary.main",
                          backgroundColor: "secondary.light",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
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
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    onClick={handleCloseUserMenu}
                  >
                    <Link
                      to="/profile"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <MenuItem>
                        <Avatar
                          alt={user.firstName}
                          src={user.avatar || "/static/images/avatar/2.jpg"}
                          sx={{
                            color: "primary.main",
                            backgroundColor: "secondary.light",
                          }}
                        />
                        Profile
                      </MenuItem>
                    </Link>
                    {/* <MenuItem>
                      <Avatar /> My account
                    </MenuItem> */}
                    <Divider />
                    {/* <MenuItem>
                      <ListItemIcon>
                        <PersonAdd fontSize="small" />
                      </ListItemIcon>
                      Add another account
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      Settings
                    </MenuItem> */}
                    <MenuItem onClick={() => handleLogout(true)}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    mr: 2,
                    color: "secondary.light",
                    fontWeight: 600,
                  }}
                >
                  Roob.
                </Typography>
              </Link>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default TopNav;
