import React from 'react';
import { Alert, Button, Divider, Drawer, Icon } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { database } from '../../misc/firebase';
import { getUserUpdates } from '../../misc/helper-funcs';
import EditInput from '../EditInput';
import ProfilePicUploadBtn from './ProfilePicUploadBtn';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();
  const profileName = profile.name;

  const onSave = async newValue => {
    // console.log(newValue);
    try {
      const updates = await getUserUpdates(
        profile.uid,
        'name',
        newValue,
        database
      );

      await database.ref().update(updates);

      Alert.success('Nickname updated successfully', 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Manage your Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h3>Hello, {profileName}</h3>
        <ProviderBlock />
        <Divider />
        <EditInput
          initialValue={profileName}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
          placeholder="Enter a nickname"
          emptyMsg="Nickname can't be empty"
          name="nickname"
        />
        <ProfilePicUploadBtn />
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
