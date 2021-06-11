import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import Dashboard from '.';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import { auth } from '../../misc/firebase';

const DashboardToggle = () => {
  const { isOpen, openModal, closeModal } = useModalState();
  const isMobileDevice = useMediaQuery('(max-width: 992px)');

  const onSignOut = useCallback(() => {
    auth.signOut();

    Alert.info('Signed Out', 4000);

    closeModal();
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
