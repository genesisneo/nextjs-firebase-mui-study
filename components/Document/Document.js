import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import Hidden from '@material-ui/core/Hidden';
import { useUser } from '../../firebase/userContext';
import firebase from '../../firebase/clientApp';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2, 0),
  },
  form: {
    padding: theme.spacing(4),
    outline: 0,
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}));

export default ({
  index,
  document,
  newDocument,
  setActiveModal,
}) => {
  const classes = useStyles();
  const { user } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [documentIdError, setDocumentIdError] = useState(false);
  const [documentFieldError, setDocumentFieldError] = useState(false);

  const handleDeleteDocument = (event) => {
    const currentDocumentId = event.currentTarget.dataset.document;
    firebase
      .firestore()
      .collection('database')
      .doc(currentDocumentId)
      .delete()
      .catch(
        (error) => console.log('Error: ', error), // eslint-disable-line no-console
      );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setDocumentIdError(false);
    setDocumentFieldError(false);

    const {
      [`documentId-${index}`]: {
        value: documentIdValue,
      },
      [`documentField-${index}`]: {
        value: documentFieldValue,
      },
    } = event.target.elements;
    let pareseDocumentFieldValue = {};

    // document id validation
    if (newDocument && documentIdValue === '') {
      setDocumentIdError(true);
    }

    // document field validation
    try {
      pareseDocumentFieldValue = JSON.parse(documentFieldValue);
    } catch (e) {
      setDocumentFieldError(true);
      return;
    }

    const setData = newDocument
      ? {
        ...pareseDocumentFieldValue,
        name: documentIdValue,
      }
      : pareseDocumentFieldValue;

    firebase
      .firestore()
      .collection('database')
      .doc(documentIdValue)
      .set(setData)
      .then(
        () => {
          if (newDocument) {
            setActiveModal(null);
          }
          setEditMode(false);
        },
      )
      .catch(
        (error) => console.log('Error: ', error), // eslint-disable-line no-console
      );
  };

  return (
    <Paper
      className={classes.paper}
      style={{ width: newDocument ? '400px' : 'auto' }}
    >
      <form
        className={classes.form}
        onSubmit={handleSubmit}
      >
        {user && (
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-start"
          >
            {!newDocument && !editMode && (
              <>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteDocument}
                  data-document={document.name}
                >
                  <Hidden xsDown>
                    Delete
                  </Hidden>
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                >
                  <Hidden xsDown>
                    Edit
                  </Hidden>
                </Button>
              </>
            )}
            {(newDocument || editMode) && (
              <>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                  startIcon={<CloseIcon />}
                  onClick={
                    () => {
                      if (newDocument) {
                        setActiveModal(null);
                      }
                      setEditMode(false);
                    }
                  }
                >
                  <Hidden xsDown>
                    Cancel
                  </Hidden>
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  type="submit"
                >
                  <Hidden xsDown>
                    Save
                  </Hidden>
                </Button>
              </>
            )}
          </Grid>
        )}
        <TextField
          id={`documentId-${index}`}
          label="Document ID"
          type="text"
          fullWidth
          margin="normal"
          error={documentIdError}
          helperText={documentIdError ? 'Invalid document id. It must be a valid string.' : ''}
          disabled={!newDocument}
          defaultValue={newDocument ? '' : document.name}
        />
        <TextField
          id={`documentField-${index}`}
          label="Document Field"
          type="text"
          fullWidth
          margin="normal"
          error={documentFieldError}
          helperText={documentFieldError ? 'Invalid document field. It must be a valid json.' : ''}
          disabled={newDocument ? false : !editMode}
          defaultValue={newDocument ? '' : JSON.stringify(document, null, 2)}
          multiline
          rows={8}
          rowsMax={8}
        />
      </form>
    </Paper>
  );
};
