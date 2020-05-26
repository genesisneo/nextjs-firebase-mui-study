import {
  useState,
  useEffect,
  createContext,
  useContext,
} from 'react';
import firebase from './clientApp';

export const UserContext = createContext();

// Custom hook that shorhands the context
export const useUser = () => useContext(UserContext);

// UserProvider
export default ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Listen authenticated user
    const unsubscriber = firebase
      .auth()
      .onAuthStateChanged(async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const { uid, email } = firebaseUser;

            // firestore collection = user
            firebase
              .firestore()
              .collection('users')
              .doc(uid)
              .get()
              .then(
                (firestoreUser) => {
                  const { firstName, lastName } = firestoreUser.data();
                  setUser({
                    uid,
                    email,
                    firstName,
                    lastName,
                  });
                },
              )
              .catch(
                (error) => console.log('Error: ', error), // eslint-disable-line no-console
              );
          } else {
            setUser(null);
          }
        } catch (error) {
          console.log('Error: ', error); // eslint-disable-line no-console
        } finally {
          setLoadingUser(false);
        }
      });

    // Unsubscribe auth listener on unmount
    return () => unsubscriber();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};
