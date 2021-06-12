import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, Loader } from 'rsuite';
import { useRooms } from '../../context/rooms.context';
import RoomItem from './RoomItem';

const ChatRoomList = ({ aboveHeight }) => {
  const roomList = useRooms();
  const location = useLocation();

  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style={{
        height: `calc(100% - ${aboveHeight}px)`,
      }}
      activeKey={location.pathname}
    >
      {!roomList && (
        <Loader
          center
          vertical
          backdrop
          size="lg"
          content="Loading..."
          speed="slow"
        />
      )}
      {roomList &&
        roomList.length > 0 &&
        roomList.map(room => (
          <Nav.Item
            componentClass={Link}
            to={`/chat/${room.id}`}
            key={room.id}
            eventKey={`/chat/${room.id}`}
          >
            <RoomItem room={room} />
          </Nav.Item>
        ))}
    </Nav>
  );
};

export default ChatRoomList;
