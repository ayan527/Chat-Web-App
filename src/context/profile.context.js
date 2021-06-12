import { React, createContext, useState, useContext, useEffect } from 'react';
import { auth, database } from '../misc/firebase';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let currentUserRef;

    const authUnsub = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        // console.log(currentUser);

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
      } else {
        if (currentUserRef) {
          currentUserRef.off();
        }

        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsub();

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
