import React from 'react';
import { Button, Drawer, Icon } from 'rsuite';
import Dashboard from '.';
import { useModalState } from '../../misc/custom-hooks';

const DashboardToggle = () => {
  const { isOpen, openModal, closeModal } = useModalState();

  return (
    <>
      <Button block color="blue" onClick={openModal}>
        <Icon icon="dashboard" /> Dashboard
      </Button>
      <Drawer show={isOpen} onHide={closeModal} placement="left">
        <Dashboard />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
