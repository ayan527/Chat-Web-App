import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import Dashboard from '.';
import { isOfflineForDatabase } from '../../context/profile.context';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import { auth, database } from '../../misc/firebase';

const DashboardToggle = () => {
  const { isOpen, openModal, closeModal } = useModalState();
  const isMobileDevice = useMediaQuery('(max-width: 992px)');

  const onSignOut = useCallback(() => {
    database
      .ref(`/status/${auth.currentUser.uid}`)
      .set(isOfflineForDatabase)
      .then(() => {
        auth.signOut();
        Alert.info('Signed out', 4000);
        closeModal();
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });
  }, [closeModal]);

  return (
    <>
      <Button block color="blue" onClick={openModal}>
        <Icon icon="dashboard" /> Dashboard
      </Button>
      <Drawer
        full={isMobileDevice}
        show={isOpen}
        onHide={closeModal}
        placement="left"
      >
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
