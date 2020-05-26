import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Modal from '@material-ui/core/Modal';
import SignIn from '../SignIn/SignIn';
import Document from '../Document/Document';
import firebase from '../../firebase/clientApp';
import { useUser } from '../../firebase/userContext';

const useStyles = makeStyles(() => ({
  appbar: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default () => {
  const classes = useStyles();
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // menu
  const handleAccountMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };
  const handleSignIn = () => {
    setAnchorEl(null);
    setActiveModal('signIn');
  };
  const handleSignOut = () => {
    firebase.auth().signOut();
    setAnchorEl(null);
  };
  const handleNewDocument = () => {
    setActiveModal('newDocument');
  };

  // modal
  const handleModalClose = () => {
    setActiveModal(null);
  };

  return (
    <div className={classes.appbar}>

      {/* Appbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {user ? `${user.firstName} ${user.lastName}` : 'Nextjs + Firebase + Material UI Study' }
          </Typography>
          <div>
            {user && (
              <IconButton
                aria-label="add document"
                onClick={handleNewDocument}
                color="inherit"
              >
                <NoteAddIcon />
              </IconButton>
            )}
            <IconButton
              aria-label="account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleAccountMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleAccountMenuClose}
            >
              {!user && <MenuItem onClick={handleSignIn}>Sign In</MenuItem>}
              {user && <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Modal */}
      {activeModal && (
        <Modal
          className={classes.modal}
          open={Boolean(activeModal)}
          onClose={handleModalClose}
          aria-labelledby="modal title"
          aria-describedby="modal description"
        >
          <>
            {activeModal === 'signIn' && <SignIn setActiveModal={setActiveModal} />}
            {activeModal === 'newDocument' && <Document newDocument setActiveModal={setActiveModal} />}
          </>
        </Modal>
      )}
    </div>
  );
};
