import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";

import { ReduxStoreType } from "../types/reduxTypes";
import { UserType } from "../types/app";
import updateUser from "../api/put/updateUser";
import { useSnackbar, VariantType } from "notistack";
import refreshToken from "../api/post/refreshToken";
import meUser from "../api/delete/meUser";

const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupInput, setPopupInput] = useState(false);
  const [popupInputError, setPopupInputError] = useState(false);

  const handlePopup = (open: boolean) => setOpenPopup(open);

  const user = useSelector((state: ReduxStoreType) => state.user);

  const { enqueueSnackbar } = useSnackbar();
  const throwNewSnackbar = (variant: VariantType, message: string) =>
    enqueueSnackbar(message, { variant });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    retry: boolean
  ) => {
    throwNewSnackbar("info", "Saving profile...");
    event.preventDefault();
    const formData = new FormData();
    profileImage && formData.append("profileImage", profileImage);
    userInfo && formData.append("firstName", userInfo.firstName);
    userInfo && formData.append("lastName", userInfo.lastName);

    try {
      const res = await updateUser(formData);
      if (res) {
        throwNewSnackbar("success", "Saved");
      }
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await updateUser(formData);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to save profile");
        }
      }
    }
  };

  const deleteAccount = async (retry: boolean) => {
    try {
      if (popupInput) {
        await meUser();
        window.location.reload();
      } else {
        setPopupInputError(true);
      }
    } catch (error) {
      if (retry) {
        try {
          await refreshToken();
          await deleteAccount(false);
        } catch (error: any) {
          const { text } = JSON.parse(error?.message);
          throwNewSnackbar("error", text || "Failed to delete profile");
        }
      }
    }
  };

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  useEffect(() => void setUserInfo(user), [user]);

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        <Box
          component="form"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
            handleSubmit(event, true)
          }
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                type="text"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={userInfo?.firstName || ""}
                onChange={(event) =>
                  userInfo &&
                  setUserInfo({ ...userInfo, firstName: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={userInfo?.lastName || ""}
                onChange={(event) =>
                  userInfo &&
                  setUserInfo({ ...userInfo, lastName: event.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                disabled
                // onChange={() => setError(null)}
                value={userInfo?.email || ""}
                onChange={(event) =>
                  userInfo &&
                  setUserInfo({ ...userInfo, email: event.target.value })
                }
              />
            </Grid>
            <Grid
              item
              container
              xs={12}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="contained"
                component="label"
                sx={{ color: "secondary.light", mr: 2 }}
              >
                Upload Profile Photo
                <input
                  name="profileImage"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  hidden
                  onChange={(event) =>
                    event.target.files && setProfileImage(event.target.files[0])
                  }
                />
              </Button>
              {profileImage && (
                <Typography component="h1" variant="subtitle1">
                  {profileImage.name}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, color: "secondary.light" }}
          >
            Save
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          color="error"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => handlePopup(true)}
        >
          Delete Account
        </Button>
        <Dialog open={openPopup} onClose={() => handlePopup(false)}>
          <DialogTitle color="error">Delete Your Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This operation will permanently delete your account and all the
              data associated with it. This operation cannot be revoked.
            </DialogContentText>
            <Divider />
            <DialogContentText color="primary">
              Please type <i>permanently delete</i> below
            </DialogContentText>
            <TextField
              margin="dense"
              id="name"
              label="Permanently Delete"
              type="text"
              fullWidth
              variant="standard"
              error={popupInputError}
              placeholder="permanently delete"
              onChange={(event) => {
                popupInputError && setPopupInputError(false);
                setPopupInput("permanently delete" === event.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button color="success" onClick={() => handlePopup(false)}>
              Cancel
            </Button>
            <Button color="error" onClick={() => deleteAccount(true)}>
              Delete for ever
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Profile;
