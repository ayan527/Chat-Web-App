import React from 'react';
import { Button, Divider, Drawer, Icon } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import EditInput from '../EditInput';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();
  const profileName = profile.name;

  const onSave = async newValue => {
    console.log(newValue);
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Title</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h3>Hello, {profileName}</h3>
        <Divider />
        <EditInput
          initialValue={profileName}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
          placeholder="Enter a nickname"
          emptyMsg="Nickname can't be empty"
          name="nickname"
        />
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
