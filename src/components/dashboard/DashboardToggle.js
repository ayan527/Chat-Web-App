import React from 'react';
import { Button, Drawer, Icon } from 'rsuite';
import Dashboard from '.';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';

const DashboardToggle = () => {
  const { isOpen, openModal, closeModal } = useModalState();
  const isMobileDevice = useMediaQuery('(max-width: 992px)');
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
        <Dashboard />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
