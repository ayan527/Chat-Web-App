import React from 'react';
import moment from 'moment';
import { Whisper, Tooltip, Badge } from 'rsuite';
import { usePresence } from '../misc/custom-hooks';

const getPresenceColor = presence => {
  if (!presence) {
    return 'gray';
  }

  switch (presence.state) {
    case 'online':
      return 'green';
    case 'offline':
      return 'red';
    default:
      return 'gray';
  }
};

const getPresenceText = presence => {
  if (!presence) {
    return 'Unknown state';
  }

  return presence.state === 'online'
    ? 'Online'
    : `Last online ${moment(
        new Date(presence.last_changed).toLocaleDateString()
      ).format('DD/MM/YYYY')}`;
};

const PresenceDot = ({ uid }) => {
  const presence = usePresence(uid);

  return (
    <Whisper
      placement="top"
      trigger="hover"
      speaker={<Tooltip>{getPresenceText(presence)}</Tooltip>}
    >
      <Badge
        className="cursor-pointer"
        style={{ backgroundColor: getPresenceColor(presence) }}
      />
    </Whisper>
  );
};

export default PresenceDot;
