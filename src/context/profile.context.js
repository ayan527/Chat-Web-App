import { React, createContext, useState, useContext, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth, database } from '../misc/firebase';

export const isOfflineForDatabase = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let currentUserStatusRef;
    let currentUserRef;

    const authUnsub = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        // console.log(currentUser);
        currentUserStatusRef = database.ref(`/status/${currentUser.uid}`);

        currentUserRef = database.ref(`/profiles/${currentUser.uid}`);
        currentUserRef.on('value', snapshot => {
          const data = snapshot.val();
          // console.log('snapshot', data);

          const { name, createdAt, picture } = data;

          const currentUserData = {
            name,
            createdAt,
            picture,
            uid: currentUser.uid,
            email: currentUser.email,
          };

          setProfile(currentUserData);
          setLoading(false);
        });

        database.ref('.info/connected').on('value', snapshot => {
          if (!!snapshot.val() === false) {
            return;
          }

          currentUserStatusRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(() => {
              currentUserStatusRef.set(isOnlineForDatabase);
            });
        });
      } else {
        if (currentUserRef) {
          currentUserRef.off();
        }

        if (currentUserStatusRef) {
          currentUserStatusRef.off();
        }

        database.ref('.info/connected').off();

        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsub();

      if (currentUserStatusRef) {
        currentUserStatusRef.off();
      }

      database.ref('.info/connected').off();

      if (currentUserRef) {
        currentUserRef.off();
      }
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
