import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SettingsIcon from '@material-ui/icons/Settings';
import { IconButton } from '@material-ui/core';
import axios from "../axios"
import Cookies from "js-cookie";

export default function Settings({ user , setUser}) {
  const [open, setOpen] = React.useState(false);
  const nameRef = useRef("");
  const imageRef = useRef("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSubmit = () => {
    const newUser = {...user};
    const name = nameRef.current.value.trim() , image = imageRef.current.value.trim();
    if(name) newUser.name = nameRef.current.value;
    if(image) newUser.image = imageRef.current.value;
    if(name || image) {
    (async () => {
        axios.patch('/user', {
            data: newUser
        }).catch((err) => alert('failed to update user data please try again after some time' ) )
    })();
    Cookies.set("user",newUser, {
        expires: 7,
    });
    setUser(newUser)
    }
    setOpen(false);
  }

  return (
    <div>
      <IconButton  onClick={handleClickOpen}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To Change user's name and image please enter your new name and image url.
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label="New Name"
            inputRef = {nameRef}
            fullWidth
          />
           <TextField
            
            margin="dense"
            id="image"
            label="New Image URL"
            inputRef = {imageRef}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
