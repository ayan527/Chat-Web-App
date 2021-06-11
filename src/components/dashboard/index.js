import React from 'react';
import { Button, Drawer, Icon } from 'rsuite';
import { useProfile } from '../../context/profile.context';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Title</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h3>Hello, {profile.name}</h3>
      </Drawer.Body>

      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>
          <Icon icon="sign-out" /> Sign Out
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;
