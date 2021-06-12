import React from 'react';
import { Avatar } from 'rsuite';
import { getNameInitials } from '../../misc/helper-funcs';

const ProfilePic = ({ name, ...avatarProps }) => {
  return (
    <Avatar circle {...avatarProps}>
      {getNameInitials(name)}
    </Avatar>
  );
};

export default ProfilePic;
