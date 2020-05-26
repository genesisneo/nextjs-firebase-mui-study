import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import firebase from '../../firebase/clientApp';

const useStyles = makeStyles((theme) => ({
  form: {
    padding: theme.spacing(4),
    width: '400px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[4],
    outline: 0,
  },
}));

export default ({ setActiveModal }) => {
  const classes = useStyles();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const signIn = async (event) => {
    event.preventDefault();

    setEmailError(false);
    setPasswordError(false);

    const { email, password } = event.target.elements;

    try {
      const { user: { uid } } = await firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value);
      if (uid) {
        setActiveModal(null);
      }
    } catch (error) {
      const { code } = error;
      if (code === 'auth/invalid-email' || code === 'auth/user-not-found') {
        setEmailError(true);
      } else {
        setPasswordError(true);
      }
    }
  };

  return (
    <form
      className={classes.form}
      onSubmit={signIn}
    >
      <TextField
        id="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        error={emailError}
        helperText={emailError ? 'Invalid email' : ''}
        style={{ marginTop: 0 }}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        error={passwordError}
        helperText={passwordError ? 'Invalid password' : ''}
      />
      <Button
        variant="contained"
        color="secondary"
        type="submit"
        style={{ marginTop: '16px' }}
      >
        Sign In
      </Button>
    </form>
  );
};
