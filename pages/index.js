import {
  Fragment,
  useEffect,
  useState,
} from 'react';
import firebase from '../firebase/clientApp';
import Document from '../components/Document/Document';

export default () => {
  /*
    useState allow functional component to have or declarative state variable
    More: https://reactjs.org/docs/hooks-state.html
  */

  const [documents, setDocuments] = useState([]);

  /*
    If you’re familiar with React class lifecycle methods, you can think of useEffect
    Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined.
    The first params in the callback function. The second params is an array of state
    useEffect will listen to.
    More: https://reactjs.org/docs/hooks-effect.html
  */

  useEffect(() => {
    firebase
      .firestore()
      .collection('database')
      .onSnapshot(
        (snapshots) => {
          const documentsArray = [];
          snapshots.forEach((snapshot) => {
            const modifiedDocument = {
              name: snapshot.id,
              ...snapshot.data(),
            };
            documentsArray.push(modifiedDocument);
          });
          setDocuments(documentsArray);
        },
        (error) => console.log('Error: ', error), // eslint-disable-line no-console
      );
  }, []);

  return (
    <>
      {documents.map((document, index) => {
        const key = `${index}-${document.name}`;
        return (
          <Fragment key={key}>
            <Document index={index} document={document} />
          </Fragment>
        );
      })}
    </>
  );
};
