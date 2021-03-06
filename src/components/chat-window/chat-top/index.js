import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import RoomInfoBtnModal from './RoomInfoBtnModal';
import EditRoomInfoBtnDrawer from './EditRoomInfoBtnDrawer';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery } from '../../../misc/custom-hooks';

const ChatTop = () => {
  const roomName = useCurrentRoom(room => room.name);
  const isAdmin = useCurrentRoom(room => room.isAdmin);

  const isMobile = useMediaQuery('(max-width: 992px)');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="text-disappear d-flex align-items-center">
          <Icon
            componentClass={Link}
            to="/"
            icon="arrow-circle-left"
            size="2x"
            className={
              isMobile
                ? 'd-inline-block p-0 mr-2 text-blue link-unstyled'
                : 'd-none'
            }
          />
          <span className="text-disappear">{roomName}</span>
        </h4>
        <ButtonToolbar className="ws-nowrap">
          {isAdmin && <EditRoomInfoBtnDrawer />}
        </ButtonToolbar>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span />
        <RoomInfoBtnModal />
      </div>
    </div>
  );
};

export default memo(ChatTop);
