import React, { useState } from 'react';
import firebase from 'firebase/app';
import { Icon, Tag, Button, Alert } from 'rsuite';
import { auth } from '../../misc/firebase';

const ProviderBlock = () => {
  const [isConnected, setIsConnected] = useState({
    'google.com': auth.currentUser.providerData.some(
      data => data.providerId === 'google.com'
    ),
    'facebook.com': auth.currentUser.providerData.some(
      data => data.providerId === 'facebook.com'
    ),
  });

  const updateIsConnected = (providerId, val) => {
    setIsConnected(prev => {
      return {
        ...prev,
        [providerId]: val,
      };
    });
  };

  const unlinkFromProvider = async providerId => {
    try {
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`You can't unlink from ${providerId}`);
      }

      await auth.currentUser.unlink(providerId);
      updateIsConnected(providerId, false);

      Alert.info(`Disconnected from ${providerId}`, 4000);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };
  const unlinkFromFacebook = () => {
    unlinkFromProvider('facebook.com');
  };
  const unlinkFromGoogle = () => {
    unlinkFromProvider('google.com');
  };

  const linkToProvider = async provider => {
    try {
      await auth.currentUser.linkWithPopup(provider);
      updateIsConnected(provider.providerId, true);

      Alert.success(`Connected to ${provider.providerId}`, 4000);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };
  const linkToGoogle = () => {
    linkToProvider(new firebase.auth.GoogleAuthProvider());
  };
  const linkToFacebook = () => {
    linkToProvider(new firebase.auth.FacebookAuthProvider());
  };

  return (
    <div className="mt-1">
      {isConnected['google.com'] && (
        <Tag closable color="green" onClose={unlinkFromGoogle}>
          <Icon icon="google" /> Connected
        </Tag>
      )}
      {isConnected['facebook.com'] && (
        <Tag closable color="blue" onClose={unlinkFromFacebook}>
          <Icon icon="facebook" /> Connected
        </Tag>
      )}
      <div className="mt-2">
        {!isConnected['google.com'] && (
          <Button block color="green" onClick={linkToGoogle}>
            <Icon icon="google" /> Connect to Google
          </Button>
        )}
        {!isConnected['facebook.com'] && (
          <Button block color="blue" onClick={linkToFacebook}>
            <Icon icon="facebook" /> Connect to Facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
