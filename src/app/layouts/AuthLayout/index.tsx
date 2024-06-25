import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { setRole, setUserCredential } from "../../../redux/authSlice";
import { jwtDecode } from "jwt-decode";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

type Props = {};

const AuthLayout = (props: Props) => {
  let token = localStorage.getItem("token") || "";
  if (!token) {
    return <Navigate to="/login" />;
  }

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.userCredential);
  const role = useAppSelector((state) => state.auth.role);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userCredential) => {
      if (userCredential) {
        const user = userCredential.toJSON();
        const token = await userCredential.getIdToken(false);
        const decode: any = jwtDecode(token);
        dispatch(setUserCredential(user));
        dispatch(setRole(decode.role));
      } else {
        localStorage.removeItem("token");
        dispatch(setUserCredential(null));
        dispatch(setRole("user"));
        navigate("/login");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth).finally(() => {
      localStorage.removeItem("token");
      dispatch(setUserCredential(null));
      dispatch(setRole("user"));
      navigate("/login");
    });
  };
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link href="/">
              <img
                src="https://upload.wikimedia.org/wikipedia/vi/thumb/b/b2/Logo_Gi%E1%BA%A3i_v%C3%B4_%C4%91%E1%BB%8Bch_b%C3%B3ng_%C4%91%C3%A1_ch%C3%A2u_%C3%82u_2024.png/220px-Logo_Gi%E1%BA%A3i_v%C3%B4_%C4%91%E1%BB%8Bch_b%C3%B3ng_%C4%91%C3%A1_ch%C3%A2u_%C3%82u_2024.png"
                alt=""
                width={40}
              />
            </Link>

            <Box sx={{ flexGrow: 1, paddingLeft: 2, display: "flex" }}>
              <Button
                onClick={() => navigate("/")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Home
              </Button>
              <Button
                onClick={() => navigate("/rule")}
                sx={{
                  my: 2,
                  color: "white",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Rule
              </Button>
              <Button
                onClick={() => navigate("/leaderboard")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Leaderboard
              </Button>
              {role === "admin" && (
                <Button
                  onClick={() => navigate("/tracking")}
                  sx={{
                    my: 2,
                    color: "white",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Tracking
                </Button>
              )}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user?.displayName} />
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
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography>
                    Hello, {user?.displayName || user?.email}
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/rule");
                    handleCloseUserMenu();
                  }}
                  sx={{
                    display: { xs: "flex", sm: "none" },
                  }}
                >
                  <Typography>Rule</Typography>
                </MenuItem>
                {role === "admin" && (
                  <MenuItem
                    onClick={() => {
                      navigate("/tracking");
                      handleCloseUserMenu();
                    }}
                    sx={{
                      display: { xs: "flex", sm: "none" },
                    }}
                  >
                    <Typography>Tracking</Typography>
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
